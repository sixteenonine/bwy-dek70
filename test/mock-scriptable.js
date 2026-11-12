// ตัวจำลอง Scriptable API สำหรับรัน widget.js / loader.js ใน Node (ใช้ทดสอบเท่านั้น ไม่ได้ถูกโหลดบนมือถือ)
"use strict";
const RealDate = Date;

const state = {
  now: RealDate.now(),      // เวลาจำลอง
  screen: [393, 852, 3],    // กว้าง, สูง, scale
  pad: false,
  files: new Map(),         // ไฟล์ในเครื่องจำลอง
  net: {},                  // url (ไม่รวม ?t=) -> { status, body } | "fail"
  texts: [],                // ข้อความทุกชิ้นที่ถูกวาด/ใส่ใน widget
  requests: [],
};

class FakeDate extends RealDate {
  constructor(...a) { if (a.length === 0) super(state.now); else super(...a); }
  static now() { return state.now; }
}

const FONT_W = ["ultraLight", "thin", "light", "regular", "medium", "semibold", "bold", "heavy", "black"];
class Font {
  constructor(name, size) {
    if (typeof name !== "string" || !name) throw new Error("Font: ชื่อฟอนต์ผิด");
    if (!isFinite(size) || size <= 0) throw new Error("Font: ขนาดผิด " + size);
    this.name = name; this.size = size;
  }
}
const fontFn = n => { Font[n] = size => new Font(n, size); };
["systemFont", "italicSystemFont", "largeTitle", "title1", "title2", "title3", "headline", "subheadline", "body", "callout", "footnote", "caption1", "caption2"].forEach(fontFn);
FONT_W.forEach(w => [w + "SystemFont", w + "MonospacedSystemFont", w + "RoundedSystemFont"].forEach(fontFn));

