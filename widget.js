// 🐻 Dek70 Countdown by BearWithYou (@WeBearTogether) — ไฟล์หลักบนเว็บ
// แก้ไฟล์นี้แล้วอัปขึ้นเว็บ = widget ของทุกคนอัปเดตตาม
// ⚠️ เปลี่ยน VERSION ทุกครั้งที่อัปเดต และลองบนเครื่องตัวเองก่อนเสมอ

module.exports.version = "1.0.3";

module.exports.build = function (FAMILY, PARAM) {
  const LINK = "https://x.com/WeBearTogether"; // แตะ widget แล้วเปิดลิงก์นี้
  const HANDLE = "@WeBearTogether";

  // ---------- วันสอบ (อ้างอิงปฏิทิน TCAS70 จาก mytcas) ----------
  const EXAMS = [
    { key: "tgat", emoji: "🧠", name: "TGAT", sub: "ส. 30 ม.ค. 70  13:00",
      date: new Date(2027, 0, 30, 13, 0), end: new Date(2027, 0, 30, 16, 0) },
    { key: "alevel", emoji: "📚", name: "A-Level Eng", sub: "อา. 14 มี.ค. 70  11:00",
      date: new Date(2027, 2, 14, 11, 0), end: new Date(2027, 2, 14, 12, 30) },
  ];

  const MILESTONES = [
    { emoji: "✍️", name: "สมัครสอบ TGAT/TPAT", label: "4–10 พ.ย. 69", start: new Date(2026, 10, 4), end: new Date(2026, 10, 10, 23, 59) },
    { emoji: "✍️", name: "สมัครสอบ A-Level", label: "14–20 ม.ค. 70", start: new Date(2027, 0, 14), end: new Date(2027, 0, 20, 23, 59) },
    { emoji: "🧠", name: "สอบ TGAT", label: "30 ม.ค. 70", start: new Date(2027, 0, 30, 13), end: new Date(2027, 0, 30, 16) },
    { emoji: "📊", name: "ประกาศผล TGAT", label: "28 ก.พ. 70", start: new Date(2027, 1, 28), end: new Date(2027, 1, 28, 23, 59) },
    { emoji: "📚", name: "สอบ A-Level Eng", label: "14 มี.ค. 70", start: new Date(2027, 2, 14, 11), end: new Date(2027, 2, 14, 12, 30) },
    { emoji: "📊", name: "ประกาศผล A-Level", label: "20 เม.ย. 70", start: new Date(2027, 3, 20), end: new Date(2027, 3, 20, 23, 59) },
    { emoji: "🎯", name: "สมัครรอบ 3 Admission", label: "7–11 พ.ค. 70", start: new Date(2027, 4, 7), end: new Date(2027, 4, 11, 23, 59) },
  ];

  // ทิปเปลี่ยนวันละอัน
  const TIPS = [
    "ทดสอบอัปเดตGG 🐻",
  ];

  // ---------- สี (ธีมหมีน้ำผึ้ง) ----------
  const BG = Color.dynamic(new Color("#FFD54A"), new Color("#1E140D"));
  const CARD = Color.dynamic(new Color("#FFE88F"), new Color("#2F2117"));
  const TEXT = Color.dynamic(new Color("#2B1A0E"), new Color("#FFF1CC"));
  const SUB = Color.dynamic(new Color("#6B4B2A"), new Color("#C9A77A"));
  const ACCENT = Color.dynamic(new Color("#2B1A0E"), new Color("#FFC93C"));
  const RED = Color.dynamic(new Color("#C62828"), new Color("#FF6B6B"));

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

  // ---------- ตัวช่วยวาด ----------
  function txt(stack, s, size, o = {}) {
    const t = stack.addText(s);
    t.font = o.round ? Font.boldRoundedSystemFont(size)
      : o.bold ? Font.boldSystemFont(size)
      : o.semi ? Font.semiboldSystemFont(size) : Font.systemFont(size);
    if (o.color !== null) t.textColor = o.color || TEXT;
    t.lineLimit = o.lines || 1;
    t.minimumScaleFactor = o.scale || 0.7;
    return t;
  }

  function fullRow(parent, fn) {
    const row = parent.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();
    fn(row);
    row.addSpacer();
    return row;
  }

  function baseWidget(p) {
    const w = new ListWidget();
    w.backgroundColor = BG;
    w.setPadding(p, p, p, p);
    return w;
  }

  function header(w, size) {
    const r = w.addStack();
    r.layoutHorizontally();
    r.centerAlignContent();
    txt(r, "🐻 Dek70 Countdown", size, { bold: true });
    r.addSpacer();
    txt(r, HANDLE, size - 4, { semi: true, color: SUB });
  }

  // ตัวเลขใหญ่ + "วัน"
  function bigDays(parent, ex, size) {
    const d = daysUntil(ex.date);
    if (now > ex.end) {
      fullRow(parent, r => txt(r, "สอบเสร็จแล้ว ✓", size * 0.4, { bold: true }));
      return;
    }
    if (d <= 0) {
      fullRow(parent, r => txt(r, "วันนี้! สู้ๆ 💪", size * 0.4, { bold: true, color: RED }));
      if (now < ex.date) {
        fullRow(parent, r => {
          txt(r, "เริ่มใน ", size * 0.22, { color: SUB });
          const t = r.addDate(ex.date);
          t.applyTimerStyle();
          t.font = Font.boldMonospacedSystemFont(size * 0.3);
          t.textColor = RED;
        });
      }
      return;
    }
    fullRow(parent, r => {
      r.bottomAlignContent();
      txt(r, String(d), size, { round: true, color: d <= 14 ? RED : ACCENT, scale: 0.5 });
      r.addSpacer(4);
      txt(r, "วัน", size * 0.32, { bold: true, color: SUB });
    });
  }

  function examCard(parent, ex, size, showWeeks) {
    const card = parent.addStack();
    card.layoutVertically();
    card.backgroundColor = CARD;
    card.cornerRadius = 18;
    card.setPadding(10, 12, 10, 12);
    fullRow(card, r => txt(r, `${ex.emoji} ${ex.name}`, size * 0.3, { bold: true, color: SUB }));
    bigDays(card, ex, size);
    const d = daysUntil(ex.date);
    if (showWeeks && d >= 7 && now < ex.end) {
      fullRow(card, r => txt(r, `ประมาณ ${Math.floor(d / 7)} สัปดาห์`, 11, { semi: true, color: SUB }));
    }
    fullRow(card, r => txt(r, ex.sub, 11, { color: SUB }));
    return card;
  }

  function tipCard(parent, size) {
    const card = parent.addStack();
    card.layoutVertically();
    card.backgroundColor = CARD;
    card.cornerRadius = 14;
    card.setPadding(8, 12, 8, 12);
    fullRow(card, r => txt(r, `💡 ${todayTip()}`, size, { semi: true, lines: 2 }));
  }

  function milestoneList(parent, max, size) {
    const list = MILESTONES.filter(m => m.end >= now).slice(0, max);
    fullRow(parent, r => txt(r, "ไทม์ไลน์ที่ห้ามพลาด", 12, { semi: true, color: SUB }));
    parent.addSpacer(6);
    list.forEach((m, i) => {
      if (i) parent.addSpacer(7);
      const open = now >= m.start && now <= m.end;
      const d = daysUntil(m.start);
      const row = parent.addStack();
      row.layoutHorizontally();
      row.centerAlignContent();
      txt(row, m.emoji, size + 2);
      row.addSpacer(8);
      const col = row.addStack();
      col.layoutVertically();
      txt(col, m.name, size, { semi: true });
      txt(col, m.label, size - 3, { color: SUB });
      row.addSpacer();
      txt(row, open ? "เปิดแล้ว!" : d === 0 ? "วันนี้!" : `${d} วัน`, size + 1,
        { bold: true, color: open || d <= 7 ? RED : TEXT });
    });
  }

  // ---------- Layout แต่ละขนาด ----------
  function buildSmall() {
    const w = baseWidget(14);
    const ex = pickExam();
    fullRow(w, r => txt(r, `${ex.emoji} ${ex.name}`, 13, { bold: true, color: SUB }));
    w.addSpacer();
    bigDays(w, ex, 50);
    w.addSpacer();
    fullRow(w, r => txt(r, ex.sub, 11, { color: SUB }));
    w.addSpacer(2);
    fullRow(w, r => txt(r, HANDLE, 9, { semi: true, color: SUB }));
    return w;
  }

  function buildMedium() {
    const w = baseWidget(12);
    header(w, 13);
    w.addSpacer(8);
    const row = w.addStack();
    row.layoutHorizontally();
    EXAMS.forEach((ex, i) => {
      if (i) row.addSpacer(8);
      examCard(row, ex, 34, false);
    });
    return w;
  }

  function buildLarge() {
    const w = baseWidget(15);
    header(w, 15);
    w.addSpacer(10);
    const row = w.addStack();
    row.layoutHorizontally();
    EXAMS.forEach((ex, i) => {
      if (i) row.addSpacer(10);
      examCard(row, ex, 44, true);
    });
    w.addSpacer(12);
    milestoneList(w, 3, 13);
    w.addSpacer();
    tipCard(w, 12);
    return w;
  }

  function buildXL() {
    const w = baseWidget(20);
    header(w, 18);
    w.addSpacer(14);
    const cols = w.addStack();
    cols.layoutHorizontally();

    const left = cols.addStack();
    left.layoutVertically();
    EXAMS.forEach((ex, i) => {
      if (i) left.addSpacer(10);
      examCard(left, ex, 56, true);
    });
    left.addSpacer(10);
    tipCard(left, 13);

    cols.addSpacer(20);

    const right = cols.addStack();
    right.layoutVertically();
    milestoneList(right, 7, 14);
    right.addSpacer();
    return w;
  }

  function buildInline() {
    const w = new ListWidget();
    const parts = activeExams().map(e => `${e.name} ${Math.max(daysUntil(e.date), 0)} วัน`);
    w.addText(parts.length ? `🐻 ${parts.join(" | ")}` : "🐻 Dek70 สอบครบแล้ว!");
    return w;
  }

  function buildRect() {
    const w = new ListWidget();
    txt(w, "🐻 Dek70 Countdown", 11, { semi: true, color: null });
    const list = activeExams();
    if (!list.length) { txt(w, "สอบครบแล้ว เก่งมาก! 🎉", 13, { bold: true, color: null }); return w; }
    list.forEach(e => {
      const r = w.addStack();
      r.layoutHorizontally();
      txt(r, `${e.emoji} ${e.name}`, 13, { semi: true, color: null });
      r.addSpacer();
      txt(r, `${Math.max(daysUntil(e.date), 0)} วัน`, 13, { bold: true, color: null });
    });
    return w;
  }

  function buildCircle() {
    const w = new ListWidget();
    w.addAccessoryWidgetBackground = true;
    const ex = pickExam();
    const a = w.addText(ex.key === "tgat" ? "TGAT" : "A-Lv");
    a.font = Font.semiboldSystemFont(9);
    a.centerAlignText();
    const b = w.addText(String(Math.max(daysUntil(ex.date), 0)));
    b.font = Font.boldRoundedSystemFont(20);
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
