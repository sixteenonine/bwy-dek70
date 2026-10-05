// 🐻 Dek70 Countdown by BearWithYou (@WeBearTogether) — ไฟล์หลักบนเว็บ
// แก้ไฟล์นี้แล้วอัปขึ้นเว็บ = widget ของทุกคนอัปเดตตาม
// ⚠️ เปลี่ยน version ทุกครั้งที่อัปเดต และลองบนเครื่องตัวเองก่อนเสมอ
// ธีม: Clean White

module.exports.version = "3.1.0";

module.exports.build = function (FAMILY, PARAM) {
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

  // ---------- สี ----------
  const WHITE = new Color("#FFFFFF");
  const INK = new Color("#000000");
  const PANEL = new Color("#F2F2F2");
  const LINE = new Color("#DADADA");
  const TRACK = new Color("#EFEFEF");
  const RED = new Color("#E5484D");

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

  // ---------- ตัวช่วยวาด ----------
  function txt(stack, s, size, o = {}) {
    const t = stack.addText(s);
    t.font = o.bold ? Font.boldSystemFont(size)
      : o.semi ? Font.semiboldSystemFont(size)
      : o.medium ? Font.mediumSystemFont(size)
      : Font.systemFont(size);
    if (o.color !== null) t.textColor = o.color || INK;
    t.lineLimit = 1;
    t.minimumScaleFactor = o.scale || 0.6;
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
    w.backgroundColor = WHITE;
    w.setPadding(p, p, p, p);
    return w;
  }
  function barImage(p, W, H, fill, track) {
    const s = 3, w = W * s, h = H * s;
    const ctx = new DrawContext();
    ctx.size = new Size(w, h);
    ctx.opaque = false;
    ctx.respectScreenScale = false;
    const t = new Path();
    t.addRoundedRect(new Rect(0, 0, w, h), h / 2, h / 2);
    ctx.addPath(t);
    ctx.setFillColor(track);
    ctx.fillPath();
    if (p > 0) {
      const f = new Path();
      f.addRoundedRect(new Rect(0, 0, Math.max(h, w * p), h), h / 2, h / 2);
      ctx.addPath(f);
      ctx.setFillColor(fill);
      ctx.fillPath();
    }
    return ctx.getImage();
  }

  // ---------- บล็อกตัวเลขใหญ่ (ตาม mock) ----------
  // k = ขนาดตัวหนังสือทั่วไป, num = ขนาดตัวเลขใหญ่
  function hero(parent, ex, k, num) {
    const c = col(parent);
    const d = daysUntil(ex.date);
    const done = now > ex.end;
    const unit = 22 * k;
    const r1 = row(c);
    txt(r1, ex.short, 18 * k);
    r1.addSpacer();

    const r2 = row(c);
    r2.bottomAlignContent();
    if (done || d <= 0) {
      txt(r2, done ? "จบแล้ว" : "วันนี้!", num * 0.5, { semi: true, color: done ? INK : RED });
    } else {
      txt(r2, String(d), num, { color: d <= 14 ? RED : INK, scale: 0.4 });
      r2.addSpacer(5);
      const u = col(r2);
      u.setPadding(0, 0, Math.round((num - unit) * 0.13), 0); // ยก "วัน" ให้ตรงฐานตัวเลข
      txt(u, "วัน", unit);
    }
    r2.addSpacer();
    c.addSpacer();

    const r3 = row(c);
    r3.bottomAlignContent();
    txt(r3, ex.sub, 11 * k);
    r3.addSpacer();
    if (!done && d > 0) txt(r3, "สอบ", unit);
    return c;
  }

  // ---------- รายการไทม์ไลน์ (กล่องเทา) ----------
  function panel(parent) {
    const p = col(parent);
    p.backgroundColor = PANEL;
    p.cornerRadius = 14;
    p.setPadding(8, 12, 8, 12);
    return p;
  }
  function item(p, m, k) {
    const r = row(p);
    const c = col(r);
    txt(c, m.name, 12 * k, { bold: true });
    txt(c, m.label, 11 * k);
    r.addSpacer(); // ดันตัวเลขไปชิดขวา
    const n = row(r);
    n.bottomAlignContent();
    if (isOpen(m)) {
      txt(n, "เปิดแล้ว", 15 * k, { bold: true, color: RED });
    } else {
      const d = daysUntil(m.start);
      txt(n, d === 0 ? "วันนี้" : String(d), 20 * k, { bold: true, color: d <= 7 ? RED : INK, scale: 0.8 });
      if (d !== 0) {
        n.addSpacer(3);
        const u = col(n);
        u.setPadding(0, 0, 2, 0);
        txt(u, "วัน", 12 * k, { bold: true });
      }
    }
  }
  function divider(p) {
    p.addSpacer(6);
    const l = row(p);
    l.backgroundColor = LINE;
    l.size = new Size(0, 1);
    l.addSpacer();
    p.addSpacer(6);
  }
  // กล่องแรก 1 รายการ กล่องที่สองรวมที่เหลือ
  function timeline(parent, count, k) {
    const list = upcoming().slice(0, count);
    if (!list.length) return;
    item(panel(parent), list[0], k);
    if (list.length > 1) {
      parent.addSpacer(6);
      const p2 = panel(parent);
      list.slice(1).forEach((m, i) => {
        if (i) divider(p2);
        item(p2, m, k);
      });
    }
  }

  // ---------- Layout แต่ละขนาด ----------
  function buildSmall() {
    const w = baseWidget(16);
    hero(w, pickExam(), 0.92, 80);
    return w;
  }

  function buildMedium() {
    const w = baseWidget(12);
    const r = row(w);
    const left = col(r);
    left.setPadding(4, 4, 2, 0);
    hero(left, pickExam(), 0.85, 76);
    r.addSpacer(12);
    const right = col(r);
    right.size = new Size(185, 0);
    timeline(right, 3, 0.95);
    return w;
  }

  function buildLarge() {
    const w = baseWidget(18);
    hero(w, pickExam(), 1, 100);
    w.addSpacer(14);
    timeline(w, 3, 1);
    return w;
  }

  function buildXL() {
    const w = baseWidget(24);
    const r = row(w);
    const exams = activeExams().length ? activeExams() : EXAMS;
    exams.forEach((ex, i) => {
      if (i) r.addSpacer(20);
      hero(r, ex, 1.1, 130);
    });
    r.addSpacer(24);
    const right = col(r);
    right.size = new Size(280, 0);
    timeline(right, 6, 1);
    right.addSpacer();
    return w;
  }

  // ---------- progress bar + นับวินาที ----------
  function bar(parent, ex, W, H, fill, track) {
    const img = parent.addImage(barImage(progressOf(ex), W, H, fill, track));
    img.resizable = true;
    return img;
  }
  // วัน:ชม:นาที:วินาที (ส่วนชั่วโมง-วินาทีเดินเองแบบเรียลไทม์)
  function timerRow(parent, ex, size, lock) {
    const r = row(parent);
    const color = lock ? null : (daysUntil(ex.date) <= 14 ? RED : INK);
    if (now > ex.end) {
      txt(r, "สอบเสร็จแล้ว ✓", size * 0.5, { color });
    } else {
      const left = ex.date - now;
      const days = Math.max(0, Math.floor(left / DAY));
      const target = new Date(ex.date.getTime() - days * DAY);
      if (days > 0) txt(r, `${days}:`, size, { color, scale: 0.5 });
      const t = r.addDate(target);
      t.applyTimerStyle();
      t.font = Font.systemFont(size);
      if (color) t.textColor = color;
      t.lineLimit = 1;
      t.minimumScaleFactor = 0.5;
    }
    r.addSpacer();
    return r;
  }

  // Small แบบ bar (ตาม mock ล่างซ้าย)
  function buildSmallBar() {
    const w = baseWidget(16);
    const ex = pickExam();
    const d = daysUntil(ex.date);
    const done = now > ex.end;
    const r1 = row(w);
    txt(r1, ex.short, 16);
    r1.addSpacer();
    const r2 = row(w);
    r2.bottomAlignContent();
    if (done || d <= 0) {
      txt(r2, done ? "จบแล้ว" : "วันนี้!", 30, { semi: true, color: done ? INK : RED });
    } else {
      txt(r2, String(d), 54, { color: d <= 14 ? RED : INK, scale: 0.5 });
      r2.addSpacer(6);
      const u = col(r2);
      u.setPadding(0, 0, 6, 0);
      txt(u, "วัน", 18);
    }
    r2.addSpacer();
    if (!done && d > 0) {
      const r3 = row(w);
      txt(r3, "สอบ", 18);
      r3.addSpacer();
    }
    w.addSpacer();
    bar(w, ex, 130, 9, d <= 14 ? RED : INK, TRACK);
    return w;
  }

  // Medium แบบ bar + นับวินาที (ตาม mock ล่างขวา)
  function buildMediumBar() {
    const w = baseWidget(18);
    const ex = pickExam();
    const r1 = row(w);
    txt(r1, ex.short, 16, { bold: true });
    r1.addSpacer();
    txt(r1, ex.month, 15);
    w.addSpacer();
    timerRow(w, ex, 56, false);
    w.addSpacer();
    bar(w, ex, 310, 10, daysUntil(ex.date) <= 14 ? RED : INK, TRACK);
    return w;
  }

  // Lock Screen: แถบยาว + วินาทีเดินจริง
  function buildRect() {
    const w = new ListWidget();
    const ex = pickExam();
    const top = row(w);
    txt(top, ex.short, 12, { bold: true, color: null });
    top.addSpacer();
    txt(top, ex.month, 11, { color: null });
    timerRow(w, ex, 26, true);
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
