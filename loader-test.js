// 🐻 Countdown Widget by BearWithYou (@WeBearTogether)
// ตัวทดสอบของเจได: โหลดจาก branch test (ห้ามแจกไฟล์นี้)
const SOURCE = "https://test.bwy-widget.pages.dev/widget.js";
const INFO = { loader: 3 };

const fm = FileManager.local();
const dir = fm.joinPath(fm.documentsDirectory(), "bwy-widget-test");
if (!fm.fileExists(dir)) fm.createDirectory(dir);
const LATEST = fm.joinPath(dir, "latest.js");
const GOOD = fm.joinPath(dir, "good.js");

// โหลดเวอร์ชันล่าสุด ถ้าไม่มีเน็ตจะใช้ตัวที่เก็บไว้ในเครื่อง
try {
  const req = new Request(SOURCE + "?t=" + Date.now());
  req.timeoutInterval = 8;
  const code = await req.loadString();
  if (req.response.statusCode === 200 && code.indexOf("module.exports") !== -1) {
    fm.writeString(LATEST, code);
  }
} catch (e) {}

// ลองเวอร์ชันล่าสุดก่อน ถ้า error ถอยไปใช้เวอร์ชันที่เคยใช้ได้
async function attempt(fn) {
  for (const p of [LATEST, GOOD]) {
    try {
      if (!fm.fileExists(p)) continue;
      const result = await fn(importModule(p));
      if (p === LATEST) fm.writeString(GOOD, fm.readString(LATEST));
      return result;
    } catch (e) {}
  }
  return null;
}

function fallback() {
  const w = new ListWidget();
  w.addText("🐻 ต่อเน็ตแล้วเปิดใหม่อีกครั้งนะ");
  return w;
}

if (config.runsInWidget) {
  const w = await attempt(m => m.build(config.widgetFamily, args.widgetParameter || "", INFO));
  Script.setWidget(w || fallback());
} else {
  const ok = await attempt(async m => { await m.runInApp(INFO); return true; });
  if (!ok) await fallback().presentSmall();
}
Script.complete();
