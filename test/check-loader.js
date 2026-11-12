// ทดสอบ loader.js: เน็ตปกติ / เน็ตล่ม / ไฟล์บนเว็บพัง ต้องไม่ทำให้ widget ของน้องหาย
// ใช้: node test/check-loader.js
"use strict";
process.env.TZ = "Asia/Bangkok";
const fs = require("fs"), path = require("path");
const mock = require("./mock-scriptable.js");
const S = mock.state;
mock.install();
const root = path.join(__dirname, "..");
const widget = fs.readFileSync(path.join(root, "widget.js"), "utf8");
const csv = fs.readFileSync(path.join(root, "events.csv"), "utf8");
const EVENTS_URL = widget.match(/EVENTS_URL\s*=\s*"([^"]+)"/)[1];
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
let failed = 0;

async function run(file, label, { net, inWidget = true, expect }) {
  const loader = fs.readFileSync(path.join(root, file), "utf8");
  const SOURCE = loader.match(/SOURCE\s*=\s*"([^"]+)"/)[1];
  S.net = { [EVENTS_URL]: { status: 200, body: csv } };
  if (net !== "fail") S.net[SOURCE] = net;
  S.texts = []; S.presented = null; S.alertPick = 0;
  let set = null;
  const Script = { setWidget: w => { set = w; }, complete() {} };
  const config = { runsInWidget: inWidget, widgetFamily: "small" };
  const importModule = p => mock.loadModule(S.files.get(p));
  await new AsyncFunction("config", "args", "Script", "importModule", loader)(config, { widgetParameter: "" }, Script, importModule);
  const fellBack = S.texts.some(t => t.includes("ต่อเน็ต"));
  const got = fellBack ? "fallback" : (inWidget ? (set && set.refreshAfterDate ? "widget" : "none") : (S.presented ? "widget" : "none"));
  const ok = got === expect;
  if (!ok) failed++;
  console.log(`${ok ? "✅" : "❌"} ${file}: ${label} → ${got}${ok ? "" : " (ควรเป็น " + expect + ")"}`);
}

(async () => {
  const good = { status: 200, body: widget };
  const broken = { status: 200, body: widget.replace("module.exports.build = async function", "module.exports.build = async function BROKEN(") };
  const throws = { status: 200, body: widget.replace("const list = await loadEvents();", "throw new Error('พัง');") };
  for (const file of ["loader.js", "loader-test.js"]) {
    if (!fs.existsSync(path.join(root, file))) continue;
    S.files.clear();
    await run(file, "ติดตั้งใหม่ + เน็ตล่ม", { net: "fail", expect: "fallback" });
    await run(file, "ติดตั้งใหม่ + ไฟล์บนเว็บพัง (syntax)", { net: broken, expect: "fallback" });
    await run(file, "เน็ตปกติ", { net: good, expect: "widget" });
    await run(file, "เน็ตล่ม (มีของเก่าในเครื่อง)", { net: "fail", expect: "widget" });
    await run(file, "ไฟล์บนเว็บพัง (syntax) → ใช้ตัวเก่า", { net: broken, expect: "widget" });
    await run(file, "ไฟล์บนเว็บ error ตอนรัน → ใช้ตัวเก่า", { net: throws, expect: "widget" });
    await run(file, "เว็บตอบ 404", { net: { status: 404, body: "not found" }, expect: "widget" });
    await run(file, "เว็บตอบหน้า HTML แทนโค้ด", { net: { status: 200, body: "<html>login</html>" }, expect: "widget" });
    await run(file, "กลับมาปกติ", { net: good, expect: "widget" });
    await run(file, "เปิดในแอป Scriptable", { net: good, inWidget: false, expect: "widget" });
  }
  // โค้ดในปุ่ม "ก๊อปโค้ด" ของ index.html ต้องเป็นตัวเดียวกับ loader.js
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const m = html.match(/<script type="text\/plain" id="loader">([\s\S]*?)<\/script>/);
  const same = m && m[1].replace(/\r\n/g, "\n").trim() ===fs.readFileSync(path.join(root, "loader.js"), "utf8").replace(/\r\n/g, "\n").trim();
  if (!same) failed++;
  console.log(`${same ? "✅" : "❌"} index.html: โค้ดในปุ่มก๊อป ${same ? "ตรงกับ" : "ไม่ตรงกับ"} loader.js`);
  if (failed) { console.log(`\n❌ ไม่ผ่าน ${failed} กรณี`); process.exit(1); }
  console.log("\n✅ loader ผ่านทั้งหมด");
})();
