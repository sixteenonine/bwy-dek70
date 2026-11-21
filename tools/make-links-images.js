// สร้างรูปของหน้ารวมลิงก์: links/og.png (ภาพตัวอย่างตอนแปะลิงก์ใน LINE / X / Facebook 1200x630) + links/icon.png (icon แท็บ / Home 180x180)
// รันเมื่อเปลี่ยนชื่อ คำแนะนำตัว หรือรูป: node tools/make-links-images.js (ต้องมี Playwright + Chromium)
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "..", "links");
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, "links.json"), "utf8")).profile;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const b64 = f => fs.readFileSync(path.join(DIR, f)).toString("base64");
const font = (w, s) => `@font-face{font-family:P;font-weight:${w};src:url(data:font/woff2;base64,${b64(`fonts/prompt-${s}-${w}.woff2`)})}`;
const FONTS = [400, 700].flatMap(w => [font(w, "thai"), font(w, "latin")]).join("");
const JEDI = `data:image/webp;base64,${b64("jedi.webp")}`;
const BG = "background:radial-gradient(circle,#E4E4E6 1.1px,transparent 1.6px) 0 0/13px 13px,#FEFEFE";
const og = `<style>${FONTS}*{margin:0}body{width:1200px;height:630px;${BG};font-family:P;color:#0B0B0C;display:flex;align-items:center;gap:64px;padding:0 96px;box-sizing:border-box}
img{width:300px;filter:drop-shadow(0 18px 30px rgba(0,0,0,.16))}h1{font-size:96px;line-height:1.05;font-weight:700;letter-spacing:-1px}
.by{font-size:36px;color:#6B6B70;margin-top:10px}.bio{font-size:34px;line-height:1.4;margin-top:26px;max-width:640px}
.pill{display:inline-block;margin-top:22px;padding:6px 24px 8px;border-radius:999px;background:#fff;border:2px solid #ECECEC;font-size:28px}</style>
<img src="${JEDI}"><div><h1>${esc(cfg.name)}</h1><p class="by">${esc(cfg.by || "")}</p><p class="bio">${esc(cfg.bio)}</p>${cfg.school ? `<p class="pill">${esc(cfg.school)}</p>` : ""}</div>`;
const icon = `<style>*{margin:0}body{width:180px;height:180px;background:#FEFEFE;display:grid;place-items:center}img{width:150px}</style><img src="${JEDI}">`;
(async () => {
  const b = await chromium.launch();
  for (const [file, html, w, h] of [["og.png", og, 1200, 630], ["icon.png", icon, 180, 180]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(html); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(DIR, file) }); console.log("เขียน links/" + file);
  }
  await b.close();
})();
