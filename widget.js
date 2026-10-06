// 🐻 Dek70 Countdown by BearWithYou (@WeBearTogether) — ไฟล์หลักบนเว็บ
// แก้ไฟล์นี้แล้วอัปขึ้นเว็บ = widget ของทุกคนอัปเดตตาม
// ⚠️ เปลี่ยน version ทุกครั้งที่อัปเดต และลองบนเครื่องตัวเองก่อนเสมอ
// โหมดวางอิสระ: ทุกชิ้นมีพิกัดของตัวเอง (X, Y เป็น % ของความกว้าง/สูง widget)
// ปรับหน้าตาได้ที่ Widget Studio แล้วกดคัดลอกทั้งไฟล์มาวางทับ

module.exports.version = "5.0.0";

// ==== DESIGN START ====
const DESIGN = {
  bg: "#FFFFFF", bgDepth: 0, ink: "#000000", dateColor: "#000000", red: "#E5484D",
  panel: "#F2F2F2", panelDepth: 0, panelRadius: 14, line: "#DADADA", track: "#EFEFEF",
  urgentDays: 14, itemUrgentDays: 7,
  emDigit: [0.56, 0.57, 0.58, 0.59, 0.6, 0.61, 0.62, 0.63, 0.64], emWan: [1.05, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18, 1.2],
  sLabelX: 9, sLabelY: 9, sLabelSize: 14, sLabelWeight: 400, sLabelAlign: "l",
  sNumX: 8, sNumY: 20, sNumSize: 54, sNumWeight: 400, sNumAlign: "l",
  sUnitFollow: 1, sUnitX: 60, sUnitY: 40, sUnitGap: 6, sUnitLift: 6, sUnitSize: 18, sUnitWeight: 400,
  sDateX: 9, sDateY: 64, sDateSize: 12, sDateWeight: 400, sDateAlign: "l",
  sBarX: 9, sBarY: 82, sBarW: 82, sBarH: 9,
  mLabelX: 4.5, mLabelY: 10, mLabelSize: 14, mLabelWeight: 400, mLabelAlign: "l",
  mNumX: 4, mNumY: 23, mNumSize: 64, mNumWeight: 400, mNumAlign: "l",
  mUnitFollow: 1, mUnitX: 30, mUnitY: 50, mUnitGap: 5, mUnitLift: 8, mUnitSize: 19, mUnitWeight: 400,
  mDateX: 4.5, mDateY: 78, mDateSize: 11, mDateWeight: 400, mDateAlign: "l",
  mTlX: 41, mTlY: 8, mTlW: 55, mCount: 3, mItemNameSize: 11, mItemNameWeight: 700, mItemDateSize: 10, mItemNumSize: 19, mItemNumWeight: 700, mItemUnitSize: 11, mItemGap: 6, mPanelPadX: 12, mPanelPadY: 8,
  tLabelX: 5.3, tLabelY: 13, tLabelSize: 16, tLabelWeight: 700, tLabelAlign: "l",
  tDateX: 94.7, tDateY: 13, tDateSize: 15, tDateWeight: 400, tDateAlign: "r",
  tTimerX: 5, tTimerY: 35, tTimerSize: 42, tTimerWeight: 400,
  tBarX: 5.3, tBarY: 78, tBarW: 89.4, tBarH: 10,
  lLabelX: 5.3, lLabelY: 5, lLabelSize: 18, lLabelWeight: 400, lLabelAlign: "l",
  lNumX: 4.5, lNumY: 10, lNumSize: 100, lNumWeight: 400, lNumAlign: "l",
  lUnitFollow: 1, lUnitX: 50, lUnitY: 30, lUnitGap: 5, lUnitLift: 11, lUnitSize: 22, lUnitWeight: 400,
  lDateX: 5.3, lDateY: 45, lDateSize: 12, lDateWeight: 400, lDateAlign: "l",
  lTlX: 5.3, lTlY: 53, lTlW: 89.4, lCount: 3, lItemNameSize: 12, lItemNameWeight: 700, lItemDateSize: 11, lItemNumSize: 20, lItemNumWeight: 700, lItemUnitSize: 12, lItemGap: 6, lPanelPadX: 12, lPanelPadY: 8,
  xLabelX: 3.4, xLabelY: 7, xLabelSize: 22, xLabelWeight: 400, xLabelAlign: "l",
  xNumX: 3, xNumY: 15, xNumSize: 160, xNumWeight: 400, xNumAlign: "l",
  xUnitFollow: 1, xUnitX: 40, xUnitY: 50, xUnitGap: 6, xUnitLift: 18, xUnitSize: 28, xUnitWeight: 400,
  xDateX: 3.4, xDateY: 84, xDateSize: 14, xDateWeight: 400, xDateAlign: "l",
  xTlX: 54, xTlY: 7, xTlW: 42.6, xCount: 6, xItemNameSize: 12, xItemNameWeight: 700, xItemDateSize: 11, xItemNumSize: 20, xItemNumWeight: 700, xItemUnitSize: 12, xItemGap: 6, xPanelPadX: 12, xPanelPadY: 8,
};
// ==== DESIGN END ====
module.exports.DESIGN = DESIGN;

