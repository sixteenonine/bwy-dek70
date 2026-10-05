// 🐻 Dek70 Countdown by BearWithYou (@WeBearTogether)
// ติดตั้งครั้งเดียว อัปเดตอัตโนมัติ ไม่ต้องแก้อะไรในนี้
const SOURCE = "https://bwy-dek70.pages.dev/widget.js";

const fm = FileManager.local();
const dir = fm.joinPath(fm.documentsDirectory(), "bwy-dek70");
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

// ถ้าเวอร์ชันใหม่ error จะถอยกลับไปใช้เวอร์ชันที่เคยใช้ได้
function build(family) {
  const param = args.widgetParameter || "";
  for (const p of [LATEST, GOOD]) {
    try {
      const w = importModule(p).build(family, param);
      if (p === LATEST) fm.writeString(GOOD, fm.readString(LATEST));
      return w;
    } catch (e) {}
  }
  const w = new ListWidget();
  w.addText("🐻 ต่อเน็ตแล้วเปิดใหม่อีกครั้งนะ");
  return w;
}

if (config.runsInWidget) {
  Script.setWidget(build(config.widgetFamily));
} else {
  const sizes = [["Small", "small"], ["Medium", "medium"], ["Large", "large"]];
  if (Device.isPad()) sizes.push(["Extra Large", "extraLarge"]);
  const a = new Alert();
  a.title = "🐻 Dek70 Countdown";
  a.message = "ติดตั้งสำเร็จ! เลือกขนาดเพื่อดูตัวอย่าง";
  sizes.forEach(s => a.addAction(s[0]));
  a.addCancelAction("ปิด");
  const i = await a.presentSheet();
  if (i !== -1) {
    const fam = sizes[i][1];
    const w = build(fam);
    if (fam === "small") await w.presentSmall();
    else if (fam === "medium") await w.presentMedium();
    else if (fam === "extraLarge") await w.presentExtraLarge();
    else await w.presentLarge();
  }
}
Script.complete();
