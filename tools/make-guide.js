// สร้าง guide.html: คู่มือติดตั้งแบบทีละหน้า (กด ถัดไป / ย้อนกลับ)
// รันจากโฟลเดอร์ repo: node tools/make-guide.js
// โค้ดในปุ่มก๊อปดึงจาก index.html (loader v3 ตัวเดียวกัน) ห้ามพิมพ์เอง
const fs = require("fs");
const idx = fs.readFileSync("index.html", "utf8");
const loader = idx.match(/<script type="text\/plain" id="loader">[\s\S]*?<\/script>/)[0];

const clip = (id, alt, h = 1702) => `<figure class="shot"><video muted loop playsinline preload="none" width="828" height="${h}" style="aspect-ratio:828/${h}" poster="guide/${id}.jpg" aria-label="${alt}"><source src="guide/${id}.mp4" type="video/mp4"></video></figure>`;
const list = items => `<ol class="do">${items.map(t => `<li>${t}</li>`).join("")}</ol>`;
const k = t => `<b class="key">${t}</b>`;

const STEPS = [
  { title: "โหลดแอป Scriptable", body: `<p>แอปฟรีจาก App Store</p><a class="btn ghost" href="https://apps.apple.com/app/scriptable/id1405459188">เปิด App Store</a>`,
    check: "ไอคอน Scriptable อยู่บนเครื่อง" },
  { title: "ก๊อปโค้ด", body: `<p>กดปุ่มนี้ครั้งเดียว</p><button class="btn" id="copy" type="button">ก๊อปโค้ด</button><textarea class="fallback" id="fallback" readonly aria-label="โค้ดสำหรับก๊อป"></textarea>`,
    check: "ปุ่มเปลี่ยนเป็น “ก๊อปแล้ว ✓”" },
  { title: "เปิด Scriptable แล้วกด +", body: `<p>ปุ่ม ${k("+")} อยู่มุมขวาบน</p>`, media: clip("s3", "กดปุ่มบวกมุมขวาบนของ Scriptable"),
    check: "หน้าว่าง ชื่อด้านบนเขียนว่า Untitled Script" },
  { title: "แตะค้าง แล้วกด Paste", body: `<p>แตะค้างที่ว่างบนหน้าจอ 1 วินาที แล้วกด ${k("Paste")}</p>`, media: clip("s4", "แตะค้างที่หน้าว่างแล้วกด Paste"),
    check: "โค้ดขึ้นเต็มหน้า" },
  { title: "ตั้งชื่อว่า Dek70", body: list([`แตะชื่อ ${k("Untitled Script")} ด้านบน`, `ลบชื่อเดิม พิมพ์ ${k("Dek70")}`, `กด ${k("Rename")}`, `กด ${k("Done")} มุมซ้ายบน`]),
    media: clip("s5", "แตะชื่อด้านบน พิมพ์ Dek70 กด Rename แล้วกด Done"), check: "การ์ดชื่อ Dek70 อยู่ในรายการ" },
  { title: "กดค้างที่หน้าจอโฮม แล้วกด Add Widget", body: list(["กดค้างที่ว่างบนหน้าจอโฮมจนไอคอนสั่น", `กด ${k("Edit")} มุมซ้ายบน`, `กด ${k("Add Widget")}`]),
    media: clip("s6", "กดค้างที่หน้าจอโฮม กด Edit แล้วกด Add Widget", 1792), check: "หน้ารวม Widget มีช่อง Search Widgets ด้านบน" },
  { title: "ค้นหา Scriptable แล้วกด Add Widget", body: list([`พิมพ์ ${k("Scriptable")} ในช่องค้นหา แล้วแตะชื่อแอป`, "ปัดซ้ายถ้าอยากได้ขนาด Medium", `กด ${k("Add Widget")}`, `กด ${k("Done")} มุมขวาบน`]),
    media: clip("s7", "ค้นหา Scriptable แตะชื่อแอป กด Add Widget แล้วกด Done", 1792), check: "กล่องสีเทาเขียนว่า Configure widget อยู่บนหน้าจอโฮม" },
  { title: "เลือกสคริปต์ Dek70", body: list([`กดค้างที่กล่องนั้น แล้วกด ${k("Edit Widget")}`, `แตะ ${k("Choose")} ที่แถว Script`, `เลือก ${k("Dek70")}`, "แตะที่ว่างนอกกล่องเพื่อปิด"]),
    media: clip("s8", "กดค้างที่ Widget กด Edit Widget แตะ Choose เลือก Dek70 แล้วแตะที่ว่าง", 1792), check: "Widget นับถอยหลังขึ้นแล้ว" },
];
const N = STEPS.length;
const hero = `<figure class="hero"><img src="guide/hero.jpg" width="1011" height="350" alt="ตัวอย่าง Widget: ขนาด Small ธีมมืด นับถอยหลัง 58 วันถึงเปิดสมัคร A-Level และขนาด Medium ธีมสว่าง นับถอยหลังเป็นวินาที"></figure>`;

