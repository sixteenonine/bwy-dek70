// 🐻 Dek70 Countdown by BearWithYou (@WeBearTogether) — ไฟล์หลักบนเว็บ
// แก้ไฟล์นี้แล้วอัปขึ้นเว็บ = widget ของทุกคนอัปเดตตาม
// ⚠️ เปลี่ยน version ทุกครั้งที่อัปเดต และลองบนเครื่องตัวเองก่อนเสมอ
// ปรับหน้าตาได้ที่ Widget Studio แล้ววางก้อน DESIGN ทับด้านล่าง

module.exports.version = "3.2.0";

// ==== DESIGN START ====
const DESIGN = {
  bg: "#FFFFFF", bgDepth: 0,
  ink: "#000000", red: "#E5484D",
  panel: "#F2F2F2", panelDepth: 0, panelRadius: 14, panelPadX: 12, panelPadY: 8,
  line: "#DADADA", track: "#EFEFEF",
  padSmall: 16, padMedium: 12, padLarge: 18, padXL: 24,
  labelSize: 18, labelWeight: 400,
  numSmall: 80, numMedium: 76, numLarge: 100, numXL: 130, numSmallBar: 54, numWeight: 400,
  unitSize: 22, unitWeight: 400, unitLift: 13,
  dateSize: 11, dateWeight: 400,
  itemNameSize: 12, itemNameWeight: 700, itemDateSize: 11, itemNumSize: 20, itemNumWeight: 700, itemGap: 6,
  timelineMedium: 185, timelineXL: 280,
  timerSize: 56, timerWeight: 400, barHeight: 9,
  urgentDays: 14,
};
// ==== DESIGN END ====

