// สร้างหน้ารวมลิงก์ bearwithyou.pages.dev จาก links/links.json ไฟล์เดียว แล้วรัน: node tools/make-links.js
//   links/index.html           หน้ารวมลิงก์
//   links/<entry>.html         หน้ารวมลิงก์แบบติดป้ายที่มา เช่น /tt /ig (หน้าเดียวกันทุกอย่าง แค่บอกสถิติว่ามาจากไหน)
//   links/<short>.html         ลิงก์ย่อ เช่น /mock พาไปปลายทางทันที
//   lib/links.js               รายการสำหรับหน้า /stats ของ bwy-widget
// เช็กว่าไฟล์ตรงกับ links.json (ใช้ในเทสต์): node tools/make-links.js --check
// ใช้ไฟล์จาก Links Studio: node tools/make-links.js ไฟล์.json (ตรวจแล้วแทน links/links.json)
// ทุกหน้าเป็นไฟล์ static ไม่ใช้ Functions: ต่อให้โควตาเต็ม ลิงก์ก็ยังพาไปปลายทางได้
// นับยอดด้วยระบบสถิติเดิมของ bwy-widget (/api/e): hub = เปิดหน้า (home) / กดปุ่ม (id), link = เปิดลิงก์ย่อ
"use strict";
const fs = require("fs"), path = require("path");
const linksRender = require("./links-render.js");
const R = linksRender();
const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "links");
const NAME_RE = /^[a-z0-9][a-z0-9-]{0,23}$/; // ต้องผ่าน clean() ของ lib/stats.js และเป็นชื่อไฟล์ได้
const RESERVED = ["home", "index", "fonts", "404", "og", "icon", "jedi", "links", "api", "stats"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const API = "https://bwy-widget.pages.dev/api/e", API_TEST = "https://test.bwy-widget.pages.dev/api/e";
const esc = R.esc;

// ตรวจ links.json ก่อนสร้าง (ผิดตรงไหนบอกเป็นภาษาคน) ใช้กฎเดียวกับหน้าแก้ไข Links Studio
function check(cfg) {
  const errs = [], warn = [];
  const url = (u, where) => {
    if (!/^https:\/\/[^\s"<>]+$/.test(String(u || ""))) errs.push(`${where}: ลิงก์ต้องขึ้นต้นด้วย https:// (ได้ "${u || ""}")`);
    else if (/example\.com/.test(u)) warn.push(`${where}: ยังเป็นลิงก์สมมติ ${u}`);
  };
  const name = (n, where) => { if (!NAME_RE.test(n || "") || RESERVED.includes(n)) errs.push(`${where}: ชื่อใช้ได้แค่ a-z 0-9 - ไม่เกิน 24 ตัว และห้ามใช้ ${RESERVED.join(" ")}`); };
  if (!/^https:\/\/[a-z0-9.-]+$/.test(cfg.site || "")) errs.push("site ต้องเป็นแบบ https://ชื่อ.pages.dev (ไม่มี / ท้าย)");
  if (!cfg.profile || !cfg.profile.name) errs.push("profile ต้องมี name");
  const ids = new Set();
  const id = (v, where) => { name(v, where); if (ids.has(v)) errs.push(`${where}: ชื่อในสถิติ "${v}" ซ้ำกับปุ่มอื่น`); ids.add(v); };
  (cfg.blocks || []).forEach((k, i) => {
    const where = `blocks[${i}]`;
    if (k.type === "heading") { if (!k.text) errs.push(`${where}: หัวข้อต้องมีข้อความ`); return; }
    if (k.type === "socials") {
      (k.items || []).forEach((s, j) => { const w = `${where}.items[${j}] ${s.title || ""}`; id(s.id, w); if (!s.title) errs.push(`${w}: ต้องมีชื่อ`); url(s.url, w); });
      return;
    }
    if (k.type !== "button") { errs.push(`${where}: ไม่รู้จักบล็อกแบบ "${k.type}"`); return; }
    const w = `${where} ${k.title || ""}`;
    id(k.id, w);
    if (!k.title) errs.push(`${w}: ปุ่มต้องมีชื่อ`);
    if (k.icon && k.icon !== "none" && !R.ICON[k.icon]) errs.push(`${w}: ไม่มี icon "${k.icon}"`);
    for (const d of ["from", "until"]) if (k[d] && !DATE_RE.test(k[d])) errs.push(`${w}: วันที่ ${d} ต้องเป็นแบบ 2026-12-01`);
    if (k.from && k.until && k.from > k.until) errs.push(`${w}: วันเริ่มอยู่หลังวันจบ`);
    url(k.url, w);
  });
  const names = new Set();
  for (const [list, label] of [[cfg.entry || [], "entry"], [cfg.short || [], "short"]]) list.forEach((s, i) => {
    const where = `${label}[${i}] /${s.name || ""}`;
    name(s.name, where);
    if (names.has(s.name)) errs.push(`${where}: ชื่อซ้ำกับลิงก์อื่น`);
    names.add(s.name);
    if (label === "short") url(s.url, where);
  });
  return { errs, warn };
}

function load(file = path.join(DIR, "links.json")) {
  const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
  const { errs, warn } = check(cfg);
  if (errs.length) throw new Error("links.json ผิด:\n- " + errs.join("\n- "));
  return { cfg, warn };
}

// ส่งสัญญาณนับ (string = text/plain ส่งข้ามโดเมนได้โดยไม่ต้อง preflight ไม่ต้องอ่านคำตอบ)
// เว็บทดสอบ (test.xxx.pages.dev) ส่งไปเว็บทดสอบของ bwy-widget ตัวเลขจริงไม่ปน
const BEACON = `var API=/^test\\./.test(location.hostname)?"${API_TEST}":"${API}";
var REF=(function(){try{var h=document.referrer?new URL(document.referrer).hostname:"";return h===location.hostname?"":h}catch(e){return""}})();
function send(ev,src){var b=JSON.stringify(src?{src:src,ref:REF,ev:ev}:{ref:REF,ev:ev});try{if(!(navigator.sendBeacon&&navigator.sendBeacon(API,b)))fetch(API,{method:"POST",body:b,keepalive:true,mode:"no-cors"}).catch(function(){})}catch(e){}}`;

const FONTS = [400, 600, 700].map(w => `@font-face{font-family:"Prompt";font-weight:${w};font-display:swap;src:url(/fonts/prompt-thai-${w}.woff2) format("woff2");unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"Prompt";font-weight:${w};font-display:swap;src:url(/fonts/prompt-latin-${w}.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}`).join("\n");

const CSS = `${FONTS}
:root{color-scheme:light;${R.LIGHT}}
@media (prefers-color-scheme:dark){:root{color-scheme:dark;${R.DARK}}}
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0}html{background:var(--paper);-webkit-text-size-adjust:100%}
html,body,a{touch-action:manipulation}
body{min-height:100vh;min-height:100dvh;color:var(--ink);line-height:1.5;-webkit-font-smoothing:antialiased;font-family:"Prompt",-apple-system,BlinkMacSystemFont,"Sukhumvit Set","Thonburi","Leelawadee UI","Segoe UI",sans-serif}
body::before{content:"";position:fixed;inset:-20vh 0;z-index:-1;pointer-events:none;background:radial-gradient(circle,var(--dot) 1.1px,transparent 1.6px) 0 0/13px 13px,var(--paper)}
main{max-width:480px;margin:0 auto;padding:calc(36px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(40px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
${R.PARTS}`;

function hub(cfg, src) {
  const p = cfg.profile, site = cfg.site;
  const desc = [p.bio, p.by].filter(Boolean).join(" · ").replace(/\s+/g, " ");
  return `<!DOCTYPE html>
<!-- ${src ? `${site.replace("https://", "")}/${src} = หน้ารวมลิงก์ที่ติดป้ายที่มา "${src}" ` : ""}สร้างจาก links/links.json ด้วย node tools/make-links.js (ห้ามแก้ไฟล์นี้เอง) -->
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.name)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#FEFEFE" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F0F11" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="${site}/">
<meta property="og:type" content="website">
<meta property="og:url" content="${site}/">
<meta property="og:title" content="${esc(p.name)}">
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
${R.renderMain(cfg, p.photo === false ? "" : "/jedi.webp")}
</main>
<script>
(${R.applySchedule.toString()})(document);
${BEACON}
var SRC=${src ? JSON.stringify(src) : `(new URLSearchParams(location.search).get("src")||"").slice(0,24)`};
send([["hub","home"]],SRC);
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
<title>${esc(cfg.profile.name)}</title>
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

// รายการสำหรับหน้า /stats ของ bwy-widget (ชื่อปุ่ม + ลิงก์ให้กด Copy)
function statsList(cfg) {
  const buttons = [];
  for (const k of cfg.blocks || []) {
    if (k.type === "button") buttons.push({ id: k.id, title: k.title });
    if (k.type === "socials") for (const s of k.items || []) buttons.push({ id: s.id, title: s.title });
  }
  const data = { site: cfg.site, buttons, entry: (cfg.entry || []).map(e => ({ name: e.name, title: e.title || e.name })), short: (cfg.short || []).map(s => ({ name: s.name, url: s.url })) };
  return `// สร้างจาก links/links.json ด้วย node tools/make-links.js (ห้ามแก้ไฟล์นี้เอง) ใช้ในหน้า /stats
export const LINKS = ${JSON.stringify(data, null, 2)};
`;
}

function build(file) {
  const { cfg, warn } = load(file);
  const out = { "links/index.html": hub(cfg), "lib/links.js": statsList(cfg) };
  for (const e of cfg.entry || []) out[`links/${e.name}.html`] = hub(cfg, e.name);
  for (const s of cfg.short || []) out[`links/${s.name}.html`] = shortPage(s, cfg);
  return { out, warn, cfg };
}

// ไฟล์ .html ใน links/ ที่ไม่ได้มาจาก links.json (ลิงก์ที่ลบไปแล้ว)
const stale = out => fs.readdirSync(DIR).filter(f => f.endsWith(".html") && !out["links/" + f]).map(f => "links/" + f);

module.exports = { build, load, check, stale, NAME_RE, RESERVED };

if (require.main === module) {
  const arg = process.argv.slice(2).find(a => !a.startsWith("--"));
  if (arg) {
    const cfg = JSON.parse(fs.readFileSync(arg, "utf8"));
    const { errs } = check(cfg);
    if (errs.length) { console.log("❌ ไฟล์ผิด:\n- " + errs.join("\n- ")); process.exit(1); }
    fs.writeFileSync(path.join(DIR, "links.json"), JSON.stringify(cfg, null, 2) + "\n");
    console.log("อัปเดต links/links.json");
  }
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