class Color {
  constructor(hex, alpha) {
    if (!/^#?[0-9a-fA-F]{6}$/.test(String(hex))) throw new Error("Color: สีผิดรูปแบบ " + hex);
    if (alpha !== undefined && !(alpha >= 0 && alpha <= 1)) throw new Error("Color: alpha ผิด " + alpha);
    this.hex = hex; this.alpha = alpha === undefined ? 1 : alpha;
  }
}
const num = (...v) => { v.forEach(x => { if (!isFinite(x)) throw new Error("ตัวเลขผิด (NaN/Infinity) ในคำสั่งวาด"); }); };
class Size { constructor(w, h) { num(w, h); this.width = w; this.height = h; } }
class Point { constructor(x, y) { num(x, y); this.x = x; this.y = y; } }
class Rect { constructor(x, y, w, h) { num(x, y, w, h); this.x = x; this.y = y; this.width = w; this.height = h; } }
class Path {
  move(p) { if (!(p instanceof Point)) throw new Error("Path.move"); }
  addLine(p) { if (!(p instanceof Point)) throw new Error("Path.addLine"); }
  addRect(r) { if (!(r instanceof Rect)) throw new Error("Path.addRect"); }
  addEllipse(r) { if (!(r instanceof Rect)) throw new Error("Path.addEllipse"); }
  addRoundedRect(r, a, b) { if (!(r instanceof Rect)) throw new Error("Path.addRoundedRect"); num(a, b); }
  closeSubpath() {}
}
class Image { constructor(w, h) { this.size = new Size(w, h); } }
class DrawContext {
  constructor() { this.size = new Size(200, 200); this.opaque = true; this.respectScreenScale = false; }
  setFillColor(c) { if (!(c instanceof Color)) throw new Error("setFillColor"); }
  setStrokeColor(c) { if (!(c instanceof Color)) throw new Error("setStrokeColor"); }
  setTextColor(c) { if (!(c instanceof Color)) throw new Error("setTextColor"); }
  setFont(f) { if (!(f instanceof Font)) throw new Error("setFont"); }
  setLineWidth(w) { num(w); }
  setTextAlignedLeft() {} setTextAlignedRight() {} setTextAlignedCenter() {}
  addPath(p) { if (!(p instanceof Path)) throw new Error("addPath"); }
  fillPath() {} strokePath() {}
  fillRect(r) { if (!(r instanceof Rect)) throw new Error("fillRect"); }
  fillEllipse(r) { if (!(r instanceof Rect)) throw new Error("fillEllipse"); }
  strokeRect(r) { if (!(r instanceof Rect)) throw new Error("strokeRect"); }
  drawTextInRect(s, r) { if (!(r instanceof Rect)) throw new Error("drawTextInRect"); state.texts.push(String(s)); }
  drawText(s, p) { state.texts.push(String(s)); }
  getImage() { return new Image(this.size.width, this.size.height); }
}
class LinearGradient {}

class WText {
  constructor(s) { this.text = String(s); state.texts.push(this.text); }
  centerAlignText() {} leftAlignText() {} rightAlignText() {}
}
class WDate {
  constructor(d) { if (!(d instanceof RealDate) || isNaN(d.getTime())) throw new Error("addDate: วันที่ผิด"); this.date = d; }
  applyTimerStyle() {} applyRelativeStyle() {} applyDateStyle() {} applyTimeStyle() {} applyOffsetStyle() {}
  centerAlignText() {} leftAlignText() {} rightAlignText() {}
}
class WImage { constructor(i) { if (!(i instanceof Image)) throw new Error("addImage"); } centerAlignImage() {} leftAlignImage() {} rightAlignImage() {} applyFittingContentMode() {} applyFillingContentMode() {} }
class WStack {
  addText(s) { return new WText(s); }
  addDate(d) { return new WDate(d); }
  addImage(i) { return new WImage(i); }
  addStack() { return new WStack(); }
  addSpacer(n) { if (n !== undefined) num(n); return {}; }
  setPadding(a, b, c, d) { num(a, b, c, d); }
  layoutVertically() {} layoutHorizontally() {}
  centerAlignContent() {} topAlignContent() {} bottomAlignContent() {}
}
class ListWidget extends WStack {
  async presentSmall() { state.presented = "small"; } async presentMedium() { state.presented = "medium"; }
  async presentLarge() { state.presented = "large"; } async presentExtraLarge() { state.presented = "extraLarge"; }
  async presentAccessoryCircular() {} async presentAccessoryInline() {} async presentAccessoryRectangular() {}
}

const fmApi = {
  documentsDirectory: () => "/docs",
  joinPath: (a, b) => a + "/" + b,
  fileExists: p => state.files.has(p),
  createDirectory: p => { state.files.set(p, null); },
  writeString: (p, s) => { if (typeof s !== "string") throw new Error("writeString"); state.files.set(p, s); },
  readString: p => { if (!state.files.has(p)) throw new Error("ไม่มีไฟล์ " + p); return state.files.get(p); },
  remove: p => { state.files.delete(p); },
};
const FileManager = { local: () => fmApi, iCloud: () => fmApi };

class Request {
  constructor(url) { this.url = url; this.timeoutInterval = 60; this.response = null; }
  async loadString() {
    const key = this.url.split("?")[0];
    state.requests.push(key);
    const r = state.net[key];
    if (!r || r === "fail") throw new Error("เน็ตล่ม (จำลอง)");
    this.response = { statusCode: r.status };
    return r.body;
  }
}
class Alert {
  constructor() { this.actions = []; }
  addAction(t) { this.actions.push(t); } addCancelAction() {} addDestructiveAction(t) { this.actions.push(t); }
  async presentSheet() { return state.alertPick === undefined ? -1 : state.alertPick; }
  async presentAlert() { return state.alertPick === undefined ? -1 : state.alertPick; }
}
const Device = {
  screenSize: () => new Size(state.screen[0], state.screen[1]),
  screenScale: () => state.screen[2],
  isPad: () => state.pad, isPhone: () => !state.pad,
};

function install() {
  Object.assign(globalThis, { Date: FakeDate, Font, Color, Size, Point, Rect, Path, DrawContext, LinearGradient, ListWidget, FileManager, Request, Alert, Device });
}
// โหลดไฟล์ .js แบบ module ของ Scriptable จากข้อความ
function loadModule(src) {
  const module = { exports: {} };
  new Function("module", "exports", src)(module, module.exports);
  return module.exports;
}
module.exports = { state, install, loadModule, RealDate };