// ---------- เหตุการณ์ (อ้างอิงปฏิทิน TCAS70 จาก mytcas) ----------
// key: ใช้ล็อกใน Parameter ได้ เช่น tgat, alevel  |  วันที่: [ปี, เดือน(1-12), วัน, ชม, นาที]
const EVENT_LIST = [
  { key: "reg-tgat", name: "สมัคร TGAT/TPAT", short: "สมัคร", start: [2026, 11, 4], end: [2026, 11, 10, 23, 59] },
  { key: "reg-alevel", name: "สมัคร A-Level", short: "สมัคร", start: [2027, 1, 14], end: [2027, 1, 20, 23, 59] },
  { key: "tgat", name: "สอบ TGAT", short: "TGAT", start: [2027, 1, 30, 13, 0], end: [2027, 1, 30, 16, 0] },
  { key: "res-tgat", name: "ประกาศผล TGAT", short: "ผล", start: [2027, 2, 28], end: [2027, 2, 28, 23, 59] },
  { key: "alevel", name: "สอบ A-Level", short: "A-Lv", start: [2027, 3, 14, 11, 0], end: [2027, 3, 14, 12, 30] },
  { key: "res-alevel", name: "ประกาศผล A-Level", short: "ผล", start: [2027, 4, 20], end: [2027, 4, 20, 23, 59] },
  { key: "round3", name: "สมัครรอบ 3", short: "รอบ 3", start: [2027, 5, 7], end: [2027, 5, 11, 23, 59] },
];
const START_MS = new Date(2026, 4, 16).getTime(); // จุดเริ่มแถบ progress อันแรก (เปิดเทอม ม.6)
const MONTHS = ["มกรา", "กุมภา", "มีนา", "เมษา", "พฤษภา", "มิถุนา", "กรกฎา", "สิงหา", "กันยา", "ตุลา", "พฤศจิกา", "ธันวา"];
const DAY = 86400000;
// ขนาดอ้างอิงของแต่ละแบบ (pt) — ขนาดตัวหนังสือใน DESIGN คิดที่ขนาดนี้ แล้วย่อ/ขยายตามเครื่องจริง
const REF = { small: [158, 158], medium: [338, 158], mediumBar: [338, 158], large: [338, 354], xl: [715.5, 342] };
module.exports.REF = REF;

