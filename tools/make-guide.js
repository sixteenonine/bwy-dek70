const fs = require("fs");
const idx = fs.readFileSync("index.html", "utf8");
const loader = idx.match(/<script type="text\/plain" id="loader">[\s\S]*?<\/script>/)[0];
const step = (n, title, body, media, check) => `
    <li class="step">
      <div class="head"><span class="n">${n}</span><h2>${title}</h2></div>
      ${body}
      ${media}
      ${check ? `<p class="check"><b>ต้องเห็น</b> ${check}</p>` : ""}
    </li>`;
const clip = (id, alt, h = 1702) => `<figure class="shot"><video muted loop playsinline preload="none" width="828" height="${h}" style="aspect-ratio:828/${h}" poster="guide/${id}.jpg" aria-label="${alt}"><source src="guide/${id}.mp4" type="video/mp4"></video></figure>`;
const wait = what => `<figure class="shot wait"><div>รอคลิป<br><small>${what}</small></div></figure>`;
const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>วิธีติดตั้ง Dek70 Countdown (หน้าตัวอย่าง)</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐻</text></svg>">
<style>
  :root {
    --bg: #ECECEC; --card: #FFFFFF; --ink: #000000; --sub: #5F5F64; --line: #DADADA; --soft: #F2F2F2; --ok: #1F7A3A; --ok-bg: #E6F4EA; --warn-bg: #FFF4E5; --warn-ink: #8A5300;
    box-sizing: border-box; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #0F0F11; --card: #1C1C1E; --ink: #F5F5F7; --sub: #A1A1A6; --line: #2C2C2E; --soft: #2C2C2E; --ok: #7DDA98; --ok-bg: #13301D; --warn-bg: #3A2A10; --warn-ink: #FFCF8A; }
  }
  *, *::before, *::after { box-sizing: inherit; }
  html, body { margin: 0; }
  body { background: var(--bg); color: var(--ink); line-height: 1.55; -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, "Sukhumvit Set", "Thonburi", "Leelawadee UI", "Segoe UI", sans-serif; }
  main { max-width: 480px; margin: 0 auto; padding: 24px 16px 56px; }
  .preview { background: var(--warn-bg); color: var(--warn-ink); border-radius: 12px; padding: 10px 14px; font-size: .9rem; margin-bottom: 20px; }
  h1 { font-size: 1.75rem; line-height: 1.2; margin: 0 0 6px; }
  .lead { color: var(--sub); margin: 0 0 18px; }
  .need { list-style: none; margin: 0 0 28px; padding: 14px 16px; background: var(--card); border-radius: 16px; display: grid; gap: 6px; font-size: .95rem; }
  .need li::before { content: "✓"; color: var(--ok); font-weight: 700; margin-right: 10px; }
  .need li.no::before { content: "✕"; color: var(--sub); }
  ol.steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }
  .step { background: var(--card); border-radius: 20px; padding: 18px 16px 16px; }
  .head { display: flex; align-items: center; gap: 12px; }
  .n { flex: none; width: 40px; height: 40px; border-radius: 50%; background: var(--ink); color: var(--bg); display: grid; place-items: center; font-weight: 700; font-size: 1.15rem; }
  h2 { font-size: 1.2rem; line-height: 1.3; margin: 0; }
  .step > p { margin: 10px 0 0; color: var(--sub); }
  .step ol.do { margin: 10px 0 0; padding-left: 1.3em; color: var(--sub); }
  .step ol.do li { padding-left: 2px; }
  b.key { color: var(--ink); font-weight: 700; }
  .shot { margin: 14px auto 0; width: min(100%, 300px); border-radius: 22px; overflow: hidden; border: 1px solid var(--line); background: #000; position: relative; }
  .shot video { display: block; width: 100%; height: auto; }
  .shot.wait { aspect-ratio: 414 / 520; background: var(--soft); border: 2px dashed var(--line); display: grid; place-items: center; text-align: center; color: var(--sub); font-weight: 700; }
  .shot.wait small { font-weight: 400; }
  .check { margin: 14px 0 0 !important; padding: 9px 12px; border-radius: 12px; background: var(--ok-bg); color: var(--ink) !important; font-size: .95rem; }
  .check b { color: var(--ok); margin-right: 6px; }
  .btn { display: flex; align-items: center; justify-content: center; min-height: 52px; margin-top: 14px; padding: 0 20px; border-radius: 14px; width: 100%;
    font: 700 1.05rem inherit; font-family: inherit; text-decoration: none; cursor: pointer; background: var(--ink); color: var(--bg); border: 1.5px solid var(--ink); }
  .btn.ghost { background: transparent; color: var(--ink); }
  .btn.done { background: #2E7D32; border-color: #2E7D32; color: #fff; }
  .btn:focus-visible { outline: 3px solid #E5484D; outline-offset: 3px; }
  textarea.fallback { width: 100%; height: 160px; margin-top: 10px; font-size: 12px; display: none; }
  .end { text-align: center; padding: 22px 16px; }
  .end h2 { font-size: 1.4rem; }
  footer { text-align: center; color: var(--sub); font-size: .9rem; margin-top: 28px; }
</style>
</head>
<body>
<main>
  <div class="preview"><b>หน้าตัวอย่าง</b> ยังไม่ใช่หน้าจริง หน้าติดตั้งจริงยังเป็นตัวเดิม</div>
  <h1>🐻 ติดตั้ง Dek70 Countdown</h1>
  <p class="lead">ทำตามทีละขั้น ดูภาพแล้วกดตาม</p>
  <ul class="need" aria-label="ก่อนเริ่ม">
    <li>iPhone หรือ iPad</li>
    <li>ต่อเน็ตอยู่</li>
    <li>ใช้เวลาประมาณ 2 นาที</li>
    <li class="no">Android ยังใช้ไม่ได้</li>
  </ul>
  <ol class="steps">${step(1, "โหลดแอป Scriptable", `<p>แอปฟรีจาก App Store</p><a class="btn ghost" href="https://apps.apple.com/app/scriptable/id1405459188">เปิด App Store</a>`, "", "ไอคอน Scriptable อยู่บนเครื่อง")}${step(2, "ก๊อปโค้ด", `<p>กดปุ่มนี้ครั้งเดียว</p><button class="btn" id="copy" type="button">ก๊อปโค้ด</button><textarea class="fallback" id="fallback" readonly aria-label="โค้ดสำหรับก๊อป"></textarea>`, "", "ปุ่มเปลี่ยนเป็น “ก๊อปแล้ว ✓”")}${step(3, "เปิด Scriptable แล้วกด +", `<p>ปุ่ม <b class="key">+</b> อยู่มุมขวาบน</p>`, clip("s3", "กดปุ่มบวกมุมขวาบนของ Scriptable"), "หน้าว่าง ชื่อด้านบนเขียนว่า Untitled Script")}${step(4, "แตะค้าง แล้วกด Paste", `<p>แตะค้างที่ว่างบนหน้าจอ 1 วินาที แล้วกด <b class="key">Paste</b></p>`, clip("s4", "แตะค้างที่หน้าว่างแล้วกด Paste"), "โค้ดขึ้นเต็มหน้า")}${step(5, "ตั้งชื่อว่า Dek70", `<ol class="do"><li>แตะชื่อ <b class="key">Untitled Script</b> ด้านบน</li><li>ลบชื่อเดิม พิมพ์ <b class="key">Dek70</b></li><li>กด <b class="key">Rename</b></li><li>กด <b class="key">Done</b> มุมซ้ายบน</li></ol>`, clip("s5", "แตะชื่อด้านบน พิมพ์ Dek70 กด Rename แล้วกด Done"), "การ์ดชื่อ Dek70 อยู่ในรายการ")}${step(6, "กดค้างที่หน้าจอโฮม แล้วกด Add Widget", `<ol class="do"><li>กดค้างที่ว่างบนหน้าจอโฮมจนไอคอนสั่น</li><li>กด <b class="key">Edit</b> มุมซ้ายบน</li><li>กด <b class="key">Add Widget</b></li></ol>`, clip("s6", "กดค้างที่หน้าจอโฮม กด Edit แล้วกด Add Widget", 1792), "หน้ารวม Widget มีช่อง Search Widgets ด้านบน")}${step(7, "ค้นหา Scriptable แล้วกด Add Widget", `<ol class="do"><li>พิมพ์ <b class="key">Scriptable</b> ในช่องค้นหา แล้วแตะชื่อแอป</li><li>ปัดซ้ายถ้าอยากได้ขนาด Medium</li><li>กด <b class="key">Add Widget</b></li><li>กด <b class="key">Done</b> มุมขวาบน</li></ol>`, clip("s7", "ค้นหา Scriptable แตะชื่อแอป กด Add Widget แล้วกด Done", 1792), "กล่องสีเทาเขียนว่า Configure widget อยู่บนหน้าจอโฮม")}${step(8, "เลือกสคริปต์ Dek70", `<ol class="do"><li>กดค้างที่กล่องนั้น แล้วกด <b class="key">Edit Widget</b></li><li>แตะ <b class="key">Choose</b> ที่แถว Script</li><li>เลือก <b class="key">Dek70</b></li><li>แตะที่ว่างนอกกล่องเพื่อปิด</li></ol>`, clip("s8", "กดค้างที่ Widget กด Edit Widget แตะ Choose เลือก Dek70 แล้วแตะที่ว่าง", 1792), "Widget นับถอยหลังขึ้นแล้ว")}
    <li class="step end"><h2>เสร็จแล้ว 🎉</h2><p>Widget จะอัปเดตวันให้เองทุกชั่วโมง ไม่ต้องทำอะไรอีก</p></li>
  </ol>
  <footer>BearWithYou · @WeBearTogether</footer>
</main>
${loader}
<script>
(() => {
  const code = document.getElementById("loader").textContent;
  const btn = document.getElementById("copy"), ta = document.getElementById("fallback");
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(code); btn.textContent = "ก๊อปแล้ว ✓"; btn.classList.add("done"); }
    catch (e) { ta.value = code; ta.style.display = "block"; ta.focus(); ta.select(); btn.textContent = "เลือกทั้งหมดแล้วก๊อปจากกล่องด้านล่าง"; }
  });
  // คลิปเล่นเองเฉพาะตอนอยู่บนจอ (ประหยัดเน็ต) แตะที่คลิปเพื่อหยุด/เล่น
  const vids = [...document.querySelectorAll(".shot video")];
  const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) vids.forEach(v => { v.controls = true; });
  else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.play().catch(() => { e.target.controls = true; }); else e.target.pause(); }), { threshold: 0.5 });
    vids.forEach(v => io.observe(v));
  }
  vids.forEach(v => v.addEventListener("click", () => { if (v.paused) v.play().catch(() => {}); else v.pause(); }));
})();
</script>
</body>
</html>
`;
fs.writeFileSync("guide.html", html);
