// สร้างหน้ารวมลิงก์ bearwithyou.pages.dev จาก links/links.json ไฟล์เดียว แล้วรัน: node tools/make-links.js
//   links/index.html           หน้ารวมลิงก์
//   links/<entry>.html         หน้ารวมลิงก์แบบติดป้ายที่มา เช่น /tt /ig (หน้าเดียวกันทุกอย่าง แค่บอกสถิติว่ามาจากไหน)
//   links/<short>.html         ลิงก์ย่อ เช่น /mock พาไปปลายทางทันที
//   lib/links.js               รายการสำหรับหน้า /stats ของ bwy-widget
//   links/robots.txt + sitemap.xml  ให้ Google หาหน้ารวมลิงก์เจอ
// เช็กว่าไฟล์ตรงกับ links.json (ใช้ในเทสต์): node tools/make-links.js --check
// ใช้ไฟล์จาก Links Studio: node tools/make-links.js ไฟล์.json (ตรวจแล้วแทน links/links.json รูปที่ฝังมาแยกเป็นไฟล์ links/img/)
// ส่งค่าปัจจุบันกลับไปให้ Links Studio: node tools/make-links.js --studio ไฟล์.json (รูปฝังกลับเป็น data:)
// ทุกหน้าเป็นไฟล์ static ไม่ใช้ Functions: ต่อให้โควตาเต็ม ลิงก์ก็ยังพาไปปลายทางได้
// นับยอดด้วยระบบสถิติเดิมของ bwy-widget (/api/e): hub = เปิดหน้า (home) / กดปุ่ม (id), link = เปิดลิงก์ย่อ
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const linksRender = require("./links-render.js");
const R = linksRender();
const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "links");
const API = "https://bwy-widget.pages.dev/api/e", API_TEST = "https://test.bwy-widget.pages.dev/api/e";
const esc = R.esc, check = R.check; // กฎตรวจอยู่ใน links-render.js (ใช้ร่วมกับ Links Studio)

function load(file = path.join(DIR, "links.json")) {
  const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
  const { errs, warn } = check(cfg);
  for (const b of buttonsOf(cfg)) if (b.image && !b.image.startsWith("img/")) errs.push(`ปุ่ม ${b.title}: รูปใน links.json ต้องเป็นไฟล์ img/... (รันแบบ node tools/make-links.js ไฟล์.json เพื่อแยกรูปเป็นไฟล์)`);
  else if (b.image && !fs.existsSync(path.join(DIR, b.image))) errs.push(`ปุ่ม ${b.title}: ไม่มีไฟล์รูป links/${b.image}`);
  if (errs.length) throw new Error("links.json ผิด:\n- " + errs.join("\n- "));
  return { cfg, warn };
}

// ส่งสัญญาณนับ (string = text/plain ส่งข้ามโดเมนได้โดยไม่ต้อง preflight ไม่ต้องอ่านคำตอบ)
// เว็บทดสอบ (test.xxx.pages.dev) ส่งไปเว็บทดสอบของ bwy-widget ตัวเลขจริงไม่ปน
// once(): นับเครื่องละไม่เกิน 1 ครั้งต่อวัน (เวลาไทย) ต่อเรื่อง เครื่องจำเองว่าวันนี้นับอะไรไปแล้ว (ไม่ส่งออกไปไหน ไม่มีรหัสเครื่อง ไม่มี cookie) จำไม่ได้ = นับ
const BEACON = `var API=/^test\\./.test(location.hostname)?"${API_TEST}":"${API}";
var REF=(function(){try{var h=document.referrer?new URL(document.referrer).hostname:"";return h===location.hostname?"":h}catch(e){return""}})();
var DAY=new Date(Date.now()+7*3600e3).toISOString().slice(0,10);
function once(k){try{var s=JSON.parse(localStorage.getItem("bwy-once")||"null");if(!s||s.d!==DAY||!s.k)s={d:DAY,k:[]};if(s.k.indexOf(k)>=0)return false;s.k.push(k);localStorage.setItem("bwy-once",JSON.stringify(s))}catch(e){}return true}
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
<meta property="og:image" content="${site}/og.jpg">
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
// นับว่าเปิดจริงเมื่อเห็นหน้าเกิน 1.5 วินาที หรือแตะ/เลื่อนจอ (หน้าที่แอปโหลดไว้ล่วงหน้าแบบซ่อน และเบราว์เซอร์อัตโนมัติ ไม่นับ)
var BOT=!!navigator.webdriver,SEEN=false,T=null;
function opened(){if(SEEN||BOT)return[];SEEN=true;return once("home")?[["hub","home"]]:[]}
function openNow(){var ev=opened();if(ev.length)send(ev,SRC)}
function arm(){if(document.visibilityState==="visible"&&!T)T=setTimeout(openNow,1500)}
arm();document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")arm();else{clearTimeout(T);T=null}});
["pointerdown","touchstart","scroll","keydown"].forEach(function(n){addEventListener(n,openNow,{once:true,passive:true})});
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[data-id]");if(!a||BOT)return;var id=a.getAttribute("data-id"),ev=opened();if(once("b:"+id))ev.push(["hub",id]);if(ev.length)send(ev,SRC)});
// ลิงก์ไปหน้า Widget: บอกต่อว่ามาจาก bio ของแอปไหน (?src=bio → bio-tt) จะขึ้นในการ์ด "ป้ายลิงก์" ของสถิติ Widget
if(SRC)[].forEach.call(document.querySelectorAll('a[href^="https://bwy-widget.pages.dev/"]'),function(a){try{var u=new URL(a.href);u.searchParams.set("src",((u.searchParams.get("src")||"bio")+"-"+SRC).slice(0,24));a.href=u.href}catch(e){}});
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
if(!navigator.webdriver&&document.visibilityState!=="hidden"&&once(${JSON.stringify("l:" + s.name)}))send([["link",${JSON.stringify(s.name)}]]);
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
  // ให้ Google หาหน้ารวมลิงก์เจอ (ลิงก์ย่อเป็น noindex, /tt /ig ชี้ canonical มาที่หน้าแรก)
  out["links/robots.txt"] = `User-agent: *\nAllow: /\nSitemap: ${cfg.site}/sitemap.xml\n`;
  out["links/sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${cfg.site}/</loc></url></urlset>\n`;
  for (const e of cfg.entry || []) out[`links/${e.name}.html`] = hub(cfg, e.name);
  for (const s of cfg.short || []) out[`links/${s.name}.html`] = shortPage(s, cfg);
  return { out, warn, cfg };
}

