// สร้างหน้ารวมลิงก์ (links/index.html) + ลิงก์ย่อ (links/<ชื่อ>.html) + รายการสำหรับหน้า /stats (lib/links.js)
// ทั้งหมดมาจาก links/links.json ไฟล์เดียว แก้ปุ่ม/ลิงก์ที่นั่นแล้วรัน: node tools/make-links.js
// เช็กว่าไฟล์ตรงกับ links.json (ใช้ในเทสต์): node tools/make-links.js --check
// ทุกหน้าเป็นไฟล์ static ไม่ใช้ Functions: ต่อให้โควตาเต็ม ลิงก์ก็ยังพาไปปลายทางได้
// การนับยอดส่งไปที่ระบบสถิติเดิมของ bwy-widget (/api/e) ชนิด hub = หน้ารวมลิงก์, link = ลิงก์ย่อ
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "links");
const NAME_RE = /^[a-z0-9][a-z0-9-]{0,23}$/; // ต้องผ่าน clean() ของ lib/stats.js และเป็นชื่อไฟล์ได้
const RESERVED = new Set(["home", "index", "fonts", "404", "og", "jedi", "links", "icon"]);
const API = "https://bwy-widget.pages.dev/api/e", API_TEST = "https://test.bwy-widget.pages.dev/api/e";

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// ข้อความที่แสดง: คำที่มีขีด เช่น A-Level ห้ามตัดบรรทัดกลางคำ
const txt = s => esc(s).replace(/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+/g, w => `<span class="nw">${w}</span>`);