const screens = [
  `<section class="screen" id="s0" data-i="0" aria-labelledby="h0">
    ${hero}
    <h1 id="h0">🐻 Dek70 Countdown</h1>
    <p class="lead">นับถอยหลังวันสำคัญ TCAS70 บนหน้าจอโฮม ติดตั้งครั้งเดียว วันอัปเดตให้เอง ฟรี</p>
    <ul class="need" aria-label="ก่อนเริ่ม">
      <li>iPhone หรือ iPad</li>
      <li>ต่อเน็ตอยู่</li>
      <li>ใช้เวลาประมาณ 2 นาที (${N} ขั้น)</li>
      <li class="no">Android ยังใช้ไม่ได้</li>
    </ul>
  </section>`,
  ...STEPS.map((s, i) => `<section class="screen step" id="s${i + 1}" data-i="${i + 1}" aria-labelledby="h${i + 1}">
    <p class="count">ขั้นที่ ${i + 1} จาก ${N}</p>
    <h2 id="h${i + 1}">${s.title}</h2>
    ${s.body}
    ${s.media || ""}
    <p class="check"><b>ต้องเห็น</b> ${s.check}</p>
  </section>`),
  `<section class="screen" id="s${N + 1}" data-i="${N + 1}" aria-labelledby="hd">
    <h2 id="hd" class="done-h">เสร็จแล้ว 🎉</h2>
    <p class="lead">Widget จะอัปเดตวันให้เองทุกชั่วโมง ไม่ต้องทำอะไรอีก</p>
    ${hero}
    <p class="lead">ถ้าไม่ขึ้นแบบนี้ ลองย้อนกลับไปเช็กขั้นที่ 8 อีกรอบ</p>
  </section>`,
];

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
    --bar: rgba(236,236,236,.92);
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #0F0F11; --card: #1C1C1E; --ink: #F5F5F7; --sub: #A1A1A6; --line: #2C2C2E; --soft: #2C2C2E; --ok: #7DDA98; --ok-bg: #13301D; --warn-bg: #3A2A10; --warn-ink: #FFCF8A; --bar: rgba(15,15,17,.92); }
  }
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; }
  body { background: var(--bg); color: var(--ink); line-height: 1.55; -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, "Sukhumvit Set", "Thonburi", "Leelawadee UI", "Segoe UI", sans-serif; }
  main { max-width: 480px; margin: 0 auto; padding: calc(16px + env(safe-area-inset-top, 0px)) 16px calc(120px + env(safe-area-inset-bottom, 0px)); }
  .preview { background: var(--warn-bg); color: var(--warn-ink); border-radius: 12px; padding: 8px 12px; font-size: .85rem; margin-bottom: 14px; }
  .progress { height: 6px; border-radius: 3px; background: var(--line); overflow: hidden; margin-bottom: 18px; }
  .progress i { display: block; height: 100%; width: 0; background: var(--ink); border-radius: 3px; }
  @media (prefers-reduced-motion: no-preference) { .progress i { transition: width .25s; } }
  .hero { margin: 0 0 18px; border-radius: 20px; overflow: hidden; }
  .hero img { display: block; width: 100%; height: auto; }
  h1 { font-size: 1.75rem; line-height: 1.2; margin: 0 0 6px; }
  h2 { font-size: 1.45rem; line-height: 1.3; margin: 0; }
  .done-h { font-size: 1.75rem; margin-bottom: 6px; }
  .lead { color: var(--sub); margin: 0 0 18px; }
  .count { margin: 0 0 4px; color: var(--sub); font-weight: 700; font-size: .95rem; }
  .need { list-style: none; margin: 0; padding: 14px 16px; background: var(--card); border-radius: 16px; display: grid; gap: 6px; }
  .need li::before { content: "✓"; color: var(--ok); font-weight: 700; margin-right: 10px; }
  .need li.no::before { content: "✕"; color: var(--sub); }
  .step > p:not(.count):not(.check) { margin: 10px 0 0; color: var(--sub); font-size: 1.05rem; }
  ol.do { margin: 10px 0 0; padding-left: 1.4em; color: var(--sub); font-size: 1.05rem; display: grid; gap: 2px; }
  b.key { color: var(--ink); font-weight: 700; }
  .shot { margin: 16px auto 0; width: min(100%, 300px); border-radius: 22px; overflow: hidden; border: 1px solid var(--line); background: #000; }
  .shot video { display: block; width: 100%; height: auto; }
  .check { margin: 16px 0 0; padding: 10px 12px; border-radius: 12px; background: var(--ok-bg); }
  .check b { color: var(--ok); margin-right: 6px; }
  .btn { display: flex; align-items: center; justify-content: center; min-height: 52px; margin-top: 16px; padding: 0 20px; border-radius: 14px; width: 100%;
    font: 700 1.05rem inherit; font-family: inherit; text-decoration: none; cursor: pointer; background: var(--ink); color: var(--bg); border: 1.5px solid var(--ink); }
  .btn.ghost { background: transparent; color: var(--ink); }
  .btn.done { background: #2E7D32; border-color: #2E7D32; color: #fff; }
  .btn:focus-visible, .nav button:focus-visible { outline: 3px solid #E5484D; outline-offset: 3px; }
  textarea.fallback { width: 100%; height: 160px; margin-top: 10px; font-size: 12px; display: none; }
  /* แถบปุ่มล่างจอ */
  .nav { position: fixed; left: 0; right: 0; bottom: 0; background: var(--bar); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    border-top: 1px solid var(--line); padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px)); }
  .nav div { max-width: 480px; margin: 0 auto; display: flex; gap: 10px; }
  .nav button { min-height: 54px; border-radius: 14px; font: 700 1.1rem inherit; font-family: inherit; cursor: pointer; border: 1.5px solid var(--ink); }
  #back { flex: 0 0 34%; background: transparent; color: var(--ink); }
  #next { flex: 1; background: var(--ink); color: var(--bg); }
  #back[hidden] { display: none; }
  /* ไม่มี JS: แสดงทุกขั้นต่อกัน ซ่อนแถบปุ่ม */
  html:not(.js) .nav, html:not(.js) .progress { display: none; }
  html:not(.js) .screen + .screen { margin-top: 36px; }
  html.js .screen:not(.on) { display: none; }
</style>
</head>
<body>
<script>document.documentElement.classList.add("js");</script>
<main>
  <div class="preview"><b>หน้าตัวอย่าง</b> หน้าติดตั้งจริงยังเป็นตัวเดิม</div>
  <div class="progress" aria-hidden="true"><i id="prog"></i></div>
  ${screens.join("\n  ")}
</main>
<nav class="nav" aria-label="เปลี่ยนขั้น"><div><button id="back" type="button">← ย้อนกลับ</button><button id="next" type="button">เริ่มติดตั้ง →</button></div></nav>
${loader}
<script>
(() => {
  const code = document.getElementById("loader").textContent;
  const copy = document.getElementById("copy"), ta = document.getElementById("fallback");
  copy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(code); copy.textContent = "ก๊อปแล้ว ✓"; copy.classList.add("done"); }
    catch (e) { ta.value = code; ta.style.display = "block"; ta.focus(); ta.select(); copy.textContent = "เลือกทั้งหมดแล้วก๊อปจากกล่องด้านล่าง"; }
  });

  const screens = [...document.querySelectorAll(".screen")], LAST = screens.length - 1, STEPS = LAST - 1;
  const back = document.getElementById("back"), next = document.getElementById("next"), prog = document.getElementById("prog");
  const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = -1;
  function show(i, push) {
    i = Math.max(0, Math.min(LAST, i));
    if (i === cur) return;
    cur = i;
    screens.forEach((s, j) => {
      s.classList.toggle("on", j === i);
      const v = s.querySelector("video");
      if (!v) return;
      if (j === i) { if (still) v.controls = true; else { v.currentTime = 0; v.play().catch(() => { v.controls = true; }); } }
      else v.pause();
      if (j === i + 1) v.preload = "auto"; // โหลดคลิปขั้นถัดไปรอไว้
    });
    back.hidden = i === 0;
    next.textContent = i === 0 ? "เริ่มติดตั้ง →" : i === STEPS ? "เสร็จแล้ว ✓" : i === LAST ? "กลับไปขั้นแรก" : "ถัดไป →";
    prog.style.width = (Math.min(i, STEPS) / STEPS * 100) + "%";
    window.scrollTo(0, 0);
    if (push) history.pushState({ i }, "", i ? "#" + i : location.pathname);
    const h = screens[i].querySelector("h1, h2");
    if (h && push) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  next.addEventListener("click", () => show(cur === LAST ? 1 : cur + 1, true));
  back.addEventListener("click", () => show(cur - 1, true));
  window.addEventListener("popstate", () => show(parseInt(location.hash.slice(1), 10) || 0, false));
  document.addEventListener("keydown", e => {
    if (/input|textarea/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") next.click(); else if (e.key === "ArrowLeft" && cur > 0) back.click();
  });
  document.querySelectorAll(".shot video").forEach(v => v.addEventListener("click", () => { if (v.paused) v.play().catch(() => {}); else v.pause(); }));
  history.replaceState({ i: 0 }, "", location.href);
  show(parseInt(location.hash.slice(1), 10) || 0, false);
})();
</script>
</body>
</html>
`;
fs.writeFileSync("guide.html", html);
