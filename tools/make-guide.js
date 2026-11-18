// สร้าง index.html: หน้าติดตั้งแบบทีละหน้า (กด ถัดไป / ย้อนกลับ)
// รันจากโฟลเดอร์ repo: node tools/make-guide.js
// โค้ดในปุ่ม Copy ดึงจาก loader.js ตรงๆ ห้ามพิมพ์เอง (test/check-loader.js เช็กว่าตรงกันทุกตัวอักษร)
const fs = require("fs");
const loaderSrc = fs.readFileSync("loader.js", "utf8").replace(/\r\n/g, "\n").trimEnd();
if (loaderSrc.includes("</script")) throw new Error("loader.js มี </script ฝังในหน้าไม่ได้");
const loader = `<script type="text/plain" id="loader">${loaderSrc}\n</script>`;

const clip = (id, alt, h = 1702) => `<figure class="shot"><div class="frame"><video muted loop playsinline preload="none" width="828" height="${h}" style="aspect-ratio:828/${h}" poster="guide/${id}.jpg" aria-label="${alt}"><source src="guide/${id}.mp4" type="video/mp4"></video></div></figure>`;
const list = items => `<ol class="do">${items.map(t => `<li><span>${t}</span></li>`).join("")}</ol>`;
const k = t => `<b class="key">${t}</b>`;
// text แบ่งย่อหน้าได้ด้วยบรรทัดว่าง (\n\n)
const note = (ic, label, text, cls = "") => `<div class="check ${cls}"><span class="ic" aria-hidden="true">${ic}</span><div>${text.split("\n\n").map((t, j) => `<p>${j ? "" : `<b>${label}</b>`}${t}</p>`).join("")}</div></div>`;