module.exports.build = function (FAMILY, PARAM) {
  const D = DESIGN;
  const LINK = "https://x.com/WeBearTogether"; // แตะ widget แล้วเปิดลิงก์นี้
  const START = new Date(2026, 4, 16); // จุดเริ่มแถบ progress (เปิดเทอม ม.6)

  // ---------- วันสอบ (อ้างอิงปฏิทิน TCAS70 จาก mytcas) ----------
  const EXAMS = [
    { key: "tgat", short: "TGAT", sub: "ส. 30 ม.ค. 70", month: "30 มกรา",
      date: new Date(2027, 0, 30, 13, 0), end: new Date(2027, 0, 30, 16, 0) },
    { key: "alevel", short: "A-Level", sub: "อา. 14 มี.ค. 70", month: "14 มีนา",
      date: new Date(2027, 2, 14, 11, 0), end: new Date(2027, 2, 14, 12, 30) },
  ];

  const MILESTONES = [
    { name: "สมัคร TGAT/TPAT", label: "4–10 พ.ย. 69", start: new Date(2026, 10, 4), end: new Date(2026, 10, 10, 23, 59) },
    { name: "สมัคร A-Level", label: "14–20 ม.ค. 70", start: new Date(2027, 0, 14), end: new Date(2027, 0, 20, 23, 59) },
    { name: "สอบ TGAT", label: "30 ม.ค. 70", start: new Date(2027, 0, 30, 13), end: new Date(2027, 0, 30, 16) },
    { name: "ประกาศผล TGAT", label: "28 ก.พ. 70", start: new Date(2027, 1, 28), end: new Date(2027, 1, 28, 23, 59) },
    { name: "สอบ A-Level", label: "14 มี.ค. 70", start: new Date(2027, 2, 14, 11), end: new Date(2027, 2, 14, 12, 30) },
    { name: "ประกาศผล A-Level", label: "20 เม.ย. 70", start: new Date(2027, 3, 20), end: new Date(2027, 3, 20, 23, 59) },
    { name: "สมัครรอบ 3", label: "7–11 พ.ค. 70", start: new Date(2027, 4, 7), end: new Date(2027, 4, 11, 23, 59) },
  ];

  // ---------- เวลา ----------
  const now = new Date();
  const DAY = 86400000;
  const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const daysUntil = d => Math.round((startOfDay(d) - startOfDay(now)) / DAY);
  // Parameter: ใส่ชื่อสอบ (tgat / alevel) และ/หรือ bar เช่น "alevel bar"
  const tokens = (PARAM || "").toLowerCase().split(/[\s,]+/).filter(Boolean);
  const param = tokens.find(t => EXAMS.some(e => e.key === t)) || "";
  const BAR = tokens.includes("bar");

  const activeExams = () => EXAMS.filter(e => e.end > now);
  const pickExam = () => EXAMS.find(e => e.key === param) || activeExams()[0] || EXAMS[EXAMS.length - 1];
  const upcoming = () => MILESTONES.filter(m => m.end >= now);
  const progressOf = ex => Math.max(0, Math.min(1, (now - START) / (ex.date - START)));
  const isOpen = m => now >= m.start && now <= m.end;
  const urgent = ex => daysUntil(ex.date) <= D.urgentDays;

  // ---------- สี ----------
  const C = h => new Color(h);
  const INK = C(D.ink), RED = C(D.red), WHITE = C("#FFFFFF");
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c =>
      Math.round(pct >= 0 ? c + (255 - c) * pct / 100 : c * (1 + pct / 100)));
    return "#" + ch.map(c => c.toString(16).padStart(2, "0")).join("");
  }
  function fill(target, hex, depth) {
    if (depth > 0) {
      const g = new LinearGradient();
      g.colors = [C(shade(hex, depth)), C(shade(hex, -depth))];
      g.locations = [0, 1];
      target.backgroundGradient = g;
    } else {
      target.backgroundColor = C(hex);
    }
  }

  // ---------- ตัวช่วยวาด ----------
  const WEIGHTS = { 100: "ultraLight", 200: "thin", 300: "light", 400: "regular", 500: "medium", 600: "semibold", 700: "bold", 800: "heavy", 900: "black" };
  const font = (size, w) => Font[(WEIGHTS[Math.round(w / 100) * 100] || "regular") + "SystemFont"](size);
  function txt(stack, s, size, weight, color, scale) {
    const t = stack.addText(s);
    t.font = font(size, weight);
    if (color !== null) t.textColor = color || INK;
    t.lineLimit = 1;
    t.minimumScaleFactor = scale || 0.6;
    return t;
  }
  function row(parent) {
    const r = parent.addStack();
    r.layoutHorizontally();
    r.centerAlignContent();
    return r;
  }
  function col(parent) {
    const c = parent.addStack();
    c.layoutVertically();
    return c;
  }
  function baseWidget(p) {
    const w = new ListWidget();
    fill(w, D.bg, D.bgDepth);
    w.setPadding(p, p, p, p);
    return w;
  }
  function barImage(p, W, H, fillC, trackC) {
    const s = 3, w = W * s, h = H * s;
    const ctx = new DrawContext();
    ctx.size = new Size(w, h);
    ctx.opaque = false;
    ctx.respectScreenScale = false;
    const t = new Path();
    t.addRoundedRect(new Rect(0, 0, w, h), h / 2, h / 2);
    ctx.addPath(t);
    ctx.setFillColor(trackC);
    ctx.fillPath();
    if (p > 0) {
      const f = new Path();
      f.addRoundedRect(new Rect(0, 0, Math.max(h, w * p), h), h / 2, h / 2);
      ctx.addPath(f);
      ctx.setFillColor(fillC);
      ctx.fillPath();
    }
    return ctx.getImage();
  }
  function bar(parent, ex, W) {
    const img = parent.addImage(barImage(progressOf(ex), W, D.barHeight, urgent(ex) ? RED : INK, C(D.track)));
    img.resizable = true;
    return img;
  }
  function unitText(parent, label, num, size, weight) {
    const u = col(parent);
    u.setPadding(0, 0, Math.max(0, Math.round((num - size) * D.unitLift / 100)), 0);
    txt(u, label, size, weight);
  }

  // ---------- บล็อกตัวเลขใหญ่ ----------
  function hero(parent, ex, k, num) {
    const c = col(parent);
    const d = daysUntil(ex.date);
    const done = now > ex.end;
    const unit = D.unitSize * k;
    const r1 = row(c);
    txt(r1, ex.short, D.labelSize * k, D.labelWeight);
    r1.addSpacer();

    const r2 = row(c);
    r2.bottomAlignContent();
    if (done || d <= 0) {
      txt(r2, done ? "จบแล้ว" : "วันนี้!", num * 0.5, 600, done ? INK : RED);
    } else {
      txt(r2, String(d), num, D.numWeight, urgent(ex) ? RED : INK, 0.4);
      r2.addSpacer(5);
      unitText(r2, "วัน", num, unit, D.unitWeight);
    }
    r2.addSpacer();
    c.addSpacer();

    const r3 = row(c);
    r3.bottomAlignContent();
    txt(r3, ex.sub, D.dateSize * k, D.dateWeight);
    r3.addSpacer();
    if (!done && d > 0) txt(r3, "สอบ", unit, D.unitWeight);
    return c;
  }

  // ---------- ไทม์ไลน์ ----------
  function panel(parent) {
    const p = col(parent);
    fill(p, D.panel, D.panelDepth);
    p.cornerRadius = D.panelRadius;
    p.setPadding(D.panelPadY, D.panelPadX, D.panelPadY, D.panelPadX);
    return p;
  }
  function item(p, m, k) {
    const r = row(p);
    const c = col(r);
    txt(c, m.name, D.itemNameSize * k, D.itemNameWeight);
    txt(c, m.label, D.itemDateSize * k, 400);
    r.addSpacer();
    const n = row(r);
    n.bottomAlignContent();
    if (isOpen(m)) {
      txt(n, "เปิดแล้ว", D.itemNumSize * 0.75 * k, D.itemNumWeight, RED);
    } else {
      const d = daysUntil(m.start);
      const size = D.itemNumSize * k;
      txt(n, d === 0 ? "วันนี้" : String(d), size, D.itemNumWeight, d <= 7 ? RED : INK, 0.8);
      if (d !== 0) {
        n.addSpacer(3);
        unitText(n, "วัน", size, D.itemNameSize * k, D.itemNumWeight);
      }
    }
  }
  function divider(p) {
    p.addSpacer(D.itemGap);
    const l = row(p);
    l.backgroundColor = C(D.line);
    l.size = new Size(0, 1);
    l.addSpacer();
    p.addSpacer(D.itemGap);
  }
  function timeline(parent, count, k) {
    const list = upcoming().slice(0, count);
    if (!list.length) return;
    item(panel(parent), list[0], k);
    if (list.length > 1) {
      parent.addSpacer(D.itemGap);
      const p2 = panel(parent);
      list.slice(1).forEach((m, i) => {
        if (i) divider(p2);
        item(p2, m, k);
      });
    }
  }

  // ---------- นับวินาที ----------
  function timerRow(parent, ex, size, weight, lock) {
    const r = row(parent);
    const color = lock ? null : (urgent(ex) ? RED : INK);
    if (now > ex.end) {
      txt(r, "สอบเสร็จแล้ว ✓", size * 0.5, weight, color);
    } else {
      const left = ex.date - now;
      const days = Math.max(0, Math.floor(left / DAY));
      const target = new Date(ex.date.getTime() - days * DAY);
      if (days > 0) txt(r, `${days}:`, size, weight, color, 0.5);
      const t = r.addDate(target);
      t.applyTimerStyle();
      t.font = font(size, weight);
      if (color) t.textColor = color;
      t.lineLimit = 1;
      t.minimumScaleFactor = 0.5;
    }
    r.addSpacer();
    return r;
  }

  // ---------- Layout ----------
  function buildSmall() {
    const w = baseWidget(D.padSmall);
    hero(w, pickExam(), 0.92, D.numSmall);
    return w;
  }

  function buildSmallBar() {
    const w = baseWidget(D.padSmall);
    const ex = pickExam();
    const d = daysUntil(ex.date);
    const done = now > ex.end;
    const k = 0.82;
    const r1 = row(w);
    txt(r1, ex.short, D.labelSize * 0.9, D.labelWeight);
    r1.addSpacer();
    const r2 = row(w);
    r2.bottomAlignContent();
    if (done || d <= 0) {
      txt(r2, done ? "จบแล้ว" : "วันนี้!", D.numSmallBar * 0.55, 600, done ? INK : RED);
    } else {
      txt(r2, String(d), D.numSmallBar, D.numWeight, urgent(ex) ? RED : INK, 0.5);
      r2.addSpacer(6);
      unitText(r2, "วัน", D.numSmallBar, D.unitSize * k, D.unitWeight);
    }
    r2.addSpacer();
    if (!done && d > 0) {
      const r3 = row(w);
      txt(r3, "สอบ", D.unitSize * k, D.unitWeight);
      r3.addSpacer();
    }
    w.addSpacer();
    bar(w, ex, 130);
    return w;
  }

  function buildMedium() {
    const w = baseWidget(D.padMedium);
    const r = row(w);
    const left = col(r);
    left.setPadding(4, 4, 2, 0);
    hero(left, pickExam(), 0.85, D.numMedium);
    r.addSpacer(12);
    const right = col(r);
    right.size = new Size(D.timelineMedium, 0);
    timeline(right, 3, 0.95);
    return w;
  }

  function buildMediumBar() {
    const w = baseWidget(D.padMedium + 6);
    const ex = pickExam();
    const r1 = row(w);
    txt(r1, ex.short, D.labelSize * 0.9, 700);
    r1.addSpacer();
    txt(r1, ex.month, D.labelSize * 0.85, D.labelWeight);
    w.addSpacer();
    timerRow(w, ex, D.timerSize, D.timerWeight, false);
    w.addSpacer();
    bar(w, ex, 310);
    return w;
  }

  function buildLarge() {
    const w = baseWidget(D.padLarge);
    hero(w, pickExam(), 1, D.numLarge);
    w.addSpacer(14);
    timeline(w, 3, 1);
    return w;
  }

  function buildXL() {
    const w = baseWidget(D.padXL);
    const r = row(w);
    const exams = activeExams().length ? activeExams() : EXAMS;
    exams.forEach((ex, i) => {
      if (i) r.addSpacer(20);
      hero(r, ex, 1.1, D.numXL);
    });
    r.addSpacer(24);
    const right = col(r);
    right.size = new Size(D.timelineXL, 0);
    timeline(right, 6, 1);
    right.addSpacer();
    return w;
  }

  // Lock Screen: แถบยาว + วินาทีเดินจริง
  function buildRect() {
    const w = new ListWidget();
    const ex = pickExam();
    const top = row(w);
    txt(top, ex.short, 12, 700, null);
    top.addSpacer();
    txt(top, ex.month, 11, 400, null);
    timerRow(w, ex, 26, 400, true);
    w.addSpacer(3);
    const b = w.addImage(barImage(progressOf(ex), 150, 6, WHITE, new Color("#FFFFFF", 0.3)));
    b.imageSize = new Size(150, 6);
    return w;
  }

  // Lock Screen: วงกลม
  function buildCircle() {
    const w = new ListWidget();
    w.addAccessoryWidgetBackground = true;
    const ex = pickExam();
    const a = w.addText(ex.short);
    a.font = Font.systemFont(9);
    a.centerAlignText();
    const b = w.addText(now > ex.end ? "✓" : String(Math.max(daysUntil(ex.date), 0)));
    b.font = Font.mediumSystemFont(20);
    b.minimumScaleFactor = 0.6;
    b.centerAlignText();
    const c = w.addText("วัน");
    c.font = Font.systemFont(9);
    c.centerAlignText();
    w.addSpacer(2);
    const img = w.addImage(barImage(progressOf(ex), 36, 4, WHITE, new Color("#FFFFFF", 0.3)));
    img.imageSize = new Size(36, 4);
    img.centerAlignImage();
    return w;
  }

  function buildInline() {
    const w = new ListWidget();
    const parts = activeExams().map(e => `${e.short} ${Math.max(daysUntil(e.date), 0)} วัน`);
    w.addText(parts.length ? parts.join("  |  ") : "Dek70 สอบครบแล้ว!");
    return w;
  }

  // ---------- สร้าง widget ----------
  const builders = {
    small: BAR ? buildSmallBar : buildSmall, medium: BAR ? buildMediumBar : buildMedium,
    large: buildLarge, extraLarge: buildXL,
    accessoryInline: buildInline, accessoryRectangular: buildRect, accessoryCircular: buildCircle,
  };
  const w = (builders[FAMILY] || buildLarge)();
  w.url = LINK;

  // รีเฟรชทุก ~1 ชม. / เที่ยงคืน / ตอนวินาทีวิ่งครบวัน (แบบไหนถึงก่อน)
  const times = [new Date(now.getTime() + 60 * 60000)];
  const midnight = startOfDay(now);
  midnight.setDate(midnight.getDate() + 1);
  times.push(midnight);
  EXAMS.forEach(ex => {
    const left = ex.date - now;
    if (left > 0) times.push(new Date(ex.date.getTime() - Math.floor(left / DAY) * DAY));
  });
  w.refreshAfterDate = times.filter(t => t > now).sort((a, b) => a - b)[0];
  return w;
};

