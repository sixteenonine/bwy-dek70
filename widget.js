// 🐻 Dek70 Countdown by BearWithYou (@WeBearTogether) — ไฟล์หลักบนเว็บ
// แก้ไฟล์นี้แล้วอัปขึ้นเว็บ = widget ของทุกคนอัปเดตตาม
// ⚠️ เปลี่ยน version ทุกครั้งที่อัปเดต และลองบนเครื่องตัวเองก่อนเสมอ
// ธีม: ADMiSSIM Soft UI

module.exports.version = "1.1.0";

module.exports.build = function (FAMILY, PARAM) {
  const LINK = "https://x.com/WeBearTogether"; // แตะ widget แล้วเปิดลิงก์นี้
  const HANDLE = "@WeBearTogether";
  const START = new Date(2026, 4, 16); // จุดเริ่มวงแหวน (เปิดเทอม ม.6)

  // ---------- วันสอบ (อ้างอิงปฏิทิน TCAS70 จาก mytcas) ----------
  const EXAMS = [
    { key: "tgat", name: "TGAT", sub: "ส. 30 ม.ค. 70",
      date: new Date(2027, 0, 30, 13, 0), end: new Date(2027, 0, 30, 16, 0) },
    { key: "alevel", name: "A-LEVEL ENG", sub: "อา. 14 มี.ค. 70",
      date: new Date(2027, 2, 14, 11, 0), end: new Date(2027, 2, 14, 12, 30) },
  ];

  const MILESTONES = [
    { name: "สมัครสอบ TGAT/TPAT", label: "4–10 พ.ย. 69", start: new Date(2026, 10, 4), end: new Date(2026, 10, 10, 23, 59) },
    { name: "สมัครสอบ A-Level", label: "14–20 ม.ค. 70", start: new Date(2027, 0, 14), end: new Date(2027, 0, 20, 23, 59) },
    { name: "สอบ TGAT", label: "30 ม.ค. 70", start: new Date(2027, 0, 30, 13), end: new Date(2027, 0, 30, 16) },
    { name: "ประกาศผล TGAT", label: "28 ก.พ. 70", start: new Date(2027, 1, 28), end: new Date(2027, 1, 28, 23, 59) },
    { name: "สอบ A-Level Eng", label: "14 มี.ค. 70", start: new Date(2027, 2, 14, 11), end: new Date(2027, 2, 14, 12, 30) },
    { name: "ประกาศผล A-Level", label: "20 เม.ย. 70", start: new Date(2027, 3, 20), end: new Date(2027, 3, 20, 23, 59) },
    { name: "สมัครรอบ 3 Admission", label: "7–11 พ.ค. 70", start: new Date(2027, 4, 7), end: new Date(2027, 4, 11, 23, 59) },
  ];

  // ทิปเปลี่ยนวันละอัน (โชว์บนจอ LCD)
  const TIPS = [
    "ศัพท์วันละ 10 คำ × 100 วัน = 1,000 คำ",
    "Reading: อ่านคำถามก่อน แล้วค่อย scan หา keyword",
    "ทำ mock จับเวลาจริงอย่างน้อยสัปดาห์ละครั้ง",
    "ข้อที่ทำผิดคือขุมทอง จดลง error log ทุกครั้ง",
    "จำศัพท์เป็น collocation: make a decision ไม่ใช่ do",
    "Conversation: ดูบริบทและน้ำเสียงคนพูด ไม่ใช่แค่แกรมมาร์",
    "Paragraph organization: ใช้ pronoun กับคำเชื่อมเป็นตัวต่อ",
    "ตัวเลือกที่เด็ดขาดเกินไป เช่น always, never ระวังไว้ก่อน",
    "Text completion: อ่านประโยคหลังช่องว่างด้วย",
    "ทบทวนศัพท์เก่า 5 นาทีก่อนเริ่มศัพท์ใหม่",
    "นอนให้พอ สมองจัดเก็บสิ่งที่อ่านตอนหลับ",
    "ข้อไหนติดเกิน 1 นาที ข้ามไปก่อนแล้ววนกลับมา",
  ];

  // ---------- สี (ADMiSSIM) ----------
  const D = (light, dark) => Color.dynamic(new Color(light), new Color(dark));
  const BG = D("#eef2f6", "#1e2229");
  const CARD = D("#ffffff", "#23272f");
  const EDGE = D("#dce3ec", "#2a2f38");
  const TEXT = D("#475569", "#e2e8f0");
  const SUB = new Color("#94a3b8");
  const NUM = D("#64748b", "#cbd5e1");
  const RED = new Color("#ef4444");
  const BLUE = new Color("#3b82f6");
  const LCD_BG = D("#1b3f1c", "#0f2b10");
  const LCD_TEXT = new Color("#4cfc23");
  const TRACK = new Color("#94a3b8", 0.22);

  // ---------- เวลา ----------
  const now = new Date();
  const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const daysUntil = d => Math.round((startOfDay(d) - startOfDay(now)) / 86400000);
  const param = (PARAM || "").trim().toLowerCase();

  const activeExams = () => EXAMS.filter(e => e.end > now);
  function pickExam() {
    const p = EXAMS.find(e => e.key === param);
    return p || activeExams()[0] || EXAMS[EXAMS.length - 1];
  }
  function todayTip() {
    const doy = Math.floor((startOfDay(now) - new Date(now.getFullYear(), 0, 1)) / 86400000);
    return TIPS[doy % TIPS.length];
  }
  const progressOf = ex => (now - START) / (ex.date - START);

  // ---------- วงแหวน (สีเดียวกับ getTipColor ของ ADMiSSIM) ----------
  function mix(a, b, t) {
    const h = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16));
    const [x, y] = [h(a), h(b)];
    const c = x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0"));
    return new Color("#" + c.join(""));
  }
  function tipColor(p) {
    if (p <= 0.4) return BLUE;
    if (p <= 0.75) return mix("#3b82f6", "#f97316", (p - 0.4) / 0.35);
    return mix("#f97316", "#ef4444", (p - 0.75) / 0.25);
  }
  function ringImage(progress, size) {
    const s = size * 3, lw = s * 0.07, r = s / 2 - lw / 2 - 2, c = s / 2;
    const ctx = new DrawContext();
    ctx.size = new Size(s, s);
    ctx.opaque = false;
    ctx.respectScreenScale = false;
    ctx.setStrokeColor(TRACK);
    ctx.setLineWidth(lw);
    ctx.strokeEllipse(new Rect(c - r, c - r, 2 * r, 2 * r));
    const N = 180, k = Math.round(N * Math.max(0, Math.min(1, progress)));
    const pt = i => { const a = -Math.PI / 2 + (2 * Math.PI * i) / N; return new Point(c + r * Math.cos(a), c + r * Math.sin(a)); };
    for (let i = 0; i < k; i++) {
      const path = new Path();
      path.move(pt(i));
      path.addLine(pt(Math.min(i + 1.4, k)));
      ctx.addPath(path);
      ctx.setStrokeColor(tipColor(i / N));
      ctx.setLineWidth(lw);
      ctx.strokePath();
    }
    if (k > 0) {
      [[0, tipColor(0)], [k, tipColor(k / N)]].forEach(([i, col]) => {
        const p = pt(i);
        ctx.setFillColor(col);
        ctx.fillEllipse(new Rect(p.x - lw / 2, p.y - lw / 2, lw, lw));
      });
    }
    return ctx.getImage();
  }

  // ---------- ตัวช่วยวาด ----------
  function txt(stack, s, size, o = {}) {
    const t = stack.addText(s);
    t.font = o.thin ? Font.thinSystemFont(size)
      : o.light ? Font.lightSystemFont(size)
      : o.bold ? Font.boldSystemFont(size)
      : o.semi ? Font.semiboldSystemFont(size)
      : o.mono ? Font.mediumMonospacedSystemFont(size)
      : Font.systemFont(size);
    if (o.color !== null) t.textColor = o.color || TEXT;
    t.lineLimit = o.lines || 1;
    t.minimumScaleFactor = o.scale || 0.7;
    return t;
  }

  function hRow(parent, center) {
    const r = parent.addStack();
    r.layoutHorizontally();
    r.centerAlignContent();
    if (center) r.addSpacer();
    return r;
  }

  function baseWidget(p) {
    const w = new ListWidget();
    w.backgroundColor = BG;
    w.setPadding(p, p, p, p);
    return w;
  }

  function card(parent, pad) {
    const c = parent.addStack();
    c.layoutVertically();
    c.backgroundColor = CARD;
    c.borderColor = EDGE;
    c.borderWidth = 1;
    c.cornerRadius = 22;
    c.setPadding(pad, pad + 2, pad, pad + 2);
    return c;
  }

  function header(w, size) {
    const r = hRow(w);
    txt(r, "DEK70 COUNTDOWN", size, { semi: true, color: SUB });
    r.addSpacer();
    txt(r, HANDLE, size - 1, { color: SUB });
  }

  // วงแหวน + ตัวเลขบางๆ ตรงกลาง
  function ring(parent, ex, size) {
    const box = parent.addStack();
    box.size = new Size(size, size);
    box.backgroundImage = ringImage(progressOf(ex), size);
    box.layoutVertically();
    box.centerAlignContent();
    box.addSpacer();
    const d = daysUntil(ex.date);
    const done = now > ex.end;
    const main = done ? "✓" : d <= 0 ? "วันนี้" : String(d);
    const r1 = hRow(box, true);
    txt(r1, main, d <= 0 || done ? size * 0.2 : size * 0.33, { thin: !(d <= 0 || done), semi: d <= 0 || done, color: !done && d <= 14 ? RED : NUM, scale: 0.5 });
    r1.addSpacer();
    if (!done && d > 0) {
      const r2 = hRow(box, true);
      txt(r2, "วัน", size * 0.1, { color: SUB });
      r2.addSpacer();
    }
    box.addSpacer();
    return box;
  }

  function examColumn(parent, ex, size) {
    const col = parent.addStack();
    col.layoutVertically();
    const t = hRow(col, true);
    txt(t, ex.name, Math.max(10, size * 0.1), { semi: true, color: SUB });
    t.addSpacer();
    col.addSpacer(6);
    const m = hRow(col, true);
    ring(m, ex, size);
    m.addSpacer();
    col.addSpacer(6);
    const b = hRow(col, true);
    txt(b, ex.sub, Math.max(10, size * 0.095), { color: SUB });
    b.addSpacer();
    return col;
  }

  function lcd(parent, size) {
    const s = parent.addStack();
    s.layoutHorizontally();
    s.centerAlignContent();
    s.backgroundColor = LCD_BG;
    s.cornerRadius = 14;
    s.setPadding(9, 12, 9, 12);
    txt(s, `> ${todayTip()}`, size, { mono: true, color: LCD_TEXT, lines: 2 });
    s.addSpacer();
  }

  function milestoneCard(parent, max, size) {
    const c = card(parent, 12);
    const list = MILESTONES.filter(m => m.end >= now).slice(0, max);
    list.forEach((m, i) => {
      if (i) c.addSpacer(8);
      const open = now >= m.start && now <= m.end;
      const d = daysUntil(m.start);
      const r = hRow(c);
      const dot = r.addStack();
      dot.size = new Size(7, 7);
      dot.cornerRadius = 3.5;
      dot.backgroundColor = open ? BLUE : d <= 7 ? RED : TRACK;
      r.addSpacer(10);
      const col = r.addStack();
      col.layoutVertically();
      txt(col, m.name, size, { color: TEXT });
      txt(col, m.label, size - 3, { color: SUB });
      r.addSpacer();
      txt(r, open ? "เปิดแล้ว" : d === 0 ? "วันนี้" : `${d} วัน`, size + 1,
        { light: !open && d > 7, semi: open || d <= 7, color: open ? BLUE : d <= 7 ? RED : NUM });
    });
    return c;
  }

  function examPair(parent, size, gap) {
    const row = hRow(parent);
    row.addSpacer();
    EXAMS.forEach((ex, i) => {
      if (i) row.addSpacer(gap);
      examColumn(row, ex, size);
    });
    row.addSpacer();
    return row;
  }

  // ---------- Layout แต่ละขนาด ----------
  function buildSmall() {
    const w = baseWidget(12);
    examColumn(w, pickExam(), 100);
    return w;
  }

  function buildMedium() {
    const w = baseWidget(12);
    examPair(w, 92, 36);
    return w;
  }

  function buildLarge() {
    const w = baseWidget(16);
    header(w, 11);
    w.addSpacer(10);
    examPair(w, 104, 28);
    w.addSpacer(12);
    milestoneCard(w, 3, 13);
    w.addSpacer();
    lcd(w, 11);
    return w;
  }

  function buildXL() {
    const w = baseWidget(22);
    header(w, 12);
    w.addSpacer(14);
    const cols = hRow(w);

    const left = cols.addStack();
    left.layoutVertically();
    examPair(left, 140, 30);
    left.addSpacer();
    lcd(left, 12);

    cols.addSpacer(22);

    const right = cols.addStack();
    right.layoutVertically();
    milestoneCard(right, 7, 13);
    right.addSpacer();
    return w;
  }

  function buildInline() {
    const w = new ListWidget();
    const parts = activeExams().map(e => `${e.name} ${Math.max(daysUntil(e.date), 0)} วัน`);
    w.addText(parts.length ? parts.join(" | ") : "Dek70 สอบครบแล้ว!");
    return w;
  }

  function buildRect() {
    const w = new ListWidget();
    txt(w, "DEK70 COUNTDOWN", 11, { semi: true, color: null });
    const list = activeExams();
    if (!list.length) { txt(w, "สอบครบแล้ว เก่งมาก!", 13, { bold: true, color: null }); return w; }
    list.forEach(e => {
      const r = w.addStack();
      r.layoutHorizontally();
      txt(r, e.name, 13, { color: null });
      r.addSpacer();
      txt(r, `${Math.max(daysUntil(e.date), 0)} วัน`, 13, { semi: true, color: null });
    });
    return w;
  }

  function buildCircle() {
    const w = new ListWidget();
    w.addAccessoryWidgetBackground = true;
    const ex = pickExam();
    const a = w.addText(ex.key === "tgat" ? "TGAT" : "A-LV");
    a.font = Font.semiboldSystemFont(9);
    a.centerAlignText();
    const b = w.addText(String(Math.max(daysUntil(ex.date), 0)));
    b.font = Font.lightSystemFont(20);
    b.minimumScaleFactor = 0.6;
    b.centerAlignText();
    const c = w.addText("วัน");
    c.font = Font.systemFont(9);
    c.centerAlignText();
    return w;
  }

  // ---------- สร้าง widget ----------
  const builders = {
    small: buildSmall, medium: buildMedium, large: buildLarge, extraLarge: buildXL,
    accessoryInline: buildInline, accessoryRectangular: buildRect, accessoryCircular: buildCircle,
  };
  const w = (builders[FAMILY] || buildLarge)();
  w.url = LINK;
  const midnight = startOfDay(now);
  midnight.setDate(midnight.getDate() + 1);
  const soon = new Date(now.getTime() + 60 * 60000);
  w.refreshAfterDate = soon < midnight ? soon : midnight; // เช็กอัปเดตทุก ~1 ชม.
  return w;
};