// ---------- สถานะ ณ เวลาหนึ่ง (ใช้ร่วมกันทั้ง widget และ Studio) ----------
function makeState(nowMs, param, D) {
  const mk = a => new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0);
  const events = EVENT_LIST.map(e => ({ ...e, start: mk(e.start), end: mk(e.end) }));
  const now = new Date(nowMs);
  const sod = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const daysUntil = d => Math.round((sod(d) - sod(now)) / DAY);
  const sameDay = (a, b) => sod(a).getTime() === sod(b).getTime();
  const isOpen = e => now >= e.start && now <= e.end;
  const dm = d => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  function dateLabel(e) {
    const a = e.start, b = e.end;
    if (sameDay(a, b)) return dm(a);
    if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${b.getDate()} ${MONTHS[a.getMonth()]}`;
    return `${dm(a)}–${dm(b)}`;
  }
  const tokens = (param || "").toLowerCase().split(/[\s,]+/).filter(Boolean);
  const up = events.filter(e => e.end >= now);
  const hero = events.find(e => tokens.includes(e.key) && e.end >= now) || up[0] || null;
  const rest = up.filter(e => e !== hero);
  let st;
  if (!hero) st = { kind: "done" };
  else if (isOpen(hero)) {
    if (sameDay(hero.start, hero.end)) st = { kind: "today" };
    else { const d = daysUntil(hero.end); st = d <= 0 ? { kind: "last" } : { kind: "open", days: d, target: hero.end }; }
  } else {
    const d = daysUntil(hero.start);
    st = d <= 0 ? { kind: "today", target: hero.start } : { kind: "wait", days: d, target: hero.start };
  }
  let progress = 1;
  if (hero) {
    if (isOpen(hero)) progress = (now - hero.start) / Math.max(1, hero.end - hero.start);
    else {
      const i = events.indexOf(hero);
      const from = i > 0 ? events[i - 1].end.getTime() : START_MS;
      progress = (now - from) / Math.max(1, hero.start - from);
    }
    progress = Math.max(0, Math.min(1, progress));
  }
  return {
    now, hero, rest, st, progress, daysUntil, isOpen, dateLabel, bar: tokens.includes("bar"),
    urgent: st.kind !== "wait" || st.days <= D.urgentDays,
    heroName: hero ? hero.name : "Dek70",
    heroDate: !hero ? "" : st.kind === "open" ? `เปิดแล้ว ปิด ${dm(hero.end)}` : dateLabel(hero),
  };
}
module.exports.makeState = makeState;

// ---------- วาด widget (โค้ดชุดเดียวกับที่ Studio ใช้พรีวิว) ----------
// G = ตัววาด (Scriptable หรือ canvas ใน Studio), W/H = ขนาดจริง (pt)
module.exports.paint = function (G, fam, W, H, nowMs, param, D) {
  const S = makeState(nowMs, param, D);
  const sc = W / REF[fam][0];
  const X = v => (v / 100) * W, Y = v => (v / 100) * H;
  const p = { small: "s", medium: "m", mediumBar: "t", large: "l", xl: "x" }[fam];
  const P = k => D[p + k];
  const mainColor = S.urgent ? D.red : D.ink;

  G.bg(D.bg, D.bgDepth);

  function label() {
    G.text("label", S.heroName, X(P("LabelX")), Y(P("LabelY")), P("LabelSize") * sc, P("LabelWeight"), D.ink, P("LabelAlign"));
  }
  function date() {
    G.text("date", S.heroDate, X(P("DateX")), Y(P("DateY")), P("DateSize") * sc, P("DateWeight"),
      S.st.kind === "open" ? D.red : D.dateColor, P("DateAlign"));
  }
  function number() {
    const x = X(P("NumX")), y = Y(P("NumY")), N = P("NumSize") * sc, wgt = P("NumWeight"), al = P("NumAlign");
    const k = S.st.kind;
    if (k === "done") return G.text("num", "จบแล้ว ✓", x, y, N * 0.45, 600, D.ink, al);
    if (k === "today") return G.text("num", "วันนี้!", x, y, N * 0.5, 600, D.red, al);
    if (k === "last") return G.text("num", "วันสุดท้าย!", x, y, N * 0.45, 600, D.red, al);
    const str = String(S.st.days);
    G.text("num", str, x, y, N, wgt, mainColor, al);
    const U = P("UnitSize") * sc;
    if (P("UnitFollow")) {
      const w = G.measure(str, N, wgt);
      const left = al === "r" ? x - w : al === "c" ? x - w / 2 : x;
      const uy = y + 0.95 * N - 0.95 * U - P("UnitLift") * sc;
      G.text("unit", "วัน", left + w + P("UnitGap") * sc, uy, U, P("UnitWeight"), D.ink, "l");
    } else {
      G.text("unit", "วัน", X(P("UnitX")), Y(P("UnitY")), U, P("UnitWeight"), D.ink, "l");
    }
  }
  function bar() {
    const x = X(P("BarX")), y = Y(P("BarY")), w = X(P("BarW")), h = P("BarH") * sc;
    G.rect("bar", x, y, w, h, h / 2, D.track, 0);
    if (S.progress > 0) G.rect(null, x, y, Math.max(h, w * S.progress), h, h / 2, mainColor, 0);
  }
  function timeline() {
    const list = S.rest.slice(0, P("Count"));
    if (!list.length) return;
    const x = X(P("TlX")), y0 = Y(P("TlY")), w = X(P("TlW"));
    const nameS = P("ItemNameSize") * sc, dateS = P("ItemDateSize") * sc, numS = P("ItemNumSize") * sc, unitS = P("ItemUnitSize") * sc;
    const padX = P("PanelPadX") * sc, padY = P("PanelPadY") * sc, gap = P("ItemGap") * sc, rad = D.panelRadius * sc;
    const rowH = Math.max(nameS * 1.2 + dateS * 1.2, numS * 1.2);
    function row(e, top) {
      G.text(null, e.name, x + padX, top, nameS, P("ItemNameWeight"), D.ink, "l");
      G.text(null, S.dateLabel(e), x + padX, top + nameS * 1.2, dateS, 400, D.dateColor, "l");
      const right = x + w - padX;
      if (S.isOpen(e)) {
        G.text(null, "เปิดแล้ว", right, top + (rowH - numS * 0.9) / 2, numS * 0.75, P("ItemNumWeight"), D.red, "r");
        return;
      }
      const d = S.daysUntil(e.start);
      const ny = top + (rowH - numS * 1.2) / 2;
      const color = d <= D.itemUrgentDays ? D.red : D.ink;
      if (d === 0) return G.text(null, "วันนี้", right, ny, numS, P("ItemNumWeight"), D.red, "r");
      const uw = G.measure("วัน", unitS, P("ItemNumWeight"));
      G.text(null, "วัน", right, ny + 0.95 * numS - 0.95 * unitS, unitS, P("ItemNumWeight"), D.ink, "r");
      G.text(null, String(d), right - uw - 3 * sc, ny, numS, P("ItemNumWeight"), color, "r");
    }
    const h1 = rowH + padY * 2;
    G.rect(null, x, y0, w, h1, rad, D.panel, D.panelDepth);
    row(list[0], y0 + padY);
    let total = h1;
    if (list.length > 1) {
      const more = list.slice(1);
      const y2 = y0 + h1 + gap;
      const h2 = more.length * rowH + (more.length - 1) * (gap * 2 + 1) + padY * 2;
      G.rect(null, x, y2, w, h2, rad, D.panel, D.panelDepth);
      let top = y2 + padY;
      more.forEach((e, i) => {
        if (i) {
          G.rect(null, x + padX, top + gap, w - padX * 2, Math.max(0.5, 1 * sc), 0, D.line, 0);
          top += gap * 2 + 1;
        }
        row(e, top);
        top += rowH;
      });
      total = h1 + gap + h2;
    }
    G.group("timeline", x, y0, w, total);
  }
  function timer() {
    const x = X(P("TimerX")), y = Y(P("TimerY")), size = P("TimerSize") * sc, wgt = P("TimerWeight");
    const k = S.st.kind;
    if (!S.st.target || k === "last" || k === "done") {
      return G.text("timer", k === "done" ? "จบแล้ว ✓" : "วันนี้!", x, y, size * 0.5, wgt, mainColor, "l");
    }
    const left = S.st.target - S.now;
    const days = Math.max(0, Math.floor(left / DAY));
    G.timer("timer", x, y, size, wgt, mainColor, days > 0 ? `${days}:` : "", S.st.target.getTime() - days * DAY);
  }

  if (fam === "small") { label(); number(); date(); bar(); }
  else if (fam === "medium") { label(); number(); date(); timeline(); }
  else if (fam === "mediumBar") { label(); date(); timer(); bar(); }
  else { label(); number(); date(); timeline(); }
  return S;
};

// ---------- ส่วนของ Scriptable ----------
// ขนาด widget จริงตามรุ่นเครื่อง (pt) [ด้านสั้นจอ, ด้านยาวจอ, small, mediumW, largeH, xlW]
const SIZES = [
  [430, 932, 170, 364, 382], [428, 926, 170, 364, 382], [414, 896, 169, 360, 379], [414, 736, 159, 348, 357],
  [402, 874, 162, 348, 365], [393, 852, 158, 338, 354], [390, 844, 158, 338, 354], [375, 812, 155, 329, 345],
  [375, 667, 148, 321, 324], [360, 780, 155, 329, 345], [320, 568, 141, 292, 311],
  [1032, 1376, 170, 378.5, 378.5, 795], [1024, 1366, 170, 378.5, 378.5, 795], [834, 1210, 155, 342, 342, 715.5],
  [834, 1194, 155, 342, 342, 715.5], [820, 1180, 155, 342, 342, 715.5], [810, 1080, 146, 320.5, 320.5, 669],
  [768, 1024, 141, 305.5, 305.5, 634.5], [744, 1133, 141, 305.5, 305.5, 634.5],
];
function widgetSize(fam) {
  const s = Device.screenSize();
  const a = Math.min(s.width, s.height), b = Math.max(s.width, s.height);
  let best = SIZES[5], score = Infinity;
  SIZES.forEach(r => { const d = Math.abs(r[0] - a) + Math.abs(r[1] - b) * 0.5; if (d < score) { score = d; best = r; } });
  const [, , sm, mw, lh, xw] = best;
  if (fam === "small") return [sm, sm];
  if (fam === "medium" || fam === "mediumBar") return [mw, sm];
  if (fam === "large") return [mw, lh];
  return [xw || mw * 2.09, lh];
}

function scriptableG(W, H, D) {
  const s = 3;
  const ctx = new DrawContext();
  ctx.size = new Size(W * s, H * s);
  ctx.opaque = false;
  ctx.respectScreenScale = false;
  const overlays = [];
  const WEIGHTS = { 100: "ultraLight", 200: "thin", 300: "light", 400: "regular", 500: "medium", 600: "semibold", 700: "bold", 800: "heavy", 900: "black" };
  const wi = w => Math.max(0, Math.min(8, Math.round(w / 100) - 1));
  const font = (size, w) => Font[(WEIGHTS[(wi(w) + 1) * 100]) + "SystemFont"](size);
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => Math.round(pct >= 0 ? c + (255 - c) * pct / 100 : c * (1 + pct / 100)));
    return ch;
  }
  const hexOf = ch => "#" + ch.map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("");
  // สี่เหลี่ยมมุมโค้ง + ไล่สี (วาดทีละเส้นเพื่อให้ไล่สีได้)
  function fillRound(x, y, w, h, r, hex, depth) {
    x *= s; y *= s; w *= s; h *= s; r = Math.min(r * s, w / 2, h / 2);
    if (!depth) {
      const pth = new Path();
      pth.addRoundedRect(new Rect(x, y, w, h), r, r);
      ctx.addPath(pth);
      ctx.setFillColor(new Color(hex));
      ctx.fillPath();
      return;
    }
    const a = shade(hex, depth), b = shade(hex, -depth);
    for (let i = 0; i < h; i++) {
      const t = i / Math.max(1, h - 1);
      const dy = i < r ? r - i : i > h - r ? i - (h - r) : 0;
      const inset = dy > 0 ? r - Math.sqrt(Math.max(0, r * r - dy * dy)) : 0;
      ctx.setFillColor(new Color(hexOf(a.map((c, j) => c + (b[j] - c) * t))));
      ctx.fillRect(new Rect(x + inset, y + i, Math.max(0, w - inset * 2), 1.2));
    }
  }
  return {
    bg(hex, depth) { fillRound(0, 0, W, H, 0, hex, depth); },
    rect(id, x, y, w, h, r, hex, depth) { fillRound(x, y, w, h, r, hex, depth); },
    group() {},
    measure(str, size, weight) {
      let w = 0;
      for (const ch of str) {
        if (/[0-9]/.test(ch)) w += D.emDigit[wi(weight)] * size;
        else if (ch === ":") w += 0.3 * size;
        else w += 0.55 * size;
      }
      if (str === "วัน") w = D.emWan[wi(weight)] * size;
      return w;
    },
    text(id, str, x, y, size, weight, color, align) {
      if (!str) return;
      ctx.setFont(font(size * s, weight));
      ctx.setTextColor(new Color(color));
      const big = W * s * 2;
      let rx = x * s;
      if (align === "r") { ctx.setTextAlignedRight(); rx -= big; }
      else if (align === "c") { ctx.setTextAlignedCenter(); rx -= big / 2; }
      else ctx.setTextAlignedLeft();
      ctx.drawTextInRect(str, new Rect(rx, y * s, big, size * s * 1.6));
    },
    timer(id, x, y, size, weight, color, daysText, targetMs) {
      overlays.push({ x, y, size, weight, color, daysText, target: new Date(targetMs), font });
    },
    image: () => ctx.getImage(),
    overlays,
  };
}

function buildPainted(fam, PARAM) {
  const D = DESIGN;
  const [W, H] = widgetSize(fam);
  const G = scriptableG(W, H, D);
  const S = module.exports.paint(G, fam, W, H, Date.now(), PARAM, D);
  const w = new ListWidget();
  w.backgroundImage = G.image();
  w.setPadding(0, 0, 0, 0);
  // นาฬิกาที่วินาทีเดินจริง ต้องวางทับภาพเป็นตัวหนังสือแยก
  G.overlays.forEach(o => {
    w.setPadding(Math.max(0, o.y), Math.max(0, o.x), 0, 0);
    const r = w.addStack();
    r.layoutHorizontally();
    if (o.daysText) {
      const t = r.addText(o.daysText);
      t.font = o.font(o.size, o.weight);
      t.textColor = new Color(o.color);
      t.lineLimit = 1;
    }
    const d = r.addDate(o.target);
    d.applyTimerStyle();
    d.font = o.font(o.size, o.weight);
    d.textColor = new Color(o.color);
    d.lineLimit = 1;
    d.minimumScaleFactor = 0.5;
    r.addSpacer();
    w.addSpacer();
  });
  return { w, S };
}

function buildLock(FAMILY, PARAM) {
  const S = makeState(Date.now(), PARAM, DESIGN);
  const w = new ListWidget();
  const k = S.st.kind;
  if (FAMILY === "accessoryInline") {
    let s = "Dek70 จบทุกด่านแล้ว!";
    if (k === "wait") s = `${S.heroName} อีก ${S.st.days} วัน`;
    else if (k === "open") s = `${S.heroName} ปิดใน ${S.st.days} วัน`;
    else if (k !== "done") s = `${S.heroName} วันนี้!`;
    w.addText(s);
    return { w, S };
  }
  const barImg = (W, H) => {
    const c = new DrawContext();
    c.size = new Size(W * 3, H * 3); c.opaque = false; c.respectScreenScale = false;
    const t = new Path(); t.addRoundedRect(new Rect(0, 0, W * 3, H * 3), H * 1.5, H * 1.5);
    c.addPath(t); c.setFillColor(new Color("#FFFFFF", 0.3)); c.fillPath();
    if (S.progress > 0) {
      const f = new Path(); f.addRoundedRect(new Rect(0, 0, Math.max(H * 3, W * 3 * S.progress), H * 3), H * 1.5, H * 1.5);
      c.addPath(f); c.setFillColor(new Color("#FFFFFF")); c.fillPath();
    }
    return c.getImage();
  };
  if (FAMILY === "accessoryCircular") {
    w.addAccessoryWidgetBackground = true;
    const a = w.addText(S.hero ? S.hero.short : "Dek70"); a.font = Font.systemFont(9); a.centerAlignText();
    const b = w.addText(k === "wait" || k === "open" ? String(S.st.days) : k === "done" ? "✓" : "!");
    b.font = Font.mediumSystemFont(20); b.minimumScaleFactor = 0.6; b.centerAlignText();
    const c = w.addText("วัน"); c.font = Font.systemFont(9); c.centerAlignText();
    w.addSpacer(2);
    const img = w.addImage(barImg(36, 4)); img.imageSize = new Size(36, 4); img.centerAlignImage();
    return { w, S };
  }
  // accessoryRectangular
  const top = w.addStack(); top.layoutHorizontally();
  const n = top.addText(S.heroName); n.font = Font.boldSystemFont(12);
  top.addSpacer();
  const dt = top.addText(S.hero ? S.dateLabel(S.hero) : ""); dt.font = Font.systemFont(11);
  const r = w.addStack(); r.layoutHorizontally();
  if (!S.st.target || k === "last" || k === "done") {
    const t = r.addText(k === "done" ? "จบแล้ว ✓" : "วันนี้!"); t.font = Font.systemFont(20);
  } else {
    const left = S.st.target - S.now;
    const days = Math.max(0, Math.floor(left / DAY));
    if (days > 0) { const t = r.addText(`${days}:`); t.font = Font.systemFont(26); }
    const d = r.addDate(new Date(S.st.target.getTime() - days * DAY));
    d.applyTimerStyle(); d.font = Font.systemFont(26); d.minimumScaleFactor = 0.5;
  }
  r.addSpacer();
  w.addSpacer(3);
  const img = w.addImage(barImg(150, 6)); img.imageSize = new Size(150, 6);
  return { w, S };
}

module.exports.build = function (FAMILY, PARAM) {
  const bar = (PARAM || "").toLowerCase().split(/[\s,]+/).includes("bar");
  const fam = { small: "small", medium: bar ? "mediumBar" : "medium", large: "large", extraLarge: "xl" }[FAMILY];
  const { w, S } = fam ? buildPainted(fam, PARAM) : FAMILY && FAMILY.startsWith("accessory") ? buildLock(FAMILY, PARAM) : buildPainted("large", PARAM);
  w.url = "https://x.com/WeBearTogether"; // แตะ widget แล้วเปิดลิงก์นี้
  // รีเฟรชทุก ~1 ชม. / เที่ยงคืน / ตอนวินาทีวิ่งครบวัน (แบบไหนถึงก่อน)
  const now = Date.now();
  const times = [now + 60 * 60000];
  const mid = new Date(); mid.setHours(24, 0, 0, 0); times.push(mid.getTime());
  if (S.st.target) {
    const left = S.st.target - now;
    if (left > 0) times.push(S.st.target.getTime() - Math.floor(left / DAY) * DAY);
  }
  w.refreshAfterDate = new Date(Math.min(...times.filter(t => t > now)));
  return w;
};

// ---------- เมนูตอนรันในแอป Scriptable ----------
module.exports.runInApp = async function () {
  const opts = [
    ["Small", "small", ""],
    ["Medium", "medium", ""],
    ["Medium แบบนับวินาที", "medium", "bar"],
    ["Large", "large", ""],
  ];
  if (Device.isPad()) opts.push(["Extra Large", "extraLarge", ""]);
  const a = new Alert();
  a.title = "🐻 Dek70 Countdown";
  a.message = "เลือกแบบเพื่อดูตัวอย่าง\n\nMedium แบบนับวินาที: กดค้างที่ widget > Edit Widget > ช่อง Parameter พิมพ์ bar\nอยากล็อกที่วันสอบ: พิมพ์ tgat หรือ alevel (ใช้คู่กันได้ เช่น tgat bar)";
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
