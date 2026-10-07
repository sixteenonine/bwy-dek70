// 🐻 Dek70 Countdown by BearWithYou (@WeBearTogether) — ไฟล์หลักบนเว็บ
// แก้ไฟล์นี้แล้วอัปขึ้นเว็บ = widget ของทุกคนอัปเดตตาม
// ⚠️ เปลี่ยน version ทุกครั้งที่อัปเดต และลองบนเครื่องตัวเองก่อนเสมอ
// โหมดวางอิสระ: ทุกชิ้นมีพิกัดของตัวเอง (X, Y เป็น % ของความกว้าง/สูง widget)
// ปรับหน้าตาได้ที่ Widget Studio แล้วกดคัดลอกทั้งไฟล์มาวางทับ

module.exports.version = "6.4.1";

// ==== DESIGN START ====
const DESIGN = {
  bg: "#FF4015", ink: "#000000", dateColor: "#FFFFFF", red: "#000000", panel: "#000000",
  panelRadius: 14, line: "#2C2C2E", track: "#7B2900", urgentDays: 14, itemUrgentDays: 7,
  bgGrad: 1, bgN: 2, bg2: "#B51A00", bg3: "#C9D6FF", bg4: "#FFD6E7",
  bgAngle: 98, bgPos: 50, bgSize: 100, bgIntensity: 100, lightAngle: 305,
  lightMain: 100, lightReflect: 100, lightWidth: 18, lightBase: 14, wgOn: 1,
  wgRadius: 26, wgTint: "#FFFFFF", wgOpacity: 0, wgSheen: 6, wgSheenSize: 40,
  wgRim: 95, wgRimW: 0.9, wgInner: 0, wgInnerSize: 30, panelGlass: 1,
  barGlass: 1, glassTint: "#FFFFFF", glassOpacity: 21, glassSheen: 8, glassSheenSize: 34,
  glassRim: 80, glassRimW: 0.7, glassInner: 6, glassInnerSize: 97, panelGrad: 0,
  panelN: 2, panel2: "#E2E2E8", panel3: "#D6E4FF", panel4: "#FFE1EC", panelDir: "v",
  panelPos: 50, panelSize: 100, panelIntensity: 100, shNumOn: 0, shNumColor: "#000000",
  shNumX: 0, shNumY: 3, shNumBlur: 5, shNumOpacity: 55, shNumStyle: "soft",
  shNumSpread: 0, shTextOn: 0, shTextColor: "#000000", shTextX: 0, shTextY: 1,
  shTextBlur: 3, shTextOpacity: 20, shTextStyle: "soft", shTextSpread: 0, shPanelOn: 1,
  shPanelColor: "#000000", shPanelX: 0, shPanelY: 3.5, shPanelBlur: 3.5, shPanelOpacity: 14,
  shPanelStyle: "soft", shPanelSpread: 1.5, shPanelSX: 99, shPanelSY: 98, shPanelRound: 0,
  shBarOn: 1, shBarColor: "#000000", shBarX: 0, shBarY: 2, shBarBlur: 4,
  shBarOpacity: 20, shBarStyle: "soft", shBarSpread: 0, shBarSX: 100, shBarSY: 100,
  shBarRound: 0,
  emNum: [0.582,0.39,0.557,0.558,0.575,0.571,0.579,0.529,0.58,0.579, 0.59,0.408,0.56,0.569,0.585,0.576,0.592,0.535,0.586,0.592, 0.598,0.426,0.563,0.581,0.595,0.58,0.605,0.541,0.593,0.605, 0.606,0.443,0.566,0.592,0.604,0.585,0.617,0.547,0.6,0.617, 0.623,0.456,0.578,0.604,0.619,0.598,0.629,0.555,0.616,0.629, 0.639,0.468,0.591,0.617,0.633,0.612,0.64,0.564,0.632,0.64, 0.656,0.48,0.603,0.63,0.647,0.625,0.652,0.572,0.649,0.652, 0.672,0.492,0.615,0.642,0.662,0.638,0.664,0.58,0.665,0.664, 0.689,0.504,0.628,0.655,0.676,0.652,0.675,0.589,0.682,0.675], emWan: [1.106, 1.106, 1.106, 1.133, 1.132, 1.131, 1.13, 1.13, 1.13],
  sCardOn: 0, sCardX: 5, sCardY: 5, sCardW: 90, sCardH: 65, sCardR: 18,
  sLabelX: 9, sLabelY: 9, sLabelSize: 14, sLabelWeight: 400, sLabelAlign: "l",
  sNumX: 8, sNumY: 20, sNumSize: 54, sNumWeight: 400, sNumAlign: "l",
  sUnitFollow: 1, sUnitX: 60, sUnitY: 40, sUnitGap: 6, sUnitLift: 6, sUnitSize: 18, sUnitWeight: 400,
  sDateX: 9, sDateY: 64, sDateSize: 12, sDateWeight: 400, sDateAlign: "l",
  sBarX: 9, sBarY: 82, sBarW: 82, sBarH: 9,
  mCardOn: 0, mCardX: 3, mCardY: 6, mCardW: 36, mCardH: 88, mCardR: 18,
  mLabelX: 4.5, mLabelY: 10, mLabelSize: 14, mLabelWeight: 400, mLabelAlign: "l",
  mNumX: 4, mNumY: 23, mNumSize: 64, mNumWeight: 400, mNumAlign: "l",
  mUnitFollow: 1, mUnitX: 30, mUnitY: 50, mUnitGap: 5, mUnitLift: 1, mUnitSize: 19, mUnitWeight: 400,
  mDateX: 4.5, mDateY: 78, mDateSize: 11, mDateWeight: 400, mDateAlign: "l",
  mTlX: 41, mTlY: 8, mTlW: 55, mCount: 3, mItemNameSize: 12, mItemNameWeight: 700, mItemDateSize: 10, mItemNumSize: 19, mItemNumWeight: 700, mItemUnitSize: 11, mItemGap: 6, mPanelPadX: 14, mPanelPadY: 8,
  tCardOn: 0, tCardX: 3, tCardY: 8, tCardW: 94, tCardH: 84, tCardR: 18,
  tLabelX: 5.3, tLabelY: 13, tLabelSize: 16, tLabelWeight: 700, tLabelAlign: "l",
  tDateX: 66.5, tDateY: 14, tDateSize: 15, tDateWeight: 400, tDateAlign: "r",
  tTimerX: 5, tTimerY: 35, tTimerSize: 42, tTimerWeight: 400,
  tBarX: 5.3, tBarY: 78, tBarW: 89.4, tBarH: 10,
  lCardOn: 0, lCardX: 4, lCardY: 3, lCardW: 92, lCardH: 46, lCardR: 18,
  lLabelX: 5.3, lLabelY: 5, lLabelSize: 18, lLabelWeight: 400, lLabelAlign: "l",
  lNumX: 4.5, lNumY: 10, lNumSize: 100, lNumWeight: 400, lNumAlign: "l",
  lUnitFollow: 1, lUnitX: 50, lUnitY: 30, lUnitGap: 5, lUnitLift: 11, lUnitSize: 22, lUnitWeight: 400,
  lDateX: 5.3, lDateY: 45, lDateSize: 12, lDateWeight: 400, lDateAlign: "l",
  lTlX: 5.3, lTlY: 53, lTlW: 89.4, lCount: 3, lItemNameSize: 12, lItemNameWeight: 700, lItemDateSize: 11, lItemNumSize: 20, lItemNumWeight: 700, lItemUnitSize: 12, lItemGap: 6, lPanelPadX: 12, lPanelPadY: 8,
  xCardOn: 0, xCardX: 2.5, xCardY: 5, xCardW: 48, xCardH: 90, xCardR: 18,
  xLabelX: 3.4, xLabelY: 7, xLabelSize: 22, xLabelWeight: 400, xLabelAlign: "l",
  xNumX: 3, xNumY: 15, xNumSize: 160, xNumWeight: 400, xNumAlign: "l",
  xUnitFollow: 0, xUnitX: 30, xUnitY: 46.5, xUnitGap: 6, xUnitLift: 18, xUnitSize: 28, xUnitWeight: 400,
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

// ---------- สีและการไล่สี (ใช้ร่วมกันทั้ง widget และ Studio) ----------
const rgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const hex = c => "#" + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)); };
// จุดสีของการไล่สี: [{t: 0-1, c: "#hex"}]
function gradStops(D, key) {
  const n = Math.max(2, Math.min(4, D[key + "N"]));
  const base = D[key];
  const cols = [base, D[key + "2"], D[key + "3"], D[key + "4"]].slice(0, n).map(c => mix(base, c, D[key + "Intensity"] / 100));
  const a = (D[key + "Pos"] - D[key + "Size"] / 2) / 100, b = (D[key + "Pos"] + D[key + "Size"] / 2) / 100;
  let last = 0;
  return cols.map((c, i) => { last = Math.max(last, Math.max(0, Math.min(1, a + (b - a) * i / (n - 1)))); return { t: last, c }; });
}
function colorAt(stops, t) {
  if (t <= stops[0].t) return stops[0].c;
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i].t) { const s0 = stops[i - 1], s1 = stops[i]; return mix(s0.c, s1.c, (t - s0.t) / Math.max(1e-6, s1.t - s0.t)); }
  }
  return stops[stops.length - 1].c;
}
function alphaAt(stops, t) {
  const A = x => (x.a === undefined ? 1 : x.a);
  if (t <= stops[0].t) return A(stops[0]);
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i].t) { const s0 = stops[i - 1], s1 = stops[i]; return A(s0) + (A(s1) - A(s0)) * (t - s0.t) / Math.max(1e-6, s1.t - s0.t); }
  }
  return A(stops[stops.length - 1]);
}
module.exports.alphaAt = alphaAt;
// ---------- ขอบเรืองแสงตามทิศแสง (ใช้ร่วมกันทั้ง widget และ Studio) ----------
// จุดรอบขอบสี่เหลี่ยมมุมโค้ง พร้อมมุมของทิศที่ขอบหันออก (rad, 0 = ขวา, π/2 = ล่าง)
function rimPath(x, y, w, h, r, step) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  const pts = [], PI = Math.PI;
  const line = (x1, y1, x2, y2, a) => { const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / step)); for (let i = 0; i < n; i++) pts.push({ x: x1 + (x2 - x1) * i / n, y: y1 + (y2 - y1) * i / n, a }); };
  const arc = (cx, cy, a0, a1) => { const n = Math.max(1, Math.ceil(r * Math.abs(a1 - a0) / step)); for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / n, b = a0 + (a1 - a0) * i / n; pts.push({ x: cx + r * Math.cos(b), y: cy + r * Math.sin(b), a }); } };
  line(x + r, y, x + w - r, y, -PI / 2); arc(x + w - r, y + r, -PI / 2, 0);
  line(x + w, y + r, x + w, y + h - r, 0); arc(x + w - r, y + h - r, 0, PI / 2);
  line(x + w - r, y + h, x + r, y + h, PI / 2); arc(x + r, y + h - r, PI / 2, PI);
  line(x, y + h - r, x, y + r, PI); arc(x + r, y + r, PI, 1.5 * PI);
  pts.push(pts[0]);
  return pts;
}
// ความสว่างของขอบ ณ มุมหนึ่ง: จุดสว่างหลัก (ฝั่งแสงมา) + จุดสะท้อน (ฝั่งตรงข้าม) + ความสว่างพื้นฐาน
function rimAlpha(a, D, mult) {
  const L = D.lightAngle * Math.PI / 180, k = Math.max(1, 60 / Math.max(5, D.lightWidth));
  const main = Math.pow(Math.max(0, Math.cos(a - L)), k), refl = Math.pow(Math.max(0, Math.cos(a - L - Math.PI)), k);
  return Math.max(0, Math.min(1, (D.lightBase / 100 + D.lightMain / 100 * main + D.lightReflect / 100 * refl) * mult));
}
module.exports.rimPath = rimPath;
module.exports.rimAlpha = rimAlpha;
// มุมไล่สีพื้นหลัง → จุดเริ่ม/จบในกรอบ 0-1 (0° = ซ้าย→ขวา, 90° = บน→ล่าง)
function gradPoints(angle) {
  const r = angle * Math.PI / 180, cx = Math.cos(r) / 2, cy = Math.sin(r) / 2;
  return [[0.5 - cx, 0.5 - cy], [0.5 + cx, 0.5 + cy]];
}
module.exports.gradStops = gradStops;
module.exports.colorAt = colorAt;
module.exports.gradPoints = gradPoints;

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

  G.bg(D.bgGrad ? { stops: gradStops(D, "bg"), points: gradPoints(D.bgAngle) } : { solid: D.bg });

  // ---------- เงา (วาดซ้อนหลายชั้นให้ฟุ้ง หรือซ้อนเป็นแนวยาว) ----------
  const SH = k => D[k + "On"] ? {
    color: D[k + "Color"], x: D[k + "X"] * sc, y: D[k + "Y"] * sc, blur: D[k + "Blur"] * sc, op: Math.min(0.99, D[k + "Opacity"] / 100),
    style: D[k + "Style"] || "soft", spread: (D[k + "Spread"] || 0) * sc,
    sx: (D[k + "SX"] === undefined ? 100 : D[k + "SX"]) / 100, sy: (D[k + "SY"] === undefined ? 100 : D[k + "SY"]) / 100, round: (D[k + "Round"] || 0) * sc,
  } : null;
  const ring = (rad, n) => Array.from({ length: n }, (_, i) => [Math.cos(i * 2 * Math.PI / n) * rad, Math.sin(i * 2 * Math.PI / n) * rad]);
  // จุดที่ใช้วาดเงาตัวหนังสือซ้ำ: ความหนา (spread) + ความฟุ้ง (blur)
  function samples(blur, spread) {
    const out = [[0, 0]];
    if (spread > 0.3) out.push(...ring(spread, spread > 3 ? 12 : 8));
    if (blur >= 0.5) [0.35, 0.7, 1].forEach(f => out.push(...ring(Math.max(0, spread) + blur * f, 8)));
    return out;
  }
  const longSteps = sh => Math.max(1, Math.min(40, Math.round(Math.hypot(sh.x, sh.y))));
  function T(id, str, x, y, size, weight, color, align, shKey) {
    const sh = SH(shKey);
    if (sh && str) {
      if (sh.style === "long") {
        const core = sh.spread > 0.3 ? [[0, 0], ...ring(sh.spread, 8)] : [[0, 0]];
        const n = Math.min(longSteps(sh), Math.floor(120 / core.length));
        const a = 1 - Math.pow(1 - sh.op, 1 / Math.min(n * core.length, 4));
        for (let i = n; i >= 1; i--) core.forEach(([ox, oy]) => G.text(null, str, x + sh.x * i / n + ox, y + sh.y * i / n + oy, size, weight, sh.color, align, a));
      } else {
        const pts = samples(sh.blur, sh.spread);
        const a = 1 - Math.pow(1 - sh.op, 1 / Math.max(1, pts.length * 0.45));
        pts.forEach(([ox, oy]) => G.text(null, str, x + sh.x + ox, y + sh.y + oy, size, weight, sh.color, align, a));
      }
    }
    G.text(id, str, x, y, size, weight, color, align, 1);
  }
  function R(id, x, y, w, h, r, fillSpec, shKey) {
    const sh = SH(shKey);
    if (sh) {
      const sw = Math.max(1, w * sh.sx + sh.spread * 2), shh = Math.max(1, h * sh.sy + sh.spread * 2);
      const rr = Math.max(0, r * Math.min(sh.sx, sh.sy) + sh.spread + sh.round);
      const cx = x + w / 2, cy = y + h / 2;
      if (sh.style === "long") {
        const n = longSteps(sh);
        const a = 1 - Math.pow(1 - sh.op, 1 / Math.min(n, 4));
        for (let i = n; i >= 1; i--) {
          const px = cx + sh.x * i / n, py = cy + sh.y * i / n;
          G.rect(null, px - sw / 2, py - shh / 2, sw, shh, rr, { solid: sh.color, alpha: a });
        }
      } else {
        const N = sh.blur < 0.5 ? 1 : 6;
        const a = 1 - Math.pow(1 - sh.op, 1 / N);
        for (let i = N; i >= 1; i--) {
          const e = N === 1 ? 0 : sh.blur * i / N;
          G.rect(null, cx + sh.x - sw / 2 - e, cy + sh.y - shh / 2 - e, sw + e * 2, shh + e * 2, rr + e, { solid: sh.color, alpha: a });
        }
      }
    }
    if (fillSpec.glass) { glass(x, y, w, h, r); if (id) G.group(id, x, y, w, h); }
    else G.rect(id, x, y, w, h, r, fillSpec);
  }
  function rim(x, y, w, h, r, lw, mult) {
    const pts = rimPath(x + lw / 2, y + lw / 2, w - lw, h - lw, Math.max(0, r - lw / 2), Math.max(1.2, (w + h) * 2 / 500));
    for (let i = 0; i < pts.length - 1; i++) {
      const al = rimAlpha(pts[i].a, D, mult);
      if (al > 0.01) G.line(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, lw, "#FFFFFF", al);
    }
  }
  // ---------- กระจกแบบ Liquid Glass (จำลอง) ----------
  function glass(x, y, w, h, r) {
    const W8 = "#FFFFFF";
    G.rect(null, x, y, w, h, r, { solid: D.glassTint, alpha: D.glassOpacity / 100 });
    const ss = Math.max(0.02, Math.min(1, D.glassSheenSize / 100));
    G.rect(null, x, y, w, h, r, { dir: "v", stops: [{ t: 0, c: W8, a: D.glassSheen / 100 }, { t: ss, c: W8, a: 0 }, { t: 1, c: W8, a: 0 }] });
    const is = Math.max(0.02, Math.min(1, D.glassInnerSize / 100));
    if (D.glassInner > 0) G.rect(null, x, y, w, h, r, { dir: "v", stops: [{ t: 0, c: "#000000", a: 0 }, { t: 1 - is, c: "#000000", a: 0 }, { t: 1, c: "#000000", a: D.glassInner / 100 }] });
    if (D.glassRim > 0) rim(x, y, w, h, r, D.glassRimW * sc, D.glassRim / 100);
  }
  const panelFill = () => D.panelGlass ? { glass: 1 } : D.panelGrad ? { stops: gradStops(D, "panel"), dir: D.panelDir } : { solid: D.panel };
  function card() {
    if (!P("CardOn")) return;
    const r = P("CardR") * sc;
    R("card", X(P("CardX")), Y(P("CardY")), X(P("CardW")), Y(P("CardH")), r, panelFill(), "shPanel");
  }

  function label() {
    T("label", S.heroName, X(P("LabelX")), Y(P("LabelY")), P("LabelSize") * sc, P("LabelWeight"), D.ink, P("LabelAlign"), "shText");
  }
  function date() {
    T("date", S.heroDate, X(P("DateX")), Y(P("DateY")), P("DateSize") * sc, P("DateWeight"),
      S.st.kind === "open" ? D.red : D.dateColor, P("DateAlign"), "shText");
  }
  function number() {
    const x = X(P("NumX")), y = Y(P("NumY")), N = P("NumSize") * sc, wgt = P("NumWeight"), al = P("NumAlign");
    const k = S.st.kind;
    if (k === "done") return T("num", "จบแล้ว ✓", x, y, N * 0.45, 600, D.ink, al, "shNum");
    if (k === "today") return T("num", "วันนี้!", x, y, N * 0.5, 600, D.red, al, "shNum");
    if (k === "last") return T("num", "วันสุดท้าย!", x, y, N * 0.45, 600, D.red, al, "shNum");
    const str = String(S.st.days);
    T("num", str, x, y, N, wgt, mainColor, al, "shNum");
    const U = P("UnitSize") * sc;
    if (P("UnitFollow")) {
      const w = G.measure(str, N, wgt);
      const left = al === "r" ? x - w : al === "c" ? x - w / 2 : x;
      const uy = y + 0.95 * N - 0.95 * U - P("UnitLift") * sc;
      T("unit", "วัน", left + w + P("UnitGap") * sc, uy, U, P("UnitWeight"), D.ink, "l", "shNum");
    } else {
      T("unit", "วัน", X(P("UnitX")), Y(P("UnitY")), U, P("UnitWeight"), D.ink, "l", "shNum");
    }
  }
  function bar() {
    const x = X(P("BarX")), y = Y(P("BarY")), w = X(P("BarW")), h = P("BarH") * sc;
    R("bar", x, y, w, h, h / 2, D.barGlass ? { glass: 1 } : { solid: D.track }, "shBar");
    if (S.progress > 0) G.rect(null, x, y, Math.max(h, w * S.progress), h, h / 2, { solid: mainColor });
  }
  function timeline() {
    const list = S.rest.slice(0, P("Count"));
    if (!list.length) return;
    const x = X(P("TlX")), y0 = Y(P("TlY")), w = X(P("TlW"));
    const nameS = P("ItemNameSize") * sc, dateS = P("ItemDateSize") * sc, numS = P("ItemNumSize") * sc, unitS = P("ItemUnitSize") * sc;
    const padX = P("PanelPadX") * sc, padY = P("PanelPadY") * sc, gap = P("ItemGap") * sc, rad = D.panelRadius * sc;
    const rowH = Math.max(nameS * 1.2 + dateS * 1.2, numS * 1.2);
    function row(e, top) {
      T(null, e.name, x + padX, top, nameS, P("ItemNameWeight"), D.ink, "l", "shText");
      T(null, S.dateLabel(e), x + padX, top + nameS * 1.2, dateS, 400, D.dateColor, "l", "shText");
      const right = x + w - padX;
      if (S.isOpen(e)) {
        T(null, "เปิดแล้ว", right, top + (rowH - numS * 0.9) / 2, numS * 0.75, P("ItemNumWeight"), D.red, "r", "shText");
        return;
      }
      const d = S.daysUntil(e.start);
      const ny = top + (rowH - numS * 1.2) / 2;
      const color = d <= D.itemUrgentDays ? D.red : D.ink;
      if (d === 0) return T(null, "วันนี้", right, ny, numS, P("ItemNumWeight"), D.red, "r", "shText");
      const uw = G.measure("วัน", unitS, P("ItemNumWeight"));
      T(null, "วัน", right, ny + 0.95 * numS - 0.95 * unitS, unitS, P("ItemNumWeight"), D.ink, "r", "shText");
      T(null, String(d), right - uw - 3 * sc, ny, numS, P("ItemNumWeight"), color, "r", "shText");
    }
    const h1 = rowH + padY * 2;
    R(null, x, y0, w, h1, rad, panelFill(), "shPanel");
    row(list[0], y0 + padY);
    let total = h1;
    if (list.length > 1) {
      const more = list.slice(1);
      const y2 = y0 + h1 + gap;
      const h2 = more.length * rowH + (more.length - 1) * (gap * 2 + 1) + padY * 2;
      R(null, x, y2, w, h2, rad, panelFill(), "shPanel");
      let top = y2 + padY;
      more.forEach((e, i) => {
        if (i) {
          G.rect(null, x + padX, top + gap, w - padX * 2, Math.max(0.5, 1 * sc), 0, { solid: D.line });
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
      return T("timer", k === "done" ? "จบแล้ว ✓" : "วันนี้!", x, y, size * 0.5, wgt, mainColor, "l", "shNum");
    }
    const left = S.st.target - S.now;
    const days = Math.max(0, Math.floor(left / DAY));
    G.timer("timer", x, y, size, wgt, mainColor, days > 0 ? `${days}:` : "", S.st.target.getTime() - days * DAY, SH("shNum"));
  }

  // ---------- กระจกทั้งตัว widget: ชั้นล่าง (สีกระจก + แสงวาว) อยู่ใต้เนื้อหา ----------
  const WR = D.wgRadius;
  if (D.wgOn) {
    if (D.wgOpacity > 0) G.rect(null, 0, 0, W, H, WR, { solid: D.wgTint, alpha: D.wgOpacity / 100 });
    const ss = Math.max(0.02, Math.min(1, D.wgSheenSize / 100));
    if (D.wgSheen > 0) G.rect(null, 0, 0, W, H, WR, { dir: "v", stops: [{ t: 0, c: "#FFFFFF", a: D.wgSheen / 100 }, { t: ss, c: "#FFFFFF", a: 0 }, { t: 1, c: "#FFFFFF", a: 0 }] });
  }
  card();
  if (fam === "small") { label(); number(); date(); bar(); }
  else if (fam === "medium") { label(); number(); date(); timeline(); }
  else if (fam === "mediumBar") { label(); date(); timer(); bar(); }
  else { label(); number(); date(); timeline(); }
  // ชั้นบน (เงามืดด้านใน + ขอบเรืองแสง) ทับขอบ widget
  if (D.wgOn) {
    const is = Math.max(0.02, Math.min(1, D.wgInnerSize / 100));
    if (D.wgInner > 0) G.rect(null, 0, 0, W, H, WR, { dir: "v", stops: [{ t: 0, c: "#000000", a: 0 }, { t: 1 - is, c: "#000000", a: 0 }, { t: 1, c: "#000000", a: D.wgInner / 100 }] });
    if (D.wgRim > 0) {
      rim(0.3, 0.3, W - 0.6, H - 0.6, Math.max(0, WR - 0.3), D.wgRimW, D.wgRim / 100);
    }
  }
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
  let bgSpec = { solid: "#FFFFFF" };
  const WEIGHTS = { 100: "ultraLight", 200: "thin", 300: "light", 400: "regular", 500: "medium", 600: "semibold", 700: "bold", 800: "heavy", 900: "black" };
  const wi = w => Math.max(0, Math.min(8, Math.round(w / 100) - 1));
  const font = (size, w) => Font[(WEIGHTS[(wi(w) + 1) * 100]) + "SystemFont"](size);
  // สี่เหลี่ยมมุมโค้ง สีเดียวหรือไล่สี (ไล่สีวาดทีละเส้นแล้วเว้าตามมุมโค้ง)
  function fillRound(x, y, w, h, r, f) {
    x *= s; y *= s; w *= s; h *= s; r = Math.max(0, Math.min(r * s, w / 2, h / 2));
    if (!f.stops) {
      const pth = new Path();
      pth.addRoundedRect(new Rect(x, y, w, h), r, r);
      ctx.addPath(pth);
      ctx.setFillColor(new Color(f.solid, f.alpha === undefined ? 1 : f.alpha));
      ctx.fillPath();
      return;
    }
    const vertical = f.dir === "v" || f.dir === "vr";
    const reverse = f.dir === "vr" || f.dir === "hr";
    const len = vertical ? h : w;
    const inset = i => {
      const d = i < r ? r - i : i > len - r ? i - (len - r) : 0;
      return d > 0 ? r - Math.sqrt(Math.max(0, r * r - d * d)) : 0;
    };
    for (let i = 0; i < len; i += 1) {
      let t = i / Math.max(1, len - 1);
      if (reverse) t = 1 - t;
      ctx.setFillColor(new Color(colorAt(f.stops, t), alphaAt(f.stops, t)));
      const k = inset(i);
      if (vertical) ctx.fillRect(new Rect(x + k, y + i, Math.max(0, w - k * 2), 1.4));
      else ctx.fillRect(new Rect(x + i, y + k, 1.4, Math.max(0, h - k * 2)));
    }
  }
  // ขอบเรืองแสง: สว่างด้านบน จางลงด้านล่าง (วาดทีละแถว)
  function ring(x, y, w, h, r, lw, color, aTop, aBot) {
    x *= s; y *= s; w *= s; h *= s; lw = Math.max(1, lw * s); r = Math.max(0, Math.min(r * s, w / 2, h / 2));
    const inset = i => { const d = i < r ? r - i : i > h - r ? i - (h - r) : 0; return d > 0 ? r - Math.sqrt(Math.max(0, r * r - d * d)) : 0; };
    for (let i = 0; i < h; i++) {
      const t = i / Math.max(1, h - 1);
      ctx.setFillColor(new Color(color, aTop + (aBot - aTop) * t));
      const k = inset(i);
      if (i < lw || i > h - lw) { ctx.fillRect(new Rect(x + k, y + i, Math.max(0, w - k * 2), 1.2)); continue; }
      const inner = Math.max(k, inset(Math.max(lw, Math.min(h - lw, i))) );
      const edge = Math.max(lw, (k > 0 ? lw * 1.4 : lw));
      ctx.fillRect(new Rect(x + k, y + i, edge, 1.2));
      ctx.fillRect(new Rect(x + w - k - edge, y + i, edge, 1.2));
    }
  }
  return {
    ring,
    line(x1, y1, x2, y2, lw, color, alpha) {
      const pth = new Path();
      pth.move(new Point(x1 * s, y1 * s));
      pth.addLine(new Point(x2 * s, y2 * s));
      ctx.addPath(pth);
      ctx.setStrokeColor(new Color(color, alpha));
      ctx.setLineWidth(lw * s);
      ctx.strokePath();
    },
    bg(spec) { bgSpec = spec; },
    rect(id, x, y, w, h, r, f) { fillRound(x, y, w, h, r, f); },
    group() {},
    measure(str, size, weight) {
      let w = 0;
      for (const ch of str) {
        if (/[0-9]/.test(ch)) w += D.emNum[wi(weight)][+ch] * size; // ความกว้างแยกทีละตัวเลข
        else if (ch === ":") w += 0.3 * size;
        else w += 0.55 * size;
      }
      if (str === "วัน") w = D.emWan[wi(weight)] * size;
      return w;
    },
    text(id, str, x, y, size, weight, color, align, alpha) {
      if (!str) return;
      ctx.setFont(font(size * s, weight));
      ctx.setTextColor(new Color(color, alpha === undefined ? 1 : alpha));
      const big = W * s * 2;
      let rx = x * s;
      if (align === "r") { ctx.setTextAlignedRight(); rx -= big; }
      else if (align === "c") { ctx.setTextAlignedCenter(); rx -= big / 2; }
      else ctx.setTextAlignedLeft();
      ctx.drawTextInRect(str, new Rect(rx, y * s, big, size * s * 1.6));
    },
    timer(id, x, y, size, weight, color, daysText, targetMs, sh) {
      overlays.push({ x, y, size, weight, color, daysText, target: new Date(targetMs), font, sh });
    },
    image: () => ctx.getImage(),
    background: () => bgSpec,
    overlays,
  };
}

function buildPainted(fam, PARAM) {
  const D = DESIGN;
  const [W, H] = widgetSize(fam);
  const G = scriptableG(W, H, D);
  const S = module.exports.paint(G, fam, W, H, Date.now(), PARAM, D);
  const w = new ListWidget();
  const bg = G.background();
  if (bg.stops) {
    const g = new LinearGradient();
    g.colors = bg.stops.map(x => new Color(x.c));
    g.locations = bg.stops.map(x => x.t);
    g.startPoint = new Point(bg.points[0][0], bg.points[0][1]);
    g.endPoint = new Point(bg.points[1][0], bg.points[1][1]);
    w.backgroundGradient = g;
  } else {
    w.backgroundColor = new Color(bg.solid);
  }
  w.setPadding(0, 0, 0, 0);
  // ภาพชิ้นส่วนทั้งหมด (พื้นใส) วางทับพื้นหลัง เต็มพื้นที่ widget
  const layer = w.addStack();
  layer.layoutVertically();
  layer.backgroundImage = G.image();
  const o = G.overlays[0];
  if (o) {
    // นาฬิกาที่วินาทีเดินจริง เป็นตัวหนังสือแยกวางทับภาพ
    layer.setPadding(Math.max(0, o.y), Math.max(0, o.x), 0, 0);
    const r = layer.addStack();
    r.layoutHorizontally();
    const style = t => {
      t.font = o.font(o.size, o.weight);
      t.textColor = new Color(o.color);
      t.lineLimit = 1;
      t.minimumScaleFactor = 0.5;
      if (o.sh) { t.shadowColor = new Color(o.sh.color, o.sh.op); t.shadowRadius = o.sh.blur; t.shadowOffset = new Point(o.sh.x, o.sh.y); }
    };
    if (o.daysText) style(r.addText(o.daysText));
    const d = r.addDate(o.target);
    d.applyTimerStyle();
    style(d);
    r.addSpacer();
  } else {
    const r = layer.addStack();
    r.addSpacer();
  }
  layer.addSpacer();
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
