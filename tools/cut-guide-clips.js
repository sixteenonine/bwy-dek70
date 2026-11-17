// ตัดคลิปรายขั้นจากวิดีโออัดหน้าจอ (828×1792): วงกลมจุดแตะ, ซ่อนเม็ดแดงตอนอัดจอ, ความละเอียดเต็ม, ภาพนิ่งคู่
const { execFileSync } = require("child_process");
const [dir, ring, out] = process.argv.slice(2);
const A = dir + "/40d87167-ScreenRecording_11-17-2569_2-17-11PM_1.mov", B = dir + "/3f21ae24-ScreenRecording_11-17-2569_2-41-02PM_1.mov", C = dir + "/7c65bc6e-ScreenRecording_11-17-2569_2-42-49PM_1.mov";
const PILL = "delogo=x=40:y=14:w=136:h=64"; // เม็ดแดง "กำลังอัดหน้าจอ" มุมซ้ายบน
const clips = {
  s3: { src: A, top: 90, parts: [[0.6, 4.2, 1]], taps: [[753, 137, 1.9, 2.9]], poster: 2.5 },
  s4: { src: A, top: 90, parts: [[4.2, 9.6, 1]], taps: [[300, 300, 4.7, 6.3], [120, 315, 6.7, 7.6]], poster: 7.2 },
  s5: { src: A, top: 90, parts: [[9.8, 11.6, 1], [11.6, 18.4, 2.2], [18.4, 23.0, 1]], taps: [[414, 139, 9.9, 10.7], [546, 775, 18.5, 19.25], [89, 139, 21.3, 22.2]], poster: 18.9 },
  s6: { src: B, top: 0, pre: PILL + ":enable='lt(t,1.9)'", parts: [[0.2, 6.6, 1]], taps: [[414, 900, 0.4, 1.6], [115, 58, 3.2, 4.1], [250, 165, 5.2, 6.1]], poster: 5.8 },
  s7: { src: B, top: 0, parts: [[10.0, 18.4, 1]], taps: [[276, 497, 13.0, 13.9], [414, 1622, 15.3, 16.25], [710, 58, 17.4, 18.3]], poster: 15.9 },
  s8: { src: C, top: 0, pre: PILL + ":enable='lt(t,12.1)'", parts: [[0.2, 2.6, 1], [3.6, 14.7, 1]], taps: [[225, 280, 0.4, 1.8], [240, 710, 3.7, 4.5], [620, 945, 7.7, 8.6], [172, 828, 9.2, 10.05], [414, 1300, 11.2, 11.9]], poster: 9.8 },
};
const only = process.argv[5] ? process.argv[5].split(",") : Object.keys(clips);
for (const name of only) {
  const c = clips[name], n = c.taps.length;
  let f = `[1:v]format=rgba,split=${n}${c.taps.map((_, i) => `[k${i}]`).join("")};[0:v]${c.pre || "null"}[base];`;
  let cur = "[base]";
  c.taps.forEach(([x, y, a, b], i) => {
    f += `[k${i}]fade=t=in:st=${a}:d=0.2:alpha=1,fade=t=out:st=${b}:d=0.25:alpha=1[r${i}];${cur}[r${i}]overlay=x=${x - 90}:y=${y - 90}:enable='between(t,${a},${b + 0.3})'[o${i}];`;
    cur = `[o${i}]`;
  });
  f += `${cur}crop=iw:ih-${c.top}:0:${c.top},split=${c.parts.length + 1}${c.parts.map((_, i) => `[p${i}]`).join("")}[ps];`;
  c.parts.forEach(([a, b, sp], i) => { f += `[p${i}]trim=${a}:${b},setpts=(PTS-STARTPTS)/${sp}[t${i}];`; });
  f += `${c.parts.map((_, i) => `[t${i}]`).join("")}concat=n=${c.parts.length}:v=1,fps=30,tpad=stop_mode=clone:stop_duration=1.2,format=yuv420p[v];`;
  f += `[ps]trim=${c.poster}:${c.poster + 0.1},setpts=PTS-STARTPTS[j]`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", c.src, "-loop", "1", "-t", "36", "-i", ring, "-filter_complex", f,
    "-map", "[v]", "-an", "-c:v", "libx264", "-profile:v", "high", "-crf", "23", "-preset", "slow", "-movflags", "+faststart", `${out}/${name}.mp4`,
    "-map", "[j]", "-frames:v", "1", "-q:v", "3", `${out}/${name}.jpg`], { stdio: "inherit" });
}