const STEPS = [
  { title: "โหลดแอป Scriptable", body: `<p>แอปฟรี กด ${k("Get")} แล้วรอโหลดเสร็จ</p><a class="btn ghost" href="https://apps.apple.com/app/scriptable/id1405459188">เปิด App Store</a>`,
    media: `<figure class="shot wide"><div class="frame"><img src="guide/s1.jpg" width="828" height="590" alt="หน้า Scriptable ใน App Store กดปุ่ม Get"></div></figure>`,
    info: { label: "Scriptable คืออะไร", text: [
      "เป็นแอปฟรีที่เป็นตัวกลางช่วยให้ Widget ของเราขึ้นบนหน้าจอโฮมได้ ติดตั้งครั้งเดียวจบ",
      "พัฒนาโดย Simon B. Støvring อยู่บน App Store มาตั้งแต่ปี 2018 และผ่านการตรวจของ Apple เหมือนแอปทั่วไป ได้คะแนนรีวิวเฉลี่ยกว่า 4.5 ดาว และเคยได้รองชนะเลิศรางวัล MacStories Selects",
      "ผู้พัฒนาแจ้งว่าแอปไม่เก็บข้อมูลส่วนตัวใดๆ ทำงานภายใต้ระบบความปลอดภัยของ iOS และไม่ต้องสมัครหรือล็อกอินอะไรเลย",
    ].join("\n\n") } },
  { title: "Copy โค้ด", body: `<p>โค้ดนี้คือหัวใจของ Widget ไม่มีโค้ดนี้ Widget จะว่างเปล่า</p><div class="copywrap"><button class="btn copy" id="copy" type="button" aria-live="polite"><span class="lbl">Copy โค้ด</span><svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button><div class="burst" id="burst" aria-hidden="true"></div></div><p class="copied" id="copied" hidden>🐻 Copy โค้ดแล้ว</p><pre class="code" id="code" aria-label="โค้ดที่จะ Copy"></pre><p class="safe">🔒 โค้ดนี้แค่โหลดตัวนับถอยหลังจากเว็บ BearWithYou ไม่เข้าถึงรูป รายชื่อ ตำแหน่ง หรือบัญชีใดๆ และไม่ต้องจ่ายเงิน</p><textarea class="fallback" id="fallback" readonly aria-label="โค้ดสำหรับก๊อป"></textarea>`,
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
const code = t => `<code>${t}</code>`;
const PARAMS = [
  [code("tgat"), "นับถึงวันสอบ TGAT ตลอด"],
  [code("alevel"), "นับถึงวันสอบ A-Level ตลอด"],
  [`${code("dark")} หรือ ${code("มืด")}`, "ธีมมืด เฉพาะ Widget ตัวนี้"],
  [`${code("light")} หรือ ${code("สว่าง")}`, "ธีมสว่าง เฉพาะ Widget ตัวนี้"],
  [code("alevel dark"), "ใช้คู่กันได้ เว้นวรรคระหว่างคำ"],
];
const FAQ = [
  ["ต้องอัปเดตเองไหม", "ไม่ต้อง ติดตั้งครั้งเดียวจบ ถ้า ทปอ. เลื่อนวัน Widget จะเปลี่ยนตามให้เอง"],
  ["ทำไมตัวเลขยังไม่เปลี่ยน", "iPhone รีเฟรช Widget เองประมาณชั่วโมงละครั้ง ถ้าอยากให้เปลี่ยนทันที เปิดแอป Scriptable แล้วแตะ Dek70 หนึ่งรอบ"],
  ["ขึ้นว่า Unsupported widget หรือเป็นกล่องว่าง", `กดค้างที่ Widget กด ${k("Edit Widget")} แล้วเช็กว่าแถว Script เลือก ${k("Dek70")} อยู่ (ดูขั้นที่ ${N})`],
  ["ขึ้นว่า \"ขนาดนี้ยังไม่เปิดใช้\"", "ตอนนี้ใช้ได้ขนาด Small และ Medium ลบตัวนั้นออกแล้วเพิ่มใหม่เป็น Small หรือ Medium"],
  ["ขึ้นว่า \"ต่อเน็ตแล้วเปิดใหม่อีกครั้งนะ\"", "ครั้งแรกต้องมีเน็ตเพื่อโหลด Widget ต่อเน็ตแล้วเปิดแอป Scriptable แตะ Dek70 หนึ่งรอบ หลังจากนั้นไม่มีเน็ตก็ยังใช้ได้"],
  ["กินแบตหรือเก็บข้อมูลอะไรไหม", "ไม่กินแบต เพราะทำงานแค่ตอน iPhone รีเฟรช Widget และไม่เก็บข้อมูลส่วนตัวใดๆ"],
  ["ใช้กับ Android ได้ไหม", "ตอนนี้ใช้ได้เฉพาะ iPhone และ iPad"],
];
const hero = `<figure class="hero"><div class="frame"><img src="guide/hero.jpg" width="1011" height="350" alt="ตัวอย่าง Widget: ขนาด Small ธีมมืด นับถอยหลัง 58 วันถึงเปิดสมัคร A-Level และขนาด Medium ธีมสว่าง นับถอยหลังเป็นวินาที"></div></figure>`;

const screens = [
  `<section class="screen" id="s0" data-hash="" aria-labelledby="h0">
    <div class="intro-text brand">
      <h1 id="h0"><span class="l1">Dek70</span> <span class="l2">BWY Widget</span> <span class="l3">นับถอยหลังวันสอบ</span></h1>
      <ul class="pills"><li>ฟรีตลอดชีพ</li><li>สะดวก</li><li>แม่นยำ</li></ul>
      <div class="maker"><img src="guide/jedi.webp" width="264" height="289" alt="พี่เจได"><div>
        <p class="by">สร้างโดยพี่เจได</p><p class="bwy">BearWithYou</p><p class="pill">นศ. ปี2 ศึกษาศาสตร์ TESOL KKU</p></div></div>
    </div>
    <div class="card intro-card">${hero}
      <ul class="need" aria-label="ก่อนเริ่ม">
        <li>iPhone หรือ iPad</li>
        <li>ต่อเน็ตอยู่</li>
        <li>ใช้เวลาประมาณ 2 นาที (${N} ขั้น)</li>
        <li class="no">Android ยังใช้ไม่ได้</li>
      </ul>
      <p class="more js-only">เคยติดตั้งแล้ว? <button class="link" type="button" data-go="options">ปรับแบบ</button> · <button class="link" type="button" data-go="faq">คำถามที่เจอบ่อย</button></p>
    </div>
  </section>`,
  ...STEPS.map((s, i) => `<section class="screen step" id="s${i + 1}" data-hash="${i + 1}" aria-labelledby="h${i + 1}">
    <div class="head"><span class="num" aria-hidden="true">${i + 1}</span><div><p class="chip">ขั้นที่ ${i + 1} / ${N}</p><h2 id="h${i + 1}">${s.title}</h2></div></div>
    <div class="card"><div class="txt">
    ${s.body}
    </div>${s.media || ""}
    ${s.info ? note("i", s.info.label, s.info.text, "info") : note("✓", "ต้องเห็น", s.check)}</div>
  </section>`),
  `<section class="screen" id="s${N + 1}" data-hash="done" aria-labelledby="hd">
    <div class="intro-text"><p class="chip">ติดตั้งครบ ${N} ขั้น</p>
    <h2 id="hd" class="done-h"><span class="mute">เรียบร้อย</span> เสร็จแล้ว 🎉</h2>
    <p class="lead">Widget จะอัปเดตวันให้เองทุกชั่วโมง ไม่ต้องทำอะไรอีก</p></div>
    <div class="card">${hero}
    <p class="hint">ถ้าไม่ขึ้นแบบนี้ ลองย้อนกลับไปเช็กขั้นที่ ${N} อีกรอบ</p>
    <div class="js-only"><button class="btn ghost" type="button" data-go="theme">🎨 ดูวิธีเปลี่ยนธีมสี</button>
    <button class="btn ghost" type="button" data-go="options">⚙️ ปรับแบบด้วย Parameter</button>
    <button class="btn ghost" type="button" data-go="faq">💬 คำถามที่เจอบ่อย</button></div></div>
  </section>`,
  `<section class="screen step" id="s${N + 2}" data-hash="theme" aria-labelledby="ht">
    <div class="head"><span class="num" aria-hidden="true">🎨</span><div><p class="chip">ไม่บังคับ</p><h2 id="ht">เปลี่ยนธีมสี สว่าง / มืด</h2></div></div>
    <div class="card"><div class="txt">
    ${list([`เปิดแอป ${k("Scriptable")} แล้วแตะ ${k("Dek70")}`, `กด ${k("🌙 เปลี่ยนเป็นธีมมืด")}`, `กด ${k("โอเค")}`, "กลับหน้าจอโฮม รอ Widget เปลี่ยนสีเอง (บางทีทันที บางทีนานถึงประมาณ 1 ชั่วโมง)"])}
    <p>อยากกลับเป็นธีมสว่าง ทำซ้ำแล้วกด ${k("☀️ เปลี่ยนเป็นธีมสว่าง")}</p>
    </div>${clip("theme", "แตะไอคอน Scriptable แตะ Dek70 กดเปลี่ยนเป็นธีมมืด กดโอเค แล้ว Widget บนหน้าจอโฮมเปลี่ยนเป็นสีมืด")}
    ${note("i", "อยากให้บางตัวเป็นธีมมืด", `กดค้างที่ Widget ตัวนั้น กด ${k("Edit Widget")} แล้วพิมพ์ ${k("dark")} ในช่อง Parameter`, "info")}</div>
  </section>`,
  `<section class="screen step narrow" id="s${N + 3}" data-hash="options" aria-labelledby="ho">
    <div class="head"><span class="num" aria-hidden="true">⚙️</span><div><p class="chip">ไม่บังคับ</p><h2 id="ho">ปรับแบบด้วย Parameter</h2></div></div>
    <div class="card"><div class="txt">
    ${list([`กดค้างที่ Widget แล้วกด ${k("Edit Widget")}`, `แตะช่อง ${k("Parameter")} แล้วพิมพ์คำจากตารางด้านล่าง`, "แตะที่ว่างนอกกล่องเพื่อปิด"])}
    <div class="opts">${PARAMS.map(([a, b]) => `<div class="opt"><span class="k">${a}</span><span>${b}</span></div>`).join("")}</div>
    </div>
    ${note("i", "ไม่ใส่อะไรเลยก็ได้", "Widget จะนับถึงวันสำคัญที่ใกล้ที่สุดให้เอง พิมพ์ตัวพิมพ์เล็กหรือใหญ่ก็ได้", "info")}</div>
  </section>`,
  `<section class="screen step narrow" id="s${N + 4}" data-hash="faq" aria-labelledby="hq">
    <div class="head"><span class="num" aria-hidden="true">💬</span><div><p class="chip">มีปัญหา?</p><h2 id="hq">คำถามที่เจอบ่อย</h2></div></div>
    <div class="card faq">${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
  </section>`,
];

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#FEFEFE" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F0F11" media="(prefers-color-scheme: dark)">
<title>Dek70 BWY Widget นับถอยหลังวันสอบ</title>
<meta name="description" content="Widget นับถอยหลัง TGAT และ A-Level บนหน้าจอโฮม iPhone/iPad ฟรีจาก BearWithYou ติดตั้งครั้งเดียว วันอัปเดตให้เอง">
<meta property="og:title" content="Dek70 BWY Widget นับถอยหลังวันสอบ">
<meta property="og:description" content="Widget นับถอยหลัง TGAT และ A-Level บนหน้าจอโฮม iPhone/iPad ฟรีจาก BearWithYou">
<meta property="og:image" content="https://bwy-widget.pages.dev/guide/hero.jpg">
<meta property="og:url" content="https://bwy-widget.pages.dev/">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐻</text></svg>">
<link rel="preload" href="guide/fonts/prompt-thai-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="guide/fonts/prompt-thai-700.woff2" as="font" type="font/woff2" crossorigin>
<style>
  /* ฟอนต์ Prompt (Cadson Demak, SIL Open Font License: guide/fonts/OFL.txt) เก็บไว้ในเว็บเราเอง */
${[400, 600, 700].map(w => `  @font-face { font-family: "Prompt"; font-style: normal; font-weight: ${w}; font-display: swap; src: url(guide/fonts/prompt-thai-${w}.woff2) format("woff2"); unicode-range: U+02D7, U+0303, U+0331, U+0E01-0E5B, U+200C-200D, U+25CC; }
  @font-face { font-family: "Prompt"; font-style: normal; font-weight: ${w}; font-display: swap; src: url(guide/fonts/prompt-latin-${w}.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }`).join("\n")}
  :root {
    --bg1: #F3F3F3; --bg2: #E7E7E7; --bgx: #EDEDED; --card: #FFFFFF; --inner: #F6F6F6; --ink: #0B0B0C; --sub: #6B6B70; --mute: #A3A3A8; --line: #ECECEC; --chip: #F2F2F2;
    --ok: #1E7F3C; --ok-bg: #E9F6EC; --shadow: 0 1px 2px rgba(0,0,0,.04), 0 18px 40px -12px rgba(0,0,0,.14);
    --btn: linear-gradient(180deg, #3B3B3D 0%, #161617 55%, #050505 100%); --btn-ink: #FFFFFF;
    --btn-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 2px 3px rgba(0,0,0,.18), 0 10px 22px -6px rgba(0,0,0,.45);
    --glass: rgba(255,255,255,.78);
    --paper: #FEFEFE; --dot: #E4E4E6;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg1: #141416; --bg2: #0A0A0B; --bgx: #0F0F11; --card: #1B1B1E; --inner: #232327; --ink: #F4F4F6; --sub: #A3A3AA; --mute: #6E6E76; --line: #2B2B30; --chip: #26262B;
      --ok: #7EDB9A; --ok-bg: #16301F; --shadow: 0 1px 0 rgba(255,255,255,.04) inset, 0 18px 40px -12px rgba(0,0,0,.7);
      --btn: linear-gradient(180deg, #FFFFFF 0%, #E9E9EB 60%, #D2D2D6 100%); --btn-ink: #0B0B0C;
      --btn-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 2px 3px rgba(0,0,0,.4), 0 10px 22px -6px rgba(0,0,0,.6);
      --glass: rgba(27,27,30,.78);
      --paper: #0F0F11; --dot: #232327; }
  }
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; }
  /* สีพื้นของทั้งหน้า (รวมส่วนที่ยืดออกตอนเลื่อนสุดขอบ) + ไล่สีที่ติดจอไว้ข้างหลัง */
  html { background: var(--paper); }
  /* ปิดการซูมตอนแตะสองครั้ง (ยังถ่างนิ้วซูมได้ตามปกติ) */
  html, body, button, a, video, .pager, .nav { touch-action: manipulation; }
  body { min-height: 100vh; min-height: 100dvh; background: transparent; color: var(--ink); line-height: 1.55;
    -webkit-font-smoothing: antialiased; font-family: "Prompt", -apple-system, BlinkMacSystemFont, "Sukhumvit Set", "Thonburi", "Leelawadee UI", "Segoe UI", sans-serif; }
  body::before { content: ""; position: fixed; inset: -20vh 0; z-index: -1; pointer-events: none;
    background: radial-gradient(circle, var(--dot) 1.1px, transparent 1.6px) 0 0 / 13px 13px, var(--paper); }
  main { max-width: 480px; margin: 0 auto; padding: calc(14px + env(safe-area-inset-top, 0px)) 16px calc(130px + env(safe-area-inset-bottom, 0px)); }
  /* ตัวเลขขั้นด้านบน (แบบ pagination) */
  .pager { display: flex; justify-content: space-between; gap: 6px; padding: 7px; margin: 0 0 22px; background: var(--card); border-radius: 22px; box-shadow: var(--shadow); }
  .pager button { flex: 1; min-width: 0; height: 40px; border: 0; border-radius: 13px; background: var(--chip); color: var(--sub); font: inherit; font-weight: 600; font-size: 1rem; cursor: pointer; }
  .pager button.done { color: var(--ok); }
  .pager button.done::before { content: "✓"; font-weight: 800; }
  .pager button.done { font-size: 0; }
  .pager button.done::before { font-size: 1rem; }
  .pager button.cur { background: var(--btn); color: var(--btn-ink); box-shadow: var(--btn-shadow); font-weight: 700; }
  /* การ์ด */
  .card { background: var(--card); border-radius: 28px; padding: 18px; box-shadow: var(--shadow); }
  .frame { padding: 6px; border-radius: 26px; background: var(--inner); border: 1px solid var(--line); }
  .frame > img, .frame > video { display: block; width: 100%; height: auto; border-radius: 20px; }
  .hero { margin: 0; }
  .hero .frame { border-radius: 24px; } .hero .frame > img { border-radius: 18px; }
  /* หัวข้อ */
  .chip { display: inline-block; margin: 0 0 6px; padding: 3px 10px; border-radius: 999px; background: var(--card); border: 1px solid var(--line); font-size: .78rem; font-weight: 600; color: var(--sub); box-shadow: 0 1px 2px rgba(0,0,0,.04); }
  h1 { font-size: 2rem; line-height: 1.15; letter-spacing: -.02em; margin: 0 0 8px; font-weight: 700; }
  h2 { font-size: 1.5rem; line-height: 1.25; letter-spacing: -.015em; margin: 0; font-weight: 700; }
  .mute { display: block; color: var(--mute); }
  .done-h { font-size: 2rem; margin-bottom: 8px; }
  .lead { color: var(--sub); margin: 0; font-size: 1.02rem; }
  .intro-text { margin: 4px 4px 18px; }
  /* หน้าแรก: พื้นขาวลายจุด หัวข้อใหญ่ ชิป และผู้สร้าง */
  /* หน้าแรก: ไม่มีแถบเลขขั้น ส่วนหัวอยู่กลางจอแรก (เว้นที่ให้ปุ่มล่าง) การ์ดตัวอย่างอยู่ถัดลงไป */
  html.intro .pager { display: none; }
  .brand { margin: 0 6px 18px; display: flex; flex-direction: column; justify-content: center; padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
    min-height: calc(100vh - 14px - env(safe-area-inset-top, 0px));
    min-height: calc(100svh - 14px - env(safe-area-inset-top, 0px)); }
  .brand h1 { margin: 0; font-weight: 400; line-height: 1.12; letter-spacing: 0; }
  .brand h1 span { display: block; }
  .brand .l1 { font-size: clamp(1.9rem, 9vw, 2.4rem); }
  .brand .l2 { font-size: clamp(2.5rem, 12.5vw, 3.3rem); font-weight: 700; letter-spacing: .005em; }
  .brand .l3 { font-size: clamp(1.7rem, 10.2vw, 2.9rem); }
  .pills { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 0; padding: 0; }
  .pills li, .maker .pill { background: var(--card); color: var(--ink); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 6px 14px -8px rgba(0,0,0,.18);
    border-radius: 999px; padding: 3px 14px 4px; font-size: 1.05rem; }
  .maker { display: flex; align-items: center; gap: 16px; margin-top: 40px; }
  .maker img { flex: none; width: 80px; height: auto; }
  .maker p { margin: 0; line-height: 1.3; }
  .maker .by { font-size: 1.08rem; }
  .maker .bwy { font-size: 1.12rem; font-weight: 700; }
  .maker .pill { display: inline-block; margin-top: 6px; font-size: .95rem; padding: 2px 12px 3px; }
  .hint { color: var(--sub); margin: 14px 2px 0; font-size: .95rem; }
  .head { display: flex; align-items: center; gap: 14px; margin: 0 2px 16px; }
  .num { flex: none; width: 64px; height: 64px; border-radius: 50%; background: #FFFFFF; color: #0B0B0C; display: grid; place-items: center;
    font-size: 2rem; font-weight: 800; line-height: 1; box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 10px 24px -8px rgba(0,0,0,.25); border: 1px solid rgba(0,0,0,.04); }
  .head .chip { margin-bottom: 4px; }
  /* เนื้อหาในการ์ด */
  .txt > p:not(.copied):not(.safe) { margin: 0 0 4px; color: var(--sub); font-size: 1.05rem; }
  .txt > :first-child { margin-top: 0 !important; }
  ol.do { list-style: none; counter-reset: d; margin: 0; padding: 0; display: grid; gap: 10px; color: var(--sub); font-size: 1.04rem; }
  ol.do li { counter-increment: d; display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; }
  ol.do li::before { content: counter(d); width: 28px; height: 28px; border-radius: 9px; background: var(--chip); color: var(--ink); display: grid; place-items: center; font-weight: 700; font-size: .9rem; margin-top: 1px; }
  ol.do + p { margin-top: 12px !important; }
  b.key { color: var(--ink); font-weight: 700; }
  .shot { margin: 16px auto 0; width: min(100%, 300px); }
  .shot.wide { width: 100%; }
  .shot.wide .frame { background: #fff; }
  /* กล่อง ต้องเห็น / ข้อมูล */
  .check { display: grid; grid-template-columns: 30px 1fr; gap: 12px; align-items: start; margin: 16px 0 0; padding: 12px 14px; border-radius: 18px; background: var(--inner); border: 1px solid var(--line); }
  .check p { margin: 0; color: var(--ink); font-size: .98rem; }
  .check p + p { margin-top: 8px; }
  .check b { display: block; font-size: .78rem; letter-spacing: .02em; color: var(--ok); margin-bottom: 1px; }
  .check .ic { width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; font-weight: 800; font-size: .95rem; color: #fff;
    background: linear-gradient(180deg, #3BB061, #1E7F3C); box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 4px 10px -3px rgba(30,127,60,.6); }
  .check.info .ic { background: var(--btn); color: var(--btn-ink); box-shadow: var(--btn-shadow); font-family: Georgia, serif; font-style: italic; }
  .check.info b { color: var(--ink); font-size: .95rem; letter-spacing: 0; }
  .check.info p { color: var(--sub); font-size: .93rem; }
  /* รายการก่อนเริ่ม */
  .need { list-style: none; margin: 16px 2px 0; padding: 0; display: grid; gap: 10px; }
  .need li { display: flex; align-items: center; gap: 10px; color: var(--ink); }
  .need li::before { content: "✓"; flex: none; width: 24px; height: 24px; border-radius: 8px; display: grid; place-items: center; background: var(--chip); color: var(--ok); font-weight: 800; font-size: .8rem; }
  .need li.no { color: var(--sub); }
  .need li.no::before { content: "✕"; color: var(--sub); }
  /* ปุ่ม */
  .btn { display: flex; align-items: center; justify-content: center; min-height: 54px; margin-top: 16px; padding: 0 20px; border-radius: 18px; width: 100%;
    font-family: inherit; font-weight: 700; font-size: 1.05rem; text-decoration: none; cursor: pointer; border: 0; background: var(--btn); color: var(--btn-ink); box-shadow: var(--btn-shadow); }
  .btn.ghost { background: var(--card); color: var(--ink); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 14px -8px rgba(0,0,0,.2); }
  .btn:focus-visible, .nav button:focus-visible, .pager button:focus-visible { outline: 3px solid #4C8DFF; outline-offset: 3px; }
  .copywrap { position: relative; }
  .btn.copy { gap: 8px; font-size: 1.15rem; min-height: 58px; }
  .btn.copy .tick { width: 0; height: 24px; fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 22; stroke-dashoffset: 22; }
  .btn.copy.done { background: linear-gradient(180deg, #3BB061, #1E7F3C); color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 10px 22px -6px rgba(30,127,60,.6); }
  .btn.copy.done .tick { width: 24px; stroke-dashoffset: 0; }
  .copied { margin: 10px 0 0; text-align: center; font-weight: 700; color: var(--ok); }
  pre.code { margin: 12px 0 0; max-height: 24vh; overflow: auto; padding: 14px; border-radius: 18px; background: linear-gradient(180deg, #1C1C1F, #0E0E10); color: #D8D8DE;
    border: 1px solid #2A2A2E; box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
    font: 11.5px/1.55 ui-monospace, Menlo, Consolas, monospace; white-space: pre-wrap; word-break: break-word; -webkit-user-select: text; user-select: text; }
  .txt > p.safe { margin: 12px 0 0; font-size: .88rem; color: var(--sub); }
  .burst { position: absolute; left: 50%; top: 42px; width: 0; height: 0; pointer-events: none; }
  .burst i { position: absolute; left: 0; top: 0; font-style: normal; font-size: 22px; line-height: 1; opacity: 0; transform: translate(-50%, -50%); }
  .burst i.dot { width: 9px; height: 9px; border-radius: 50%; }
  @media (prefers-reduced-motion: no-preference) {
    .btn.copy .tick { transition: width .2s, stroke-dashoffset .35s .15s ease-out; }
    .btn, .pager button { transition: background .2s, transform .18s cubic-bezier(.3, 1.8, .5, 1), box-shadow .2s; }
    .btn:active, .pager button:active { transform: scale(.96); }
    .btn.copy.pop { animation: pop .5s cubic-bezier(.2, 1.7, .4, 1); }
    .burst i { animation: fly .9s cubic-bezier(.15, .7, .3, 1) forwards; }
    .copied:not([hidden]) { animation: rise .4s ease-out; }
    #next.nudge { animation: nudge 1.2s ease-in-out 2; }
    .screen.on { animation: enter .35s cubic-bezier(.2, .8, .3, 1); }
  }
  @keyframes enter { from { opacity: 0; transform: translateY(8px); } }
  @keyframes pop { 0% { transform: scale(1); } 30% { transform: scale(.9); } 100% { transform: scale(1); } }
  @keyframes fly { 0% { opacity: 1; transform: translate(-50%, -50%) scale(.4); }
    70% { opacity: 1; } 100% { opacity: 0; transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1) rotate(var(--r)); } }
  @keyframes rise { from { opacity: 0; transform: translateY(6px); } }
  @keyframes nudge { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); box-shadow: var(--btn-shadow), 0 0 0 6px rgba(46, 160, 80, .35); } }
  /* Parameter / คำถาม / ลิงก์เล็ก */
  .opts { margin: 16px 0 0; border-radius: 18px; background: var(--inner); border: 1px solid var(--line); padding: 2px 14px; }
  .opt { display: grid; grid-template-columns: minmax(0, auto) 1fr; gap: 12px; align-items: baseline; padding: 11px 0; border-bottom: 1px solid var(--line); }
  .opt:last-child { border-bottom: 0; }
  .opt .k { color: var(--sub); font-size: .85rem; }
  .opt > span:last-child { color: var(--ink); font-size: .98rem; }
  code { font: 600 .95rem ui-monospace, Menlo, Consolas, monospace; color: var(--ink); background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 1px 7px; white-space: nowrap; }
  .faq { padding: 6px 20px; }
  .faq details { border-bottom: 1px solid var(--line); padding: 14px 0; }
  .faq details:last-child { border-bottom: 0; }
  .faq summary { font-weight: 700; font-size: 1.02rem; cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 12px; }
  .faq summary::-webkit-details-marker { display: none; }
  .faq summary::after { content: "+"; flex: none; width: 26px; height: 26px; border-radius: 9px; background: var(--chip); color: var(--sub); display: grid; place-items: center; font-weight: 700; }
  .faq details[open] summary::after { content: "−"; }
  .faq details p { margin: 8px 0 0; color: var(--sub); font-size: .97rem; }
  .more { margin: 16px 2px 0; color: var(--sub); font-size: .95rem; }
  .link { border: 0; background: none; padding: 0; font: inherit; font-weight: 700; color: var(--ink); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .js-only .btn + .btn { margin-top: 10px; }
  textarea.fallback { width: 100%; height: 160px; margin-top: 10px; font-size: 12px; display: none; }
  /* แถบปุ่มล่าง: กล่องลอย */
  .nav { position: fixed; left: 0; right: 0; bottom: 0; padding: 0 16px calc(14px + env(safe-area-inset-bottom, 0px)); pointer-events: none; }
  .nav div { pointer-events: auto; max-width: 448px; margin: 0 auto; display: flex; gap: 6px; padding: 6px; border-radius: 24px; background: var(--glass);
    -webkit-backdrop-filter: blur(18px) saturate(1.4); backdrop-filter: blur(18px) saturate(1.4); border: 1px solid var(--line); box-shadow: 0 18px 40px -12px rgba(0,0,0,.3); }
  .nav button { min-height: 52px; border-radius: 18px; border: 0; font-family: inherit; font-weight: 700; font-size: 1.08rem; cursor: pointer; }
  #back { flex: 0 0 36%; background: var(--chip); color: var(--sub); }
  #next { flex: 1; background: var(--btn); color: var(--btn-ink); box-shadow: var(--btn-shadow); }
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
    main { max-width: 980px; }
    .pager { max-width: 460px; margin-left: auto; margin-right: auto; }
    .nav div { max-width: 520px; }
    /* การ์ดขั้นตอน: คำอธิบายซ้าย ภาพ/คลิปขวา */
    .step .card:not(.faq) { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto 1fr; column-gap: 36px; align-items: start; padding: 26px; }
    .step .card > .txt { grid-column: 1; grid-row: 1; }
    .step .card > .check { grid-column: 1; grid-row: 2; align-self: start; }
    .step .card > .shot { grid-column: 2; grid-row: 1 / span 2; }
    .step .card > .shot { margin: 0; width: clamp(240px, calc((100vh - 300px) * .462), 330px); width: clamp(240px, calc((100svh - 300px) * .462), 330px); }
    .step .card > .shot.wide { width: min(440px, 44vw); }
    h2 { font-size: 1.8rem; }
    .narrow { max-width: 720px; margin-left: auto; margin-right: auto; }
    /* หน้าแรก / หน้าเสร็จ: ข้อความซ้าย การ์ดขวา */
    html:not(.js) #s0, #s0.on, #s${N + 1}.on { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); column-gap: 40px; align-items: center; }
    h1, .done-h { font-size: 2.6rem; }
    /* หน้าแรกบนจอกว้าง: ทั้งสองคอลัมน์อยู่กลางจอ */
    #s0.on, html:not(.js) #s0 { align-content: center; min-height: calc(100vh - 130px); min-height: calc(100svh - 130px); }
    .brand { min-height: 0; margin-bottom: 0; padding-bottom: 0; }
  }
  /* มือถือแนวนอน (จอเตี้ย) */
  @media (orientation: landscape) and (max-height: 520px) {
    main { padding-top: calc(8px + env(safe-area-inset-top, 0px)); padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px)); }
    .pager { margin-bottom: 12px; padding: 5px; } .pager button { height: 32px; }
    .nav { padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px)); } .nav button { min-height: 44px; }
    .head { margin-bottom: 10px; } .num { width: 48px; height: 48px; font-size: 1.5rem; }
    .step .card > .shot { width: clamp(170px, calc((100vh - 170px) * .462), 300px); }
    .step .card > .shot.wide { width: min(380px, 42vw); }
    h1, .done-h { font-size: 1.9rem; }
  }
  /* ไม่มี JS: แสดงทุกขั้นต่อกัน ซ่อนแถบปุ่ม */
  html:not(.js) .nav, html:not(.js) .pager, html:not(.js) .js-only { display: none; }
  html:not(.js) .screen + .screen { margin-top: 40px; }
  html.js .screen:not(.on) { display: none; }
</style>
</head>
<body>
<script>document.documentElement.classList.add("js");</script>
<main>
  <nav class="pager" id="pager" aria-label="ไปที่ขั้น">${STEPS.map((_, i) => `<button type="button" data-go="${i + 1}" aria-label="ขั้นที่ ${i + 1}">${i + 1}</button>`).join("")}</nav>
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
  const pre = document.getElementById("code");
  pre.textContent = code;
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      lbl.textContent = "Copied!"; copy.classList.add("done"); copied.hidden = false; party();
    } catch (e) { ta.value = code; ta.style.display = "block"; ta.focus(); ta.select(); lbl.textContent = "เลือกทั้งหมดแล้วก๊อปจากกล่องด้านล่าง"; }
  });

  const screens = [...document.querySelectorAll(".screen")], LAST = screens.length - 1, HASH = screens.map(s => s.dataset.hash);
  const DONE = HASH.indexOf("done"), STEPS = DONE - 1;
  const extra = i => i > DONE; // หน้าเสริมหลังหน้าเสร็จ: ธีม / Parameter / คำถาม
  const idx = h => { h = String(h || "").replace(/^#/, ""); const j = HASH.indexOf(h); return j >= 0 ? j : parseInt(h, 10) || 0; };
  const back = document.getElementById("back"), next = document.getElementById("next"), pager = [...document.querySelectorAll("#pager button")];
  const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = -1, ret = 0; // ret = หน้าที่จะกลับไปจากหน้าเสริม
  // เล่นคลิปของหน้าที่เปิดอยู่ ถ้า iPhone หยุดเอง (โหลดไม่ทัน สลับแอป ประหยัดพลังงาน) ให้ลองเล่นต่อเอง
  const active = v => !still && !v.userPaused && v.closest(".screen").classList.contains("on");
  function play(v) {
    if (!active(v)) return;
    const p = v.play();
    if (p && p.catch) p.catch(err => {
      if (err && err.name === "NotAllowedError") { v.controls = true; return; } // เครื่องไม่ให้เล่นเอง (เช่นโหมดประหยัดพลังงาน) โชว์ปุ่มเล่นแทน
      if (v.readyState < 3) v.addEventListener("canplay", () => play(v), { once: true }); else setTimeout(() => play(v), 300); });
  }
  document.querySelectorAll(".shot video").forEach(v => {
    v.addEventListener("pause", () => { if (active(v) && !v.ended) setTimeout(() => { if (v.paused) play(v); }, 250); });
    ["stalled", "waiting", "canplay"].forEach(ev => v.addEventListener(ev, () => { if (v.paused) play(v); }));
    v.addEventListener("ended", () => { v.currentTime = 0; play(v); }); // กันกรณี loop ไม่ทำงาน
    v.addEventListener("click", () => { if (v.paused) { v.userPaused = false; play(v); } else { v.userPaused = true; v.pause(); } });
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { const v = screens[cur] && screens[cur].querySelector("video"); if (v) play(v); } });
  function show(i, push) {
    i = Math.max(0, Math.min(LAST, i));
    if (i === cur) return;
    if (extra(i) && cur >= 0 && !extra(cur)) ret = cur;
    cur = i;
    document.documentElement.classList.toggle("intro", i === 0);
    screens.forEach((s, j) => {
      s.classList.toggle("on", j === i);
      const v = s.querySelector("video");
      if (!v) return;
      if (j === i) { v.preload = "auto"; v.userPaused = false; if (still) v.controls = true; else { if (v.readyState > 0) v.currentTime = 0; play(v); } }
      else v.pause();
      if (j === i + 1) v.preload = "auto"; // โหลดคลิปขั้นถัดไปรอไว้
    });
    back.hidden = i === 0 || extra(i);
    next.textContent = extra(i) ? (ret === 0 ? "← กลับหน้าแรก" : ret === DONE ? "กลับหน้าเสร็จ ✓" : "← กลับไปขั้นที่ " + ret)
      : i === 0 ? "เริ่มติดตั้ง →" : i === STEPS ? "เสร็จแล้ว ✓" : i === DONE ? "กลับไปขั้นแรก" : "ถัดไป →";
    const ref = extra(i) ? ret : i;
    pager.forEach((b, j) => { const n = j + 1; b.classList.toggle("cur", n === i); b.classList.toggle("done", n < ref || ref > STEPS);
      if (n === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    window.scrollTo(0, 0);
    if (push) history.pushState({ i }, "", i ? "#" + HASH[i] : location.pathname + location.search);
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
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => show(idx(b.dataset.go), true)));
  next.addEventListener("click", () => show(extra(cur) ? ret : cur === DONE ? 1 : cur + 1, true));
  back.addEventListener("click", () => show(cur - 1, true));
  window.addEventListener("popstate", () => show(idx(location.hash), false));
  document.addEventListener("keydown", e => {
    if (/input|textarea/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") next.click(); else if (e.key === "ArrowLeft" && cur > 0) back.click();
  });
  history.replaceState({ i: 0 }, "", location.href);
  show(idx(location.hash), false);
})();
</script>
</body>
</html>
`;
fs.writeFileSync("index.html", html);
