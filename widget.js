// 🐻 Dek70 Countdown by BearWithYou (@WeBearTogether) — ไฟล์หลักบนเว็บ
// แก้ไฟล์นี้แล้วอัปขึ้นเว็บ = widget ของทุกคนอัปเดตตาม
// ⚠️ เปลี่ยน version ทุกครั้งที่อัปเดต และลองบนเครื่องตัวเองก่อนเสมอ
// ธีม: Bold Black + Honey LED

module.exports.version = "2.0.0";

module.exports.build = function (FAMILY, PARAM) {
  const LINK = "https://x.com/WeBearTogether"; // แตะ widget แล้วเปิดลิงก์นี้
  const HANDLE = "@WeBearTogether";
  const START = new Date(2026, 4, 16); // จุดเริ่มนับสัปดาห์ (เปิดเทอม ม.6)

  // ---------- วันสอบ (อ้างอิงปฏิทิน TCAS70 จาก mytcas) ----------
  const EXAMS = [
    { key: "tgat", name: "TGAT", short: "TGAT", sub: "ส. 30 ม.ค. 70  13:00",
      date: new Date(2027, 0, 30, 13, 0), end: new Date(2027, 0, 30, 16, 0) },
    { key: "alevel", name: "A-Level Eng", short: "A-Level", sub: "อา. 14 มี.ค. 70  11:00",
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

  // ---------- สี ----------
  const BG = new Color("#0B0B0C");
  const PANEL = new Color("#18181B");
  const WHITE = new Color("#FFFFFF");
  const SUB = new Color("#8A8A93");
  const HONEY = new Color("#FFB627");
  const RED = new Color("#FF4D4D");
  const DIM = new Color("#2A2A2E");

  // ---------- เวลา ----------
  const now = new Date();
  const DAY = 86400000;
  const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const daysUntil = d => Math.round((startOfDay(d) - startOfDay(now)) / DAY);
  const param = (PARAM || "").trim().toLowerCase();

  const activeExams = () => EXAMS.filter(e => e.end > now);
  function pickExam() {
    return EXAMS.find(e => e.key === param) || activeExams()[0] || EXAMS[EXAMS.length - 1];
  }
  const otherExam = ex => activeExams().find(e => e !== ex) || null;
  const nextMilestone = () => MILESTONES.find(m => m.end >= now) || null;
  function todayTip() {
    const doy = Math.floor((startOfDay(now) - new Date(now.getFullYear(), 0, 1)) / DAY);
    return TIPS[doy % TIPS.length];
  }
  const urgent = ex => daysUntil(ex.date) <= 14;
  function daysText(ex) {
    const d = daysUntil(ex.date);
    if (now > ex.end) return "จบแล้ว";
    if (d <= 0) return "วันนี้!";
    return `${d} วัน`;
  }
  function milestoneText(m) {
    const d = daysUntil(m.start);
    if (now >= m.start && now <= m.end) return `${m.name} เปิดแล้ว!`;
    return d === 0 ? `${m.name} วันนี้` : `${m.name} อีก ${d} วัน`;
  }

  // ---------- ฟอนต์ LED 5×7 ----------
  const GLYPH = {
    "0": ["01110","10001","10011","10101","11001","10001","01110"],
    "1": ["00100","01100","00100","00100","00100","00100","01110"],
    "2": ["01110","10001","00001","00010","00100","01000","11111"],
    "3": ["11111","00010","00100","00010","00001","10001","01110"],
    "4": ["00010","00110","01010","10010","11111","00010","00010"],
    "5": ["11111","10000","11110","00001","00001","10001","01110"],
    "6": ["00110","01000","10000","11110","10001","10001","01110"],
    "7": ["11111","00001","00010","00100","01000","01000","01000"],
    "8": ["01110","10001","10001","01110","10001","10001","01110"],
    "9": ["01110","10001","10001","01111","00001","00010","01100"],
    "A": ["01110","10001","10001","11111","10001","10001","10001"],
    "D": ["11110","10001","10001","10001","10001","10001","11110"],
    "E": ["11111","10000","10000","11110","10000","10000","11111"],
    "G": ["01110","10001","10000","10111","10001","10001","01111"],
    "L": ["10000","10000","10000","10000","10000","10000","11111"],
    "N": ["10001","10001","11001","10101","10011","10001","10001"],
    "O": ["01110","10001","10001","10001","10001","10001","01110"],
    "S": ["01111","10000","10000","01110","00001","00001","11110"],
    "T": ["11111","00100","00100","00100","00100","00100","00100"],
    "V": ["10001","10001","10001","10001","10001","01010","00100"],
    "Y": ["10001","10001","01010","00100","00100","00100","00100"],
    "!": ["00100","00100","00100","00100","00100","00000","00100"],
    "-": ["00000","00000","00000","11111","00000","00000","00000"],
    " ": ["00000","00000","00000","00000","00000","00000","00000"],
  };

  function boardLines(ex) {
    const d = daysUntil(ex.date);
    if (now > ex.end) return ["DONE", "!"];
    if (d <= 0) return ["TODAY", "!"];
    return [String(d), d === 1 ? "DAY" : "DAYS"];
  }

  // จอ LED จุดๆ แบบป้ายสนามบิน
  function boardImage(lines, hex, W, H) {
    const color = new Color(hex);
    const glow = new Color(hex, 0.22);
    const s = 3, w = W * s, h = H * s;
    const ctx = new DrawContext();
    ctx.size = new Size(w, h);
    ctx.opaque = false;
    ctx.respectScreenScale = false;
    const panel = new Path();
    panel.addRoundedRect(new Rect(0, 0, w, h), 22 * s, 22 * s);
    ctx.addPath(panel);
    ctx.setFillColor(PANEL);
    ctx.fillPath();

    const maxLen = Math.max(...lines.map(l => l.length));
    const textCols = maxLen * 6 - 1;
    const textRows = lines.length * 7 + (lines.length - 1) * 2;
    const pad = 14 * s;
    const pitch = Math.min((w - 2 * pad) / (textCols + 2), (h - 2 * pad) / (textRows + 2));
    const cols = Math.floor((w - 2 * pad) / pitch), rows = Math.floor((h - 2 * pad) / pitch);
    const ox = (w - cols * pitch) / 2, oy = (h - rows * pitch) / 2;
    const c0 = Math.floor((cols - textCols) / 2), r0 = Math.floor((rows - textRows) / 2);

    const lit = new Set();
    lines.forEach((line, li) => {
      const lc0 = c0 + Math.floor((textCols - (line.length * 6 - 1)) / 2);
      [...line].forEach((ch, ci) => {
        const g = GLYPH[ch] || GLYPH[" "];
        g.forEach((row, gr) => [...row].forEach((bit, gc) => {
          if (bit === "1") lit.add(`${r0 + li * 9 + gr},${lc0 + ci * 6 + gc}`);
        }));
      });
    });

    const dot = pitch * 0.72;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = ox + c * pitch + (pitch - dot) / 2, y = oy + r * pitch + (pitch - dot) / 2;
        if (lit.has(`${r},${c}`)) {
          ctx.setFillColor(glow);
          ctx.fillEllipse(new Rect(x - dot * 0.35, y - dot * 0.35, dot * 1.7, dot * 1.7));
          ctx.setFillColor(color);
        } else {
          ctx.setFillColor(DIM);
        }
        ctx.fillEllipse(new Rect(x, y, dot, dot));
      }
    }
    return ctx.getImage();
  }

  // จุดแทนสัปดาห์: จุดเทา = ผ่านไปแล้ว, จุดน้ำผึ้ง = ที่เหลือ
  function weekDots(ex, W, H, cols) {
    const total = Math.max(1, Math.ceil((ex.date - START) / (7 * DAY)));
    const left = Math.max(0, Math.min(total, Math.ceil((ex.date - now) / (7 * DAY))));
    const rows = Math.ceil(total / cols);
    const s = 3, w = W * s, h = H * s;
    const pitch = Math.min(w / cols, h / rows), dot = pitch * 0.7;
    const ctx = new DrawContext();
    ctx.size = new Size(w, h);
    ctx.opaque = false;
    ctx.respectScreenScale = false;
    const col = urgent(ex) ? RED : HONEY;
    for (let i = 0; i < total; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      ctx.setFillColor(i >= total - left ? col : DIM);
      ctx.fillEllipse(new Rect(c * pitch + (pitch - dot) / 2, r * pitch + (pitch - dot) / 2, dot, dot));
    }
    return { img: ctx.getImage(), left };
  }

  // ---------- ตัวช่วยวาด ----------
  function txt(stack, s, size, o = {}) {
    const t = stack.addText(s);
    t.font = o.heavy ? Font.heavySystemFont(size)
      : o.bold ? Font.boldSystemFont(size)
      : o.semi ? Font.semiboldSystemFont(size)
      : o.medium ? Font.mediumSystemFont(size)
      : Font.systemFont(size);
    if (o.color !== null) t.textColor = o.color || WHITE;
    t.lineLimit = o.lines || 1;
    t.minimumScaleFactor = o.scale || 0.6;
    return t;
  }
  function row(parent) {
    const r = parent.addStack();
    r.layoutHorizontally();
    r.centerAlignContent();
    return r;
  }
  function baseWidget(p) {
    const w = new ListWidget();
    w.backgroundColor = BG;
    w.setPadding(p, p, p, p);
    return w;
  }
  function pill(parent, label, color, size) {
    const p = parent.addStack();
    p.layoutHorizontally();
    p.centerAlignContent();
    p.backgroundColor = PANEL;
    p.cornerRadius = 14;
    p.setPadding(7, 11, 7, 11);
    const dot = p.addStack();
    dot.size = new Size(6, 6);
    dot.cornerRadius = 3;
    dot.backgroundColor = color;
    p.addSpacer(7);
    txt(p, label, size, { semi: true });
    p.addSpacer();
    return p;
  }
  // ประโยคใหญ่แบบไฮไลต์คำ: อีก [117 วัน] สอบ TGAT
  function statement(parent, ex, size) {
    const r = row(parent);
    const d = daysUntil(ex.date);
    if (now > ex.end) {
      txt(r, `${ex.short} `, size, { bold: true, color: SUB });
      txt(r, "สอบเสร็จแล้ว ✓", size, { bold: true });
    } else if (d <= 0) {
      txt(r, "วันนี้ ", size, { bold: true, color: SUB });
      txt(r, `สอบ ${ex.short}!`, size, { heavy: true, color: RED });
    } else {
      txt(r, "อีก ", size, { bold: true, color: SUB });
      txt(r, `${d} วัน`, size, { heavy: true, color: urgent(ex) ? RED : HONEY });
      txt(r, ` สอบ ${ex.short}`, size, { bold: true });
    }
    r.addSpacer();
  }

  // ---------- Layout แต่ละขนาด ----------
  function buildSmall() {
    const w = baseWidget(14);
    const ex = pickExam();
    const dots = weekDots(ex, 130, 30, 13);
    const top = row(w);
    txt(top, ex.short.toUpperCase(), 12, { bold: true, color: SUB });
    top.addSpacer();
    if (dots.left > 0 && now < ex.end) txt(top, `${dots.left} สัปดาห์`, 10, { medium: true, color: SUB });
    w.addSpacer();
    const hero = row(w);
    hero.bottomAlignContent();
    const d = daysUntil(ex.date);
    if (now > ex.end || d <= 0) {
      txt(hero, now > ex.end ? "จบแล้ว ✓" : "วันนี้!", 34, { heavy: true, color: now > ex.end ? WHITE : RED });
    } else {
      txt(hero, String(d), 58, { heavy: true, color: urgent(ex) ? RED : WHITE, scale: 0.5 });
      hero.addSpacer(4);
      txt(hero, "วัน", 16, { bold: true, color: SUB });
    }
    hero.addSpacer();
    w.addSpacer();
    const img = w.addImage(dots.img);
    img.imageSize = new Size(130, 30);
    return w;
  }

  function buildMedium() {
    const w = baseWidget(16);
    const top = row(w);
    txt(top, "DEK70", 11, { bold: true, color: HONEY });
    top.addSpacer();
    txt(top, HANDLE, 10, { medium: true, color: SUB });
    w.addSpacer();
    EXAMS.forEach((ex, i) => {
      if (i) w.addSpacer(2);
      statement(w, ex, 24);
    });
    w.addSpacer();
    const m = nextMilestone();
    if (m) {
      const open = now >= m.start && now <= m.end;
      pill(w, milestoneText(m), open ? RED : HONEY, 12);
    }
    return w;
  }

  function buildLarge() {
    const w = baseWidget(16);
    const ex = pickExam();
    const head = row(w);
    const col = head.addStack();
    col.layoutVertically();
    txt(col, `สอบถัดไป: ${ex.name}`, 20, { heavy: true });
    txt(col, ex.sub, 12, { medium: true, color: SUB });
    head.addSpacer();
    txt(head, "🐻", 22);
    w.addSpacer(12);
    const board = w.addImage(boardImage(boardLines(ex), urgent(ex) ? "#FF4D4D" : "#FFB627", 330, 200));
    board.resizable = true;
    board.centerAlignImage();
    w.addSpacer(12);
    const pills = row(w);
    const other = otherExam(ex);
    if (other) {
      pill(pills, `${other.short} ${daysText(other)}`, urgent(other) ? RED : HONEY, 12);
      pills.addSpacer(8);
    }
    const m = nextMilestone();
    if (m) pill(pills, milestoneText(m), now >= m.start && now <= m.end ? RED : SUB, 12);
    return w;
  }

  function buildXL() {
    const w = baseWidget(22);
    const ex = pickExam();
    const cols = row(w);

    const left = cols.addStack();
    left.layoutVertically();
    const head = row(left);
    const hc = head.addStack();
    hc.layoutVertically();
    txt(hc, `สอบถัดไป: ${ex.name}`, 22, { heavy: true });
    txt(hc, ex.sub, 13, { medium: true, color: SUB });
    head.addSpacer();
    left.addSpacer(14);
    const board = left.addImage(boardImage(boardLines(ex), urgent(ex) ? "#FF4D4D" : "#FFB627", 360, 230));
    board.resizable = true;
    left.addSpacer(14);
    const other = otherExam(ex);
    if (other) statement(left, other, 20);

    cols.addSpacer(24);

    const right = cols.addStack();
    right.layoutVertically();
    const t = row(right);
    txt(t, "ไทม์ไลน์", 18, { heavy: true });
    t.addSpacer();
    txt(t, HANDLE, 11, { medium: true, color: SUB });
    right.addSpacer(12);
    MILESTONES.filter(m => m.end >= now).slice(0, 6).forEach((m, i) => {
      if (i) right.addSpacer(10);
      const open = now >= m.start && now <= m.end;
      const d = daysUntil(m.start);
      const r = row(right);
      const dot = r.addStack();
      dot.size = new Size(8, 8);
      dot.cornerRadius = 4;
      dot.backgroundColor = open ? RED : d <= 30 ? HONEY : DIM;
      r.addSpacer(10);
      const c = r.addStack();
      c.layoutVertically();
      txt(c, m.name, 14, { semi: true });
      txt(c, m.label, 11, { color: SUB });
      r.addSpacer();
      txt(r, open ? "เปิดแล้ว" : d === 0 ? "วันนี้" : `${d} วัน`, 15, { heavy: true, color: open ? RED : d <= 30 ? HONEY : SUB });
    });
    right.addSpacer();
    const tip = right.addStack();
    tip.layoutVertically();
    tip.backgroundColor = PANEL;
    tip.cornerRadius = 16;
    tip.setPadding(10, 12, 10, 12);
    txt(tip, "TIP วันนี้", 10, { bold: true, color: HONEY });
    tip.addSpacer(3);
    const tr = row(tip);
    txt(tr, todayTip(), 13, { semi: true, lines: 2 });
    tr.addSpacer();
    return w;
  }

  function buildInline() {
    const w = new ListWidget();
    const parts = activeExams().map(e => `${e.short} ${daysText(e)}`);
    w.addText(parts.length ? parts.join("  |  ") : "Dek70 สอบครบแล้ว!");
    return w;
  }

  function buildRect() {
    const w = new ListWidget();
    txt(w, "DEK70", 11, { bold: true, color: null });
    const list = activeExams();
    if (!list.length) { txt(w, "สอบครบแล้ว เก่งมาก!", 13, { bold: true, color: null }); return w; }
    list.forEach(e => {
      const r = row(w);
      txt(r, e.short, 13, { medium: true, color: null });
      r.addSpacer();
      txt(r, daysText(e), 14, { heavy: true, color: null });
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
    b.font = Font.heavySystemFont(20);
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
  w.refreshAfterDate = soon < midnight ? soon : midnight;
  return w;
};