const buttonsOf = cfg => (cfg.blocks || []).filter(k => k.type === "button");

// ไฟล์ใน links/ ที่ไม่ได้มาจาก links.json (ลิงก์ที่ลบไปแล้ว รูปที่ไม่ได้ใช้แล้ว)
function stale(out, cfg) {
  const used = new Set(buttonsOf(cfg || load().cfg).map(b => b.image).filter(Boolean));
  const imgDir = path.join(DIR, "img");
  const imgs = fs.existsSync(imgDir) ? fs.readdirSync(imgDir).map(f => "img/" + f).filter(f => !used.has(f)) : [];
  return [...fs.readdirSync(DIR).filter(f => f.endsWith(".html") && !out["links/" + f]), ...imgs].map(f => "links/" + f);
}

// รูปที่ฝังมาจาก Links Studio (data:) → ไฟล์ links/img/<id>-<hash>.<ext> (ชื่อเปลี่ยนตามเนื้อรูป เบราว์เซอร์จะไม่จำรูปเก่า)
const EXT = { webp: "webp", jpeg: "jpg", png: "png" };
function splitImages(cfg) {
  for (const b of buttonsOf(cfg)) {
    const m = /^data:image\/(webp|jpeg|png);base64,(.+)$/.exec(b.image || "");
    if (!m) continue;
    const buf = Buffer.from(m[2], "base64");
    const name = `img/${b.id}-${crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8)}.${EXT[m[1]]}`;
    fs.mkdirSync(path.join(DIR, "img"), { recursive: true });
    fs.writeFileSync(path.join(DIR, name), buf);
    b.image = name;
  }
  return cfg;
}
function inlineImages(cfg) {
  for (const b of buttonsOf(cfg)) if (b.image && b.image.startsWith("img/")) {
    const ext = path.extname(b.image).slice(1), type = ext === "jpg" ? "jpeg" : ext;
    b.image = `data:image/${type};base64,` + fs.readFileSync(path.join(DIR, b.image)).toString("base64");
  }
  return cfg;
}

module.exports = { build, load, check, stale, splitImages, inlineImages };

if (require.main === module) {
  const arg = process.argv.slice(2).find(a => !a.startsWith("--"));
  if (process.argv.includes("--studio")) { // ค่าปัจจุบัน (รูปฝังเป็น data:) ในรูปแบบที่ Links Studio เก็บ
    const cfg = inlineImages(load().cfg);
    fs.writeFileSync(arg, JSON.stringify({ config: cfg, savedAt: new Date().toISOString() }));
    console.log("เขียน " + arg);
    process.exit(0);
  }
  if (arg) {
    let cfg = JSON.parse(fs.readFileSync(arg, "utf8"));
    if (cfg.config) cfg = cfg.config; // ไฟล์ที่ได้จาก Links Studio ตรงๆ
    const { errs } = check(cfg);
    if (errs.length) { console.log("❌ ไฟล์ผิด:\n- " + errs.join("\n- ")); process.exit(1); }
    fs.writeFileSync(path.join(DIR, "links.json"), JSON.stringify(splitImages(cfg), null, 2) + "\n");
    console.log("อัปเดต links/links.json");
  }
  const { out, warn, cfg } = build();
  if (process.argv.includes("--check")) {
    const bad = Object.keys(out).filter(f => !fs.existsSync(path.join(ROOT, f)) || fs.readFileSync(path.join(ROOT, f), "utf8") !== out[f]);
    const extra = stale(out, cfg);
    if (bad.length || extra.length) { console.log(`❌ ไฟล์ไม่ตรงกับ links/links.json: ${[...bad, ...extra].join(", ")} (รัน node tools/make-links.js)`); process.exit(1); }
    console.log("✅ links/ ตรงกับ links.json");
  } else {
    for (const f of stale(out, cfg)) { fs.unlinkSync(path.join(ROOT, f)); console.log("ลบ " + f); }
    for (const [f, s] of Object.entries(out)) fs.writeFileSync(path.join(ROOT, f), s);
    console.log(`เขียน ${Object.keys(out).length} ไฟล์`);
  }
  warn.forEach(w => console.log("⚠️  " + w));
}
