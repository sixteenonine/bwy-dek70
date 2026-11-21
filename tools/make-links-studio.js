// สร้างหน้า Links Studio (artifact สำหรับแก้หน้ารวมลิงก์) จาก tools/links-studio.html
// ใส่ตัววาดหน้า (links-render.js) รูปพี่เจได และค่าใน links.json (ใช้เป็นค่าตั้งต้นเฉพาะตอนเปิดแบบที่เก็บข้อมูลใช้ไม่ได้)
// ใช้: node tools/make-links-studio.js <ไฟล์ที่จะเขียน>
"use strict";
const fs = require("fs"), path = require("path");
const linksRender = require("./links-render.js");
const out = process.argv[2];
if (!out) { console.log("ใช้: node tools/make-links-studio.js <ไฟล์ที่จะเขียน>"); process.exit(1); }
const dir = path.join(__dirname, "..");
const tpl = fs.readFileSync(path.join(__dirname, "links-studio.html"), "utf8");
const photo = "data:image/webp;base64," + fs.readFileSync(path.join(dir, "links/jedi.webp")).toString("base64");
const cfg = JSON.parse(fs.readFileSync(path.join(dir, "links/links.json"), "utf8"));
const html = tpl
  .replace("/*@RENDER@*/", () => `const linksRender = ${linksRender.toString()};`)
  .replace('"@PHOTO@"', () => JSON.stringify(photo))
  .replace("/*@FALLBACK@*/null", () => JSON.stringify(cfg).replace(/</g, "\\u003c"));
for (const k of ["@RENDER@", "@PHOTO@", "@FALLBACK@"]) if (html.includes(k)) throw new Error("ยังมี " + k + " ในไฟล์");
fs.writeFileSync(out, html);
console.log(`เขียน ${out} (${Math.round(html.length / 1024)} KB)`);
