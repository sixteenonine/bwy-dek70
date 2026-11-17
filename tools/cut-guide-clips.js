// ตัดคลิปรายขั้นจากวิดีโออัดหน้าจอ (828×1792, 60 fps): วงกลมจุดแตะ, เบลอของส่วนตัว, ซ่อนเม็ดแดงตอนอัดจอ, ภาพนิ่งคู่
// ใช้: node tools/cut-guide-clips.js <โฟลเดอร์วิดีโอต้นฉบับ> tools/tap-ring.png guide [s3,s6]
const { execFileSync } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");
const [dir, ring, out] = process.argv.slice(2);
const A = dir + "/40d87167-ScreenRecording_11-17-2569_2-17-11PM_1.mov", B = dir + "/3f21ae24-ScreenRecording_11-17-2569_2-41-02PM_1.mov", C = dir + "/7c65bc6e-ScreenRecording_11-17-2569_2-42-49PM_1.mov";
const T = dir + "/37fdcff9-ScreenRecording_11-17-2569_5-03-41PM_1.mp4";
const PILL = "delogo=x=40:y=14:w=136:h=64"; // เม็ดแดง "กำลังอัดหน้าจอ" มุมซ้ายบน
// taps: [x, y, เริ่ม, จบ] เวลาของต้นฉบับ | blurs: [x, y, w, h, เริ่ม, จบ] | parts: [เริ่ม, จบ, ความเร็ว]
// intro: ภาพนิ่งจากอีกคลิป ค้างไว้ก่อนเริ่ม พร้อมวงกลมจุดแตะ
// เม็ดแดงที่ติดมากับแถบสถานะของแอปตอนซูมเปิด (คลิปแรก เฟรมที่ 41–54 ที่ 60 fps): [เฟรม, x0, y0, x1, y1]
const LAUNCH_PILL = [[41,72,250,75,252],[42,64,270,99,287],[43,56,272,109,293],[44,52,254,118,279],[45,48,224,127,253],[46,47,192,136,223],[47,46,159,143,193],[48,46,130,149,166],[49,46,106,153,143],[50,46,86,157,125],[51,46,70,159,109],[52,46,70,161,98],[53,46,70,163,89],[54,48,70,163,83]].map(([n, x0, y0, x1, y1]) => `drawbox=x=${x0 - 4}:y=${y0 - 4}:w=${x1 - x0 + 8}:h=${y1 - y0 + 8}:color=black:t=fill:enable='between(t,${((n - 0.5) / 60).toFixed(4)},${((n + 0.5) / 60).toFixed(4)})'`).join(",");
const clips = {
  // เริ่มจากหน้าจอโฮม แตะไอคอน Scriptable (เล่นช้าลงครึ่งหนึ่งให้เห็นจังหวะเข้าแอป)
  s3: { src: A, top: 90, pre: LAUNCH_PILL, parts: [[0.0, 1.1, 0.5], [1.1, 4.2, 1]], taps: [[122, 185, 0.08, 0.5], [753, 137, 1.9, 2.9]], poster: 2.5 },
  s4: { src: A, top: 90, parts: [[4.2, 9.6, 1]], taps: [[300, 300, 4.7, 6.3], [120, 315, 6.7, 7.6]], poster: 7.2 },
  s5: { src: A, top: 90, parts: [[9.8, 11.6, 1], [11.6, 18.4, 2.2], [18.4, 23.0, 1]], taps: [[414, 139, 9.9, 10.7], [546, 775, 18.5, 19.25], [89, 139, 21.3, 22.2]], poster: 18.9 },
  // ขั้นเพิ่ม Widget (เดิมขั้น 6 + 7) เบลอ Widget Messages ของ Instagram และ Recent ของ Messenger
  s6: { src: B, top: 0, pre: PILL + ":enable='lt(t,1.9)'",
    blurs: [[0, 1140, 828, 652, 6.6, 6.95], [20, 1200, 700, 592, 6.95, 8.25]],
    parts: [[0.2, 7.6, 1], [7.6, 9.9, 2], [9.9, 18.4, 1]],
    taps: [[414, 900, 0.4, 1.6], [115, 58, 3.2, 4.1], [250, 165, 5.2, 6.1], [414, 297, 7.2, 7.7], [276, 497, 13.0, 13.9], [414, 1622, 15.3, 16.25], [710, 58, 17.4, 18.3]], poster: 15.9 },
  // เปลี่ยนธีม: แตะไอคอน → แตะ Dek70 → เปลี่ยนเป็นธีมมืด → โอเค → กลับหน้าจอโฮม Widget เปลี่ยนเป็นสีมืด
  theme: { src: T, top: 90, parts: [[1.3, 3.3, 1], [3.3, 5.2, 2], [5.2, 11.4, 1], [11.4, 13.7, 2], [13.7, 15.9, 1.5], [15.9, 18.6, 1]],
    taps: [[508, 596, 2.5, 2.95], [300, 1375, 5.2, 5.65], [414, 1535, 8.05, 8.5], [414, 1143, 10.75, 11.2]], poster: 7.2 },
  s8: { src: C, top: 90, parts: [[0.2, 2.6, 1], [3.6, 14.7, 1]], taps: [[225, 280, 0.4, 1.8], [240, 710, 3.7, 4.5], [620, 945, 7.7, 8.6], [172, 828, 9.2, 10.05], [414, 1300, 11.2, 11.9]], poster: 9.8 },
};
const ff = args => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
const ENC = ["-an", "-c:v", "libx264", "-profile:v", "high", "-crf", "23", "-preset", "slow", "-pix_fmt", "yuv420p", "-r", "60"];
const ringFx = (taps, base) => {
  let f = `[1:v]format=rgba,split=${taps.length}${taps.map((_, i) => `[k${i}]`).join("")};`, cur = base;
  taps.forEach(([x, y, a, b], i) => {
    f += `[k${i}]fade=t=in:st=${a}:d=0.2:alpha=1,fade=t=out:st=${b}:d=0.25:alpha=1[r${i}];${cur}[r${i}]overlay=x=${x - 90}:y=${y - 90}:enable='between(t,${a},${b + 0.3})'[o${i}];`;
    cur = `[o${i}]`;
  });
  return [f, cur];
};
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "guide-"));
const only = process.argv[5] ? process.argv[5].split(",") : Object.keys(clips);
for (const name of only) {
  const c = clips[name];
  let f = `[0:v]${c.pre || "null"}[b0];`, cur = "[b0]";
  (c.blurs || []).forEach(([x, y, w, h, a, b], i) => {
    f += `${cur}split[m${i}][c${i}];[c${i}]crop=${w}:${h}:${x}:${y},boxblur=28:3[z${i}];[m${i}][z${i}]overlay=${x}:${y}:enable='between(t,${a},${b})'[bl${i}];`;
    cur = `[bl${i}]`;
  });
  const [rf, rc] = ringFx(c.taps, cur); f += rf; cur = rc;
  f += `${cur}crop=iw:ih-${c.top}:0:${c.top},split=${c.parts.length + 1}${c.parts.map((_, i) => `[p${i}]`).join("")}[ps];`;
  c.parts.forEach(([a, b, sp], i) => { f += `[p${i}]trim=${a}:${b},setpts=(PTS-STARTPTS)/${sp}[t${i}];`; });
  f += `${c.parts.map((_, i) => `[t${i}]`).join("")}concat=n=${c.parts.length}:v=1,fps=60,tpad=stop_mode=clone:stop_duration=1.2,format=yuv420p[v];`;
  f += `[ps]trim=${c.poster}:${c.poster + 0.1},setpts=PTS-STARTPTS[j]`;
  const main = c.intro ? `${tmp}/${name}-main.mp4` : `${out}/${name}.mp4`;
  ff(["-i", c.src, "-loop", "1", "-t", "40", "-i", ring, "-filter_complex", f, "-map", "[v]", ...ENC, "-movflags", "+faststart", main,
    "-map", "[j]", "-frames:v", "1", "-q:v", "3", `${out}/${name}.jpg`]);
  if (c.intro) {
    const it = c.intro, still = `${tmp}/${name}-still.png`, introMp4 = `${tmp}/${name}-intro.mp4`;
    ff(["-ss", String(it.at), "-i", it.src, "-frames:v", "1", still]);
    const [x, y, a, b] = it.tap;
    ff(["-loop", "1", "-t", String(it.hold), "-i", still, "-loop", "1", "-t", String(it.hold), "-i", ring, "-filter_complex",
      `[1:v]format=rgba,fade=t=in:st=${a}:d=0.2:alpha=1,fade=t=out:st=${b}:d=0.25:alpha=1[r];[0:v][r]overlay=x=${x - 90}:y=${y - 90}:enable='between(t,${a},${b + 0.3})',crop=iw:ih-${c.top}:0:${c.top},fps=60,format=yuv420p[v]`,
      "-map", "[v]", ...ENC, introMp4]);
    ff(["-i", introMp4, "-i", main, "-filter_complex", "[0:v][1:v]concat=n=2:v=1,format=yuv420p[v]", "-map", "[v]", ...ENC, "-movflags", "+faststart", `${out}/${name}.mp4`]);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
