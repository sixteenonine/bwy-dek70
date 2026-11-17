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
  { title: "โหลดแอป Scriptable", body: `<p>แอปฟรี กด ${k("Get")} แล้วรอโหลดเสร็จ</p><a class="btn ghost" href="https://apps.apple.com/app/scriptable/id1405459188">เปิด App Store</a>`,
    media: `<figure class="shot wide"><img src="guide/s1.jpg" width="828" height="590" alt="หน้า Scriptable ใน App Store กดปุ่ม Get"></figure>`,
    info: { label: "Scriptable คืออะไร", text: "แอปฟรีสำหรับสร้าง Widget เอง จากนักพัฒนา Simon Støvring ผ่านการตรวจของ Apple เหมือนแอปทั่วไป ไม่ต้องสมัครหรือล็อกอิน และ iPhone จะถามเราก่อนทุกครั้งถ้าแอปจะเข้าถึงรูป รายชื่อ หรือตำแหน่ง" } },
  { title: "Copy โค้ด", body: `<p>โค้ดนี้คือหัวใจของ Widget ไม่มีโค้ดนี้ Widget จะว่างเปล่า</p><div class="copywrap"><button class="btn copy" id="copy" type="button" aria-live="polite"><span class="lbl">Copy โค้ด</span><svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button><div class="burst" id="burst" aria-hidden="true"></div></div><p class="copied" id="copied" hidden>🐻 Copy โค้ดแล้ว</p><button class="btn ghost small" id="view" type="button" aria-expanded="false" aria-controls="code">ดูโค้ด</button><pre class="code" id="code" hidden></pre><p class="safe">🔒 โค้ดนี้แค่โหลดตัวนับถอยหลังจากเว็บ BearWithYou ไม่เข้าถึงรูป รายชื่อ ตำแหน่ง หรือบัญชีใดๆ และไม่ต้องจ่ายเงิน</p><textarea class="fallback" id="fallback" readonly aria-label="โค้ดสำหรับก๊อป"></textarea>`,
    check: "ปุ่มเปลี่ยนเป็นสีเขียว ขึ้นว่า Copied!" },
  { title: "เปิด Scriptable แล้วกด +", body: list([`แตะไอคอน ${k("Scriptable")} บนหน้าจอโฮม`, `กด ${k("+")} มุมขวาบน`]), media: clip("s3", "แตะไอคอน Scriptable บนหน้าจอโฮม แล้วกดปุ่มบวกมุมขวาบน"),
    check: "หน้าว่าง ชื่อด้านบนเขียนว่า Untitled Script" },
  { title: "แตะค้าง แล้วกด Paste", body: `<p>แตะค้างที่ว่างบนหน้าจอ 1 วินาที แล้วกด ${k("Paste")}</p>`, media: clip("s4", "แตะค้างที่หน้าว่างแล้วกด Paste"),
    check: "โค้ดขึ้นเต็มหน้า" },
  { title: "ตั้งชื่อว่า Dek70", body: list([`แตะชื่อ ${k("Untitled Script")} ด้านบน`, `ลบชื่อเดิม พิมพ์ ${k("Dek70")}`, `กด ${k("Rename")}`, `กด ${k("Done")} มุมซ้ายบน`]),
    media: clip("s5", "แตะชื่อด้านบน พิมพ์ Dek70 กด Rename แล้วกด Done"), check: "การ์ดชื่อ Dek70 อยู่ในรายการ" },
  { title: "เพิ่ม Widget บนหน้าจอโฮม", body: list(["กดค้างที่ว่างบนหน้าจอโฮมจนไอคอนสั่น", `กด ${k("Edit")} มุมซ้ายบน แล้วกด ${k("Add Widget")}`, `พิมพ์ ${k("Scriptable")} ในช่องค้นหา แล้วแตะชื่อแอป`, `กด ${k("Add Widget")} (ปัดซ้ายก่อนถ้าอยากได้ขนาด Medium)`, `กด ${k("Done")} มุมขวาบน`]),
    media: clip("s6", "กดค้างที่หน้าจอโฮม กด Edit แล้ว Add Widget ค้นหา Scriptable กด Add Widget แล้วกด Done", 1792), check: "กล่องสีเทาเขียนว่า Configure widget อยู่บนหน้าจอโฮม" },
  { title: "เลือกสคริปต์ Dek70", body: list([`กดค้างที่กล่องนั้น แล้วกด ${k("Edit Widget")}`, `แตะ ${k("Choose")} ที่แถว Script`, `เลือก ${k("Dek70")}`, "แตะที่ว่างนอกกล่องเพื่อปิด"]),
    media: clip("s8", "กดค้างที่ Widget กด Edit Widget แตะ Choose เลือก Dek70 แล้วแตะที่ว่าง"), check: "Widget แสดงผลนับถอยหลังแล้ว" },
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
    <div class="head"><span class="num" aria-hidden="true">${i + 1}</span><div><p class="count">ขั้นที่ ${i + 1} จาก ${N}</p><h2 id="h${i + 1}">${s.title}</h2></div></div>
    ${s.body}
    ${s.media || ""}
    ${s.info ? `<p class="check info"><b>${s.info.label}</b> ${s.info.text}</p>` : `<p class="check"><b>ต้องเห็น</b> ${s.check}</p>`}
  </section>`),
  `<section class="screen" id="s${N + 1}" data-i="${N + 1}" aria-labelledby="hd">
    <h2 id="hd" class="done-h">เสร็จแล้ว 🎉</h2>
    <p class="lead">Widget จะอัปเดตวันให้เองทุกชั่วโมง ไม่ต้องทำอะไรอีก</p>
    ${hero}
    <p class="lead">ถ้าไม่ขึ้นแบบนี้ ลองย้อนกลับไปเช็กขั้นที่ ${N} อีกรอบ</p>
    <button class="btn ghost" id="toTheme" type="button">🎨 ดูวิธีเปลี่ยนธีมสี</button>
  </section>`,
  `<section class="screen step" id="s${N + 2}" data-i="${N + 2}" aria-labelledby="ht">
    <div class="head"><span class="num" aria-hidden="true">🎨</span><div><p class="count">ไม่บังคับ</p><h2 id="ht">เปลี่ยนธีมสี สว่าง / มืด</h2></div></div>
    ${list([`เปิดแอป ${k("Scriptable")} แล้วแตะ ${k("Dek70")}`, `กด ${k("🌙 เปลี่ยนเป็นธีมมืด")}`, `กด ${k("โอเค")}`, "กลับหน้าจอโฮม รอ Widget เปลี่ยนสีเอง (บางทีทันที บางทีนานถึงประมาณ 1 ชั่วโมง)"])}
    <p>อยากกลับเป็นธีมสว่าง ทำซ้ำแล้วกด ${k("☀️ เปลี่ยนเป็นธีมสว่าง")}</p>
    ${clip("theme", "แตะไอคอน Scriptable แตะ Dek70 กดเปลี่ยนเป็นธีมมืด กดโอเค แล้ว Widget บนหน้าจอโฮมเปลี่ยนเป็นสีมืด")}
    <p class="check"><b>อยากให้บางตัวเป็นธีมมืด</b> กดค้างที่ Widget ตัวนั้น กด ${k("Edit Widget")} แล้วพิมพ์ ${k("dark")} ในช่อง Parameter</p>
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
  .head { display: flex; align-items: center; gap: 14px; }
  .num { flex: none; width: 64px; height: 64px; border-radius: 50%; background: #FFFFFF; color: #1A1A1A; display: grid; place-items: center;
    font-size: 2.1rem; font-weight: 800; line-height: 1; box-shadow: 0 2px 10px rgba(0, 0, 0, .12); }
  .count { margin: 0 0 2px; color: var(--sub); font-weight: 700; font-size: .95rem; }
  .step > p.safe { margin: 12px 0 0; font-size: .9rem; color: var(--sub); }
  .btn.small { min-height: 44px; margin-top: 10px; font-size: .95rem; }
  pre.code { margin: 10px 0 0; max-height: 40vh; overflow: auto; padding: 12px; border-radius: 12px; background: var(--card); border: 1px solid var(--line);
    font: 12px/1.5 ui-monospace, Menlo, Consolas, monospace; white-space: pre-wrap; word-break: break-word; -webkit-user-select: text; user-select: text; }
  .shot.wait { aspect-ratio: 828 / 1100; background: var(--soft); border: 2px dashed var(--line); display: grid; place-items: center; text-align: center; color: var(--sub); font-weight: 700; }
  .shot.wait small { font-weight: 400; }
  .need { list-style: none; margin: 0; padding: 14px 16px; background: var(--card); border-radius: 16px; display: grid; gap: 6px; }
  .need li::before { content: "✓"; color: var(--ok); font-weight: 700; margin-right: 10px; }
  .need li.no::before { content: "✕"; color: var(--sub); }
  .step > p:not(.check) { margin: 10px 0 0; color: var(--sub); font-size: 1.05rem; }
  ol.do { margin: 10px 0 0; padding-left: 1.4em; color: var(--sub); font-size: 1.05rem; display: grid; gap: 2px; }
  b.key { color: var(--ink); font-weight: 700; }
  .shot { margin: 16px auto 0; width: min(100%, 300px); border-radius: 22px; overflow: hidden; border: 1px solid var(--line); background: #000; }
  .shot video { display: block; width: 100%; height: auto; }
  .shot.wide { width: 100%; background: #fff; }
  .shot img { display: block; width: 100%; height: auto; }
  .check { margin: 16px 0 0; padding: 10px 12px; border-radius: 12px; background: var(--ok-bg); }
  .check b { color: var(--ok); margin-right: 6px; }
  .check.info { background: var(--card); border: 1px solid var(--line); color: var(--sub); font-size: .95rem; }
  .check.info b { display: block; color: var(--ink); margin: 0 0 2px; }
  .btn { display: flex; align-items: center; justify-content: center; min-height: 52px; margin-top: 16px; padding: 0 20px; border-radius: 14px; width: 100%;
    font-family: inherit; font-weight: 700; font-size: 1.05rem; text-decoration: none; cursor: pointer; background: var(--ink); color: var(--bg); border: 1.5px solid var(--ink); }
  .btn.ghost { background: transparent; color: var(--ink); }
  .btn.done { background: #2E7D32; border-color: #2E7D32; color: #fff; }
  .btn:focus-visible, .nav button:focus-visible { outline: 3px solid #E5484D; outline-offset: 3px; }
  .copywrap { position: relative; }
  .btn.copy { gap: 8px; font-size: 1.2rem; letter-spacing: .02em; }
  .btn.copy .tick { width: 0; height: 24px; fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 22; stroke-dashoffset: 22; }
  .btn.copy.done { background: #2E7D32; border-color: #2E7D32; color: #fff; }
  .btn.copy.done .tick { width: 24px; stroke-dashoffset: 0; }
  .copied { margin: 12px 0 0 !important; text-align: center; font-weight: 700; color: var(--ok) !important; }
  .burst { position: absolute; left: 50%; top: 42px; width: 0; height: 0; pointer-events: none; }
  .burst i { position: absolute; left: 0; top: 0; font-style: normal; font-size: 22px; line-height: 1; opacity: 0; transform: translate(-50%, -50%); }
  .burst i.dot { width: 9px; height: 9px; border-radius: 50%; }
  @media (prefers-reduced-motion: no-preference) {
    .btn.copy .tick { transition: width .2s, stroke-dashoffset .35s .15s ease-out; }
    .btn.copy { transition: background .2s, border-color .2s, transform .1s; }
    .btn.copy:active { transform: scale(.96); }
    .btn.copy.pop { animation: pop .5s cubic-bezier(.2, 1.7, .4, 1); }
    .burst i { animation: fly .9s cubic-bezier(.15, .7, .3, 1) forwards; }
    .copied:not([hidden]) { animation: rise .4s ease-out; }
    #next.nudge { animation: nudge 1.2s ease-in-out 2; }
  }
  @keyframes pop { 0% { transform: scale(1); } 30% { transform: scale(.9); } 100% { transform: scale(1); } }
  @keyframes fly { 0% { opacity: 1; transform: translate(-50%, -50%) scale(.4); }
    70% { opacity: 1; } 100% { opacity: 0; transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1) rotate(var(--r)); } }
  @keyframes rise { from { opacity: 0; transform: translateY(6px); } }
  @keyframes nudge { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); box-shadow: 0 0 0 6px rgba(46, 125, 50, .35); } }
  textarea.fallback { width: 100%; height: 160px; margin-top: 10px; font-size: 12px; display: none; }
  /* แถบปุ่มล่างจอ */
  .nav { position: fixed; left: 0; right: 0; bottom: 0; background: var(--bar); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    border-top: 1px solid var(--line); padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px)); }
  .nav div { max-width: 480px; margin: 0 auto; display: flex; gap: 10px; }
  .nav button { min-height: 54px; border-radius: 14px; font-family: inherit; font-weight: 700; font-size: 1.1rem; cursor: pointer; border: 1.5px solid var(--ink); }
  #back { flex: 0 0 34%; background: transparent; color: var(--ink); }
  #next { flex: 1; background: var(--ink); color: var(--bg); }
  #back[hidden] { display: none; }
  @media (prefers-reduced-motion: no-preference) {
    .nav button { transition: transform .22s cubic-bezier(.3, 1.8, .5, 1), background .2s, color .2s; -webkit-tap-highlight-color: transparent; }
    .nav button.down { transform: scale(.93); transition-duration: .08s; }
    .nav button.boing { animation: boing .42s cubic-bezier(.3, 1.4, .5, 1); }
  }
  @keyframes boing { 0% { transform: scale(.93); } 55% { transform: scale(1.05); } 100% { transform: scale(1); } }
  /* ---------- จอกว้าง / แนวนอน ---------- */
  main { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  .nav { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  @media (min-width: 700px) {
    main, .nav div { max-width: 960px; }
    /* ขั้นตอน: คำอธิบายซ้าย ภาพ/คลิปขวา */
    html:not(.js) .screen.step, .screen.step.on { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 40px; align-items: start; align-content: start; }
    .step > :not(.shot) { grid-column: 1; }
    .step > .shot { grid-column: 2; grid-row: 1 / span 12; margin: 0;
      width: clamp(240px, calc((100vh - 230px) * .462), 340px); width: clamp(240px, calc((100svh - 230px) * .462), 340px); }
    .step > .shot.wide { width: min(460px, 46vw); }
    .step h2 { font-size: 1.7rem; }
    /* หน้าแรก: รูปซ้าย ข้อความขวา */
    html:not(.js) #s0, #s0.on { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); column-gap: 40px; align-items: center; }
    #s0 .hero { grid-column: 1; grid-row: 1 / span 6; margin: 0; }
    #s0 > :not(.hero) { grid-column: 2; }
    #s${N + 1} { max-width: 640px; margin: 0 auto; }
    .nav div { justify-content: flex-end; }
    #back { flex: 0 0 180px; }
    #next { flex: 0 0 300px; }
  }
  /* มือถือแนวนอน (จอเตี้ย): ลดระยะ ให้เห็นเนื้อหามากขึ้น */
  @media (orientation: landscape) and (max-height: 520px) {
    main { padding-top: calc(10px + env(safe-area-inset-top, 0px)); padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px)); }
    .preview { padding: 4px 10px; margin-bottom: 8px; }
    .progress { margin-bottom: 10px; }
    .nav { padding-top: 8px; padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px)); }
    .nav button { min-height: 46px; }
    .step h2 { font-size: 1.45rem; }
    #s0 .hero { max-height: 70vh; }
    .step > .shot { width: clamp(170px, calc((100vh - 150px) * .462), 300px); }
    .step > .shot.wide { width: min(400px, 44vw); }
  }
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
  const lbl = copy.querySelector(".lbl"), burst = document.getElementById("burst"), copied = document.getElementById("copied");
  const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BITS = ["🐻", "✨", "💛", "⭐", "✨", "🐻"], COLORS = ["#FFC94D", "#FF8FB1", "#7DDA98", "#6FB6FF", "#E5484D"];
  function party() {
    if (calm) return;
    burst.textContent = "";
    for (let n = 0; n < 18; n++) {
      const el = document.createElement("i"), a = Math.PI * 2 * n / 18 + Math.random() * .3, d = 70 + Math.random() * 70;
      if (n % 3 === 0) el.textContent = BITS[(n / 3) % BITS.length]; else { el.className = "dot"; el.style.background = COLORS[n % COLORS.length]; }
      el.style.setProperty("--x", Math.cos(a) * d * 1.6 + "px"); el.style.setProperty("--y", Math.sin(a) * d - 20 + "px");
      el.style.setProperty("--r", (Math.random() * 120 - 60) + "deg"); el.style.animationDelay = Math.random() * 60 + "ms";
      burst.appendChild(el);
    }
    copy.classList.remove("pop"); void copy.offsetWidth; copy.classList.add("pop");
    const nx = document.getElementById("next"); nx.classList.remove("nudge"); void nx.offsetWidth; nx.classList.add("nudge");
  }
  const view = document.getElementById("view"), pre = document.getElementById("code");
  pre.textContent = code;
  view.addEventListener("click", () => {
    const open = pre.hidden; pre.hidden = !open; view.setAttribute("aria-expanded", open); view.textContent = open ? "ซ่อนโค้ด" : "ดูโค้ด";
  });
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      lbl.textContent = "Copied!"; copy.classList.add("done"); copied.hidden = false; party();
    } catch (e) { ta.value = code; ta.style.display = "block"; ta.focus(); ta.select(); lbl.textContent = "เลือกทั้งหมดแล้วก๊อปจากกล่องด้านล่าง"; }
  });

  const screens = [...document.querySelectorAll(".screen")], LAST = screens.length - 1, DONE = LAST - 1, STEPS = DONE - 1; // LAST = หน้าเปลี่ยนธีม
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
    next.textContent = i === 0 ? "เริ่มติดตั้ง →" : i === STEPS ? "เสร็จแล้ว ✓" : i === DONE ? "กลับไปขั้นแรก" : i === LAST ? "กลับหน้าเสร็จ ✓" : "ถัดไป →";
    prog.style.width = (Math.min(i, STEPS) / STEPS * 100) + "%";
    window.scrollTo(0, 0);
    if (push) history.pushState({ i }, "", i ? "#" + i : location.pathname);
    const h = screens[i].querySelector("h1, h2");
    if (h && push) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  // กดแล้วยุบ ปล่อยแล้วเด้ง
  [back, next].forEach(b => {
    b.addEventListener("pointerdown", () => b.classList.add("down"));
    ["pointerup", "pointercancel", "pointerleave"].forEach(ev => b.addEventListener(ev, () => b.classList.remove("down")));
    b.addEventListener("click", () => { b.classList.remove("boing"); void b.offsetWidth; b.classList.add("boing"); });
    b.addEventListener("animationend", () => b.classList.remove("boing"));
  });
  next.addEventListener("click", () => show(cur === DONE ? 1 : cur === LAST ? DONE : cur + 1, true));
  document.getElementById("toTheme").addEventListener("click", () => show(LAST, true));
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