// ---------- เมนูตอนรันในแอป Scriptable ----------
module.exports.runInApp = async function () {
  const opts = [
    ["Small", "small", ""],
    ["Small แบบ progress bar", "small", "bar"],
    ["Medium", "medium", ""],
    ["Medium แบบนับวินาที", "medium", "bar"],
    ["Large", "large", ""],
  ];
  if (Device.isPad()) opts.push(["Extra Large", "extraLarge", ""]);
  const a = new Alert();
  a.title = "🐻 Dek70 Countdown";
  a.message = "เลือกแบบเพื่อดูตัวอย่าง\n\nอยากได้แบบ progress bar: กดค้างที่ widget > Edit Widget > ช่อง Parameter พิมพ์ bar\nอยากนับ A-Level: พิมพ์ alevel (ใช้คู่กันได้ เช่น alevel bar)";
  opts.forEach(o => a.addAction(o[0]));
  a.addCancelAction("ปิด");
  const i = await a.presentSheet();
  if (i === -1) return;
  const [, fam, prm] = opts[i];
  const w = module.exports.build(fam, prm);
  if (fam === "small") await w.presentSmall();
  else if (fam === "medium") await w.presentMedium();
  else if (fam === "extraLarge") await w.presentExtraLarge();
  else await w.presentLarge();
};