// icon เส้น (viewBox 24) ไม่ใช้ emoji
const ICON = {
  folder: '<path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3.6l2.2 2.4H18a2.5 2.5 0 0 1 2.5 2.5v7.6A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M3.5 10.5h17"/>',
  widget: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  chat: '<path d="M12 4c4.7 0 8.5 3 8.5 6.8 0 3.7-3.8 6.7-8.5 6.7-.8 0-1.5-.1-2.2-.2L5.5 20l.6-3.9C4.4 14.9 3.5 13 3.5 10.8 3.5 7 7.3 4 12 4Z"/><path d="M8.5 10.8h.01M12 10.8h.01M15.5 10.8h.01" stroke-width="2.6"/>',
  book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15.5H5.5A1.5 1.5 0 0 1 4 18Z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15.5h5.5A1.5 1.5 0 0 0 20 18Z"/>',
  play: '<rect x="3.5" y="5" width="17" height="14" rx="3.5"/><path d="M10.2 9.2v5.6l4.6-2.8Z"/>',
  pen: '<path d="M14.5 5.5 18.5 9.5M4 20l1-4.5L15.8 4.7a1.8 1.8 0 0 1 2.5 0l1 1a1.8 1.8 0 0 1 0 2.5L8.5 19Z"/>',
  star: '<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8Z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
};
const svg = (d, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ARROW = '<path d="M9 5.5 15.5 12 9 18.5"/>';

// ตรวจ links.json ก่อนสร้าง (ผิดตรงไหนบอกเป็นภาษาคน)
function load(file = path.join(DIR, "links.json")) {
  const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
  const errs = [], warn = [];
  const url = (u, where) => { if (!/^https:\/\/[^\s"<>]+$/.test(String(u || ""))) errs.push(`${where}: ลิงก์ต้องขึ้นต้นด้วย https:// (ได้ "${u}")`); else if (/example\.com/.test(u)) warn.push(`${where}: ยังเป็นลิงก์สมมติ ${u}`); };
  if (!/^https:\/\/[a-z0-9.-]+$/.test(cfg.site || "")) errs.push(`site ต้องเป็นแบบ https://ชื่อ.pages.dev (ไม่มี / ท้าย)`);
  for (const k of ["name", "bio"]) if (!cfg[k]) errs.push(`ต้องมี ${k}`);
  const ids = new Set();
  for (const [list, label] of [[cfg.buttons || [], "buttons"], [cfg.socials || [], "socials"]]) list.forEach((b, i) => {
    const where = `${label}[${i}] ${b.id || ""}`;
    if (!NAME_RE.test(b.id || "") || RESERVED.has(b.id)) errs.push(`${where}: id ใช้ได้แค่ a-z 0-9 - ไม่เกิน 24 ตัว และห้ามใช้ ${[...RESERVED].join(" ")}`);
    if (ids.has(b.id)) errs.push(`${where}: id ซ้ำกับปุ่มอื่น`);
    ids.add(b.id);
    if (!b.title) errs.push(`${where}: ต้องมี title`);
    if (label === "buttons" && b.icon && !ICON[b.icon]) errs.push(`${where}: ไม่มี icon "${b.icon}" (มี ${Object.keys(ICON).join(" ")})`);
    url(b.url, where);
  });
  const names = new Set();
  (cfg.short || []).forEach((s, i) => {
    const where = `short[${i}] ${s.name || ""}`;
    if (!NAME_RE.test(s.name || "") || RESERVED.has(s.name)) errs.push(`${where}: ชื่อใช้ได้แค่ a-z 0-9 - ไม่เกิน 24 ตัว และห้ามใช้ ${[...RESERVED].join(" ")}`);
    if (names.has(s.name)) errs.push(`${where}: ชื่อซ้ำ`);
    names.add(s.name);
    url(s.url, where);
  });
  if (errs.length) throw new Error("links.json ผิด:\n- " + errs.join("\n- "));
  return { cfg, warn };
}

// ส่งสัญญาณนับ (string = text/plain ส่งข้ามโดเมนได้โดยไม่ต้อง preflight ไม่ต้องอ่านคำตอบ)
// เว็บทดสอบ (test.xxx.pages.dev) ส่งไปเว็บทดสอบของ bwy-widget ตัวเลขจริงไม่ปน
const BEACON = `var API=/^test\\./.test(location.hostname)?"${API_TEST}":"${API}";
var REF=(function(){try{var h=document.referrer?new URL(document.referrer).hostname:"";return h===location.hostname?"":h}catch(e){return""}})();
function send(ev){var b=JSON.stringify({ref:REF,ev:ev});try{if(!(navigator.sendBeacon&&navigator.sendBeacon(API,b)))fetch(API,{method:"POST",body:b,keepalive:true,mode:"no-cors"}).catch(function(){})}catch(e){}}`;

const FONTS = [400, 600, 700].map(w => `@font-face{font-family:"Prompt";font-weight:${w};font-display:swap;src:url(/fonts/prompt-thai-${w}.woff2) format("woff2");unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"Prompt";font-weight:${w};font-display:swap;src:url(/fonts/prompt-latin-${w}.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}`).join("\n");

const CSS = `${FONTS}
:root{color-scheme:light;--paper:#FEFEFE;--dot:#E4E4E6;--card:#FFFFFF;--inner:#F6F6F6;--ink:#0B0B0C;--sub:#6B6B70;--mute:#A3A3A8;--line:#ECECEC;--chip:#F2F2F2;
--shadow:0 1px 2px rgba(0,0,0,.04),0 12px 28px -14px rgba(0,0,0,.18);
--btn:linear-gradient(180deg,#3B3B3D 0%,#161617 55%,#050505 100%);--btn-ink:#FFFFFF;--btn-sub:rgba(255,255,255,.66);--btn-tile:rgba(255,255,255,.12);
--btn-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 2px 3px rgba(0,0,0,.18),0 10px 22px -6px rgba(0,0,0,.45)}
@media (prefers-color-scheme:dark){:root{color-scheme:dark;--paper:#0F0F11;--dot:#232327;--card:#1B1B1E;--inner:#232327;--ink:#F4F4F6;--sub:#A3A3AA;--mute:#6E6E76;--line:#2B2B30;--chip:#26262B;
--shadow:0 1px 0 rgba(255,255,255,.04) inset,0 12px 28px -14px rgba(0,0,0,.7);
--btn:linear-gradient(180deg,#FFFFFF 0%,#E9E9EB 60%,#D2D2D6 100%);--btn-ink:#0B0B0C;--btn-sub:rgba(11,11,12,.6);--btn-tile:rgba(0,0,0,.07);
--btn-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 2px 3px rgba(0,0,0,.4),0 10px 22px -6px rgba(0,0,0,.6)}}
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0}html{background:var(--paper);-webkit-text-size-adjust:100%}
html,body,a{touch-action:manipulation}
body{min-height:100vh;min-height:100dvh;color:var(--ink);line-height:1.5;-webkit-font-smoothing:antialiased;font-family:"Prompt",-apple-system,BlinkMacSystemFont,"Sukhumvit Set","Thonburi","Leelawadee UI","Segoe UI",sans-serif}
body::before{content:"";position:fixed;inset:-20vh 0;z-index:-1;pointer-events:none;background:radial-gradient(circle,var(--dot) 1.1px,transparent 1.6px) 0 0/13px 13px,var(--paper)}
main{max-width:480px;margin:0 auto;padding:calc(36px + env(safe-area-inset-top,0px)) 16px calc(32px + env(safe-area-inset-bottom,0px))}
.me{text-align:center;margin:0 6px 26px}
.me img{display:block;width:104px;height:auto;margin:0 auto 12px;filter:drop-shadow(0 10px 18px rgba(0,0,0,.14))}
.me h1{margin:0;font-size:2.1rem;line-height:1.15;font-weight:700;letter-spacing:-.01em}
.me .by{margin:2px 0 0;color:var(--sub);font-size:1rem}
.me .pill{display:inline-block;margin:10px 0 0;padding:3px 14px 4px;border-radius:999px;background:var(--card);border:1px solid var(--line);box-shadow:0 1px 2px rgba(0,0,0,.04),0 6px 14px -8px rgba(0,0,0,.18);font-size:.92rem}
.me .bio{margin:14px auto 0;max-width:22em;font-size:1.04rem;color:var(--ink)}
.list{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.b{display:flex;align-items:center;gap:14px;min-height:72px;padding:12px 14px 12px 12px;border-radius:22px;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);-webkit-tap-highlight-color:transparent}
.b .tile{flex:none;width:46px;height:46px;border-radius:14px;background:var(--chip);display:grid;place-items:center}
.b .ico{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.b .t{flex:1;min-width:0}.b b{display:block;font-size:1.06rem;line-height:1.3;font-weight:600}.b small{display:block;margin-top:1px;color:var(--sub);font-size:.86rem;line-height:1.35}
.b .go{flex:none;width:18px;height:18px;color:var(--mute);stroke-width:2.2}
.b.main{background:var(--btn);color:var(--btn-ink);border-color:transparent;box-shadow:var(--btn-shadow)}
.b.main .tile{background:var(--btn-tile)}.b.main small,.b.main .go{color:var(--btn-sub)}
.b:focus-visible,.chips a:focus-visible{outline:3px solid #4C8DFF;outline-offset:3px}
@media (prefers-reduced-motion:no-preference){.b,.chips a{transition:transform .18s cubic-bezier(.3,1.8,.5,1),box-shadow .2s}.b:active,.chips a:active{transform:scale(.97)}}
.follow{margin:30px 0 0;text-align:center}.follow h2{margin:0 0 12px;font-size:.92rem;font-weight:600;color:var(--sub)}
.chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.nw{white-space:nowrap}
.chips a{display:block;min-height:40px;padding:8px 16px;border-radius:999px;background:var(--card);border:1px solid var(--line);box-shadow:0 1px 2px rgba(0,0,0,.04),0 6px 14px -8px rgba(0,0,0,.18);color:var(--ink);text-decoration:none;font-weight:600;font-size:.95rem;line-height:1.5;-webkit-tap-highlight-color:transparent}`;

function hub(cfg) {
  const site = cfg.site, desc = `${cfg.bio} · ${cfg.by || ""}`.replace(/ · $/, "");
  const btn = (b, i) => `<li><a class="b${i === 0 ? " main" : ""}" href="${esc(b.url)}" data-id="${b.id}"><span class="tile">${svg(ICON[b.icon || "link"])}</span><span class="t"><b>${txt(b.title)}</b>${b.note ? `<small>${txt(b.note)}</small>` : ""}</span>${svg(ARROW, "ico go")}</a></li>`;
  const socials = (cfg.socials || []).length ? `<section class="follow" aria-labelledby="fh"><h2 id="fh">ติดตาม ${esc(cfg.name)}</h2><ul class="chips">${cfg.socials.map(s => `<li><a href="${esc(s.url)}" data-id="${s.id}">${esc(s.title)}</a></li>`).join("")}</ul></section>` : "";
  return `<!DOCTYPE html>
<!-- สร้างจาก links/links.json ด้วย node tools/make-links.js (ห้ามแก้ไฟล์นี้เอง) -->
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(cfg.name)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#FEFEFE" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F0F11" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="${site}/">
<meta property="og:type" content="website">
<meta property="og:url" content="${site}/">
<meta property="og:title" content="${esc(cfg.name)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${site}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icon.png" type="image/png">
<link rel="apple-touch-icon" href="/icon.png">
<link rel="preload" href="/fonts/prompt-thai-600.woff2" as="font" type="font/woff2" crossorigin>
<!-- ฟอนต์ Prompt (Cadson Demak, SIL Open Font License: fonts/OFL.txt) -->
<style>${CSS}</style>
</head>
<body>
<main>
<header class="me">
<img src="/jedi.webp" width="264" height="289" alt="พี่เจได">
<h1>${esc(cfg.name)}</h1>
${cfg.by ? `<p class="by">${esc(cfg.by)}</p>` : ""}
${cfg.school ? `<p class="pill">${txt(cfg.school)}</p>` : ""}
<p class="bio">${txt(cfg.bio)}</p>
</header>
<ul class="list">
${cfg.buttons.map(btn).join("\n")}
</ul>
${socials}
</main>
<script>
${BEACON}
send([["hub","home"]]);
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[data-id]");if(a)send([["hub",a.getAttribute("data-id")]])});
</script>
</body>
</html>
`;
}

// ลิงก์ย่อ: ส่งสัญญาณนับ 1 แล้วพาไปปลายทางทันที (ไม่มี JS ก็ไปได้ด้วย meta refresh)
function shortPage(s, cfg) {
  return `<!DOCTYPE html>
<!-- ${cfg.site.replace("https://", "")}/${s.name} สร้างจาก links/links.json ด้วย node tools/make-links.js (ห้ามแก้ไฟล์นี้เอง) -->
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="1;url=${esc(s.url)}">
<title>${esc(cfg.name)}</title>
<style>html{background:#FEFEFE}@media (prefers-color-scheme:dark){html{background:#0F0F11}}</style>
<script>
${BEACON}
send([["link",${JSON.stringify(s.name)}]]);
location.replace(${JSON.stringify(s.url)});
</script>
</head>
<body></body>
</html>
`;
}

// รายการสำหรับหน้า /stats ของ bwy-widget (ชื่อปุ่ม + ลิงก์ย่อให้กด Copy)
function statsList(cfg) {
  const data = {
    site: cfg.site,
    buttons: [...cfg.buttons, ...(cfg.socials || [])].map(b => ({ id: b.id, title: b.title })),
    short: (cfg.short || []).map(s => ({ name: s.name, url: s.url })),
  };
  return `// สร้างจาก links/links.json ด้วย node tools/make-links.js (ห้ามแก้ไฟล์นี้เอง) ใช้ในหน้า /stats
export const LINKS = ${JSON.stringify(data, null, 2)};
`;
}

function build() {
  const { cfg, warn } = load();
  const out = { "links/index.html": hub(cfg), "lib/links.js": statsList(cfg) };
  for (const s of cfg.short || []) out[`links/${s.name}.html`] = shortPage(s, cfg);
  return { out, warn, cfg };
}

// ไฟล์ .html ใน links/ ที่ไม่ได้มาจาก links.json (ลิงก์ย่อที่ลบไปแล้ว)
const stale = out => fs.readdirSync(DIR).filter(f => f.endsWith(".html") && !out["links/" + f]).map(f => "links/" + f);

module.exports = { build, load, stale, ICON };

if (require.main === module) {
  const { out, warn } = build();
  if (process.argv.includes("--check")) {
    const bad = Object.keys(out).filter(f => !fs.existsSync(path.join(ROOT, f)) || fs.readFileSync(path.join(ROOT, f), "utf8") !== out[f]);
    const extra = stale(out);
    if (bad.length || extra.length) { console.log(`❌ ไฟล์ไม่ตรงกับ links/links.json: ${[...bad, ...extra].join(", ")} (รัน node tools/make-links.js)`); process.exit(1); }
    console.log("✅ links/ ตรงกับ links.json");
  } else {
    for (const f of stale(out)) { fs.unlinkSync(path.join(ROOT, f)); console.log("ลบ " + f); }
    for (const [f, s] of Object.entries(out)) fs.writeFileSync(path.join(ROOT, f), s);
    console.log(`เขียน ${Object.keys(out).length} ไฟล์`);
  }
  warn.forEach(w => console.log("⚠️  " + w));
}
