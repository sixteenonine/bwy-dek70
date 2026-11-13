// ทดสอบ widget.js: รัน build() ทุกขนาด ทุก Parameter ทุกวันตลอดปฏิทิน + เช็ก events.csv
// ใช้: node test/run.js [widget.js] [events.csv] [--daily]
"use strict";
process.env.TZ = "Asia/Bangkok";
const fs = require("fs"), path = require("path");
const mock = require("./mock-scriptable.js");
const S = mock.state, RD = mock.RealDate;

const argv = process.argv.slice(2).filter(a => !a.startsWith("--"));
const DAILY = process.argv.includes("--daily");
const widgetPath = path.resolve(argv[0] || path.join(__dirname, "..", "widget.js"));
const csvPath = path.resolve(argv[1] || path.join(__dirname, "..", "events.csv"));
const src = fs.readFileSync(widgetPath, "utf8");
const csv = fs.readFileSync(csvPath, "utf8");

mock.install();
const M = mock.loadModule(src);
const errors = [];
const fail = m => { if (errors.length < 40) errors.push(m); else if (errors.length === 40) errors.push("… (มีอีก)"); };
const DAY = 86400000;
const ms = a => new RD(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0).getTime();
const stamp = t => { const d = new RD(t); const p = n => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };

// ---------- 1) events.csv ----------
const list = M.parseEventsCSV(csv);
const dataRows = csv.replace(/^﻿/, "").split(/\r?\n/).filter(l => l.trim()).length - 1;
if (!list) fail("events.csv อ่านไม่ได้เลย");
else {
  if (list.length !== dataRows) fail(`events.csv มี ${dataRows} แถว แต่อ่านได้ ${list.length} แถว (มีแถวที่วันที่ผิดรูปแบบ)`);
  const keys = new Set();
  list.forEach(e => {
    if (keys.has(e.key)) fail(`events.csv: key ซ้ำ "${e.key}"`);
    keys.add(e.key);
    if (ms(e.end) < ms(e.start)) fail(`events.csv: "${e.name}" วันจบมาก่อนวันเริ่ม`);
  });
  // ชุดสำรองในโค้ดต้องตรงกับ csv (ใช้ตอนเครื่องน้องโหลด csv ไม่ได้)
  const norm = e => [e.key, e.name, e.short, ms(e.start), ms(e.end), !!e.minor, !!e.estimate].join("|");
  const a = list.map(norm).join("\n"), b = M.EVENT_LIST.slice().sort((x, y) => ms(x.start) - ms(y.start)).map(norm).join("\n");
  if (a !== b) fail("EVENT_LIST (ชุดสำรองใน widget.js) ไม่ตรงกับ events.csv\n--- csv ---\n" + a + "\n--- โค้ด ---\n" + b);
}
const events = list || M.EVENT_LIST;

// ---------- 2) รัน build() ตลอดปฏิทิน ----------
const EVENTS_URL = (src.match(/EVENTS_URL\s*=\s*"([^"]+)"/) || [])[1];
if (!EVENTS_URL) fail("หา EVENTS_URL ใน widget.js ไม่เจอ");
const first = Math.min(...events.map(e => ms(e.start))), last = Math.max(...events.map(e => ms(e.end)));
const sod = t => { const d = new RD(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
const from = sod(first - 130 * DAY), to = sod(last + 30 * DAY);
const FAMS = ["small", "medium", "large", "extraLarge", "accessoryInline", "accessoryCircular", "accessoryRectangular"];
const keyParams = events.filter(e => !e.minor).map(e => e.key);
const PARAMS = ["", "bar", ...keyParams, ...keyParams.slice(0, 2).map(k => k + " bar"), "info", "nofx", "s1"];
const DEVICES = [[[393, 852, 3], false], [[820, 1180, 2], true], [[320, 568, 2], false]];
const BAD = /undefined|NaN|null|\[object|Infinity/;
let builds = 0;

async function one(t, fam, param, mode) {
  S.now = t; S.texts = [];
  S.net = mode === "offline" ? {} : { [EVENTS_URL]: { status: 200, body: csv } };
  const where = `${stamp(t)} ${fam} "${param}" ${S.screen[0]}x${S.screen[1]}${mode ? " (" + mode + ")" : ""}`;
  try {
    const w = await M.build(fam, param, { loader: 3 });
    builds++;
    if (!w) return fail(`${where}: build ไม่คืน widget`);
    const r = w.refreshAfterDate;
    if (!(r instanceof RD) || isNaN(r.getTime()) || r.getTime() <= t || r.getTime() > t + 61 * 60000) fail(`${where}: refreshAfterDate ผิด (${r})`);
    if (!w.url) fail(`${where}: ไม่มีลิงก์ตอนแตะ`);
    const bad = S.texts.find(x => BAD.test(x));
    if (bad) fail(`${where}: ข้อความแปลก "${bad}"`);
    if (!S.texts.length && fam !== "accessoryInline") fail(`${where}: widget ไม่มีข้อความเลย`);
  } catch (e) { fail(`${where}: ${e && e.stack ? e.stack.split("\n").slice(0, 2).join(" ") : e}`); }
}

(async () => {
  // จุดเวลาขอบของทุกเหตุการณ์ (ก่อน/หลัง เริ่มและจบ 1 นาที)
  const edges = new Set();
  events.forEach(e => [ms(e.start), ms(e.end)].forEach(x => [-60000, 0, 60000].forEach(d => edges.add(x + d))));
  for (let day = from; day <= to; day += DAY) {
    const d0 = sod(day + 3600000); // กันเพี้ยน
    for (const [screen, pad] of DEVICES) {
      S.screen = screen; S.pad = pad;
      const main = screen[0] === 393;
      for (const fam of FAMS) {
        if (fam === "extraLarge" && !pad) continue;
        await one(d0 + 12 * 3600000, fam, "", "");
        if (!main) continue;
        for (const p of PARAMS.slice(1)) await one(d0 + 12 * 3600000, fam, p, "");
        for (const off of [1000, 8 * 3600000 + 29 * 60000, DAY - 30000]) await one(d0 + off, fam, "", "");
      }
    }
  }
  S.screen = DEVICES[0][0]; S.pad = false;
  for (const t of edges) for (const fam of FAMS) for (const p of ["", "bar"]) await one(t, fam, p, "");
  // ไม่มีเน็ต + ไม่มี cache → ต้องใช้ชุดสำรองในโค้ดได้
  S.files.clear();
  for (let day = from; day <= to; day += 7 * DAY) for (const fam of FAMS) await one(day + 12 * 3600000, fam, "", "offline");

  // เมนูตอนรันในแอป
  S.net = { [EVENTS_URL]: { status: 200, body: csv } };
  for (const pad of [false, true]) for (let i = -1; i < 5; i++) {
    S.pad = pad; S.alertPick = i;
    try { await M.runInApp({ loader: 3 }); } catch (e) { if (!(i >= 0 && /undefined|not iterable/.test(String(e)))) fail(`runInApp ตัวเลือก ${i}: ${e}`); }
  }

  // ---------- 3) ตารางรายวัน (ตอนเที่ยง, ไม่ใส่ Parameter) ----------
  const rows = [];
  for (let day = from; day <= to; day += DAY) {
    const t = sod(day + 3600000) + 12 * 3600000;
    const st = M.makeState(t, "", M.DESIGN, events);
    const k = st.st.kind;
    const big = st.examNow ? "กำลังสอบ" : k === "wait" || k === "open" ? `${st.lead} ${st.st.days} วัน` : k === "prep" ? `${st.st.text} ${st.st.sub}` : k === "today" ? "วันนี้!" : "วันสุดท้าย!";
    if ((k === "wait") !== (st.lead === "อีก")) fail(`${stamp(t)}: คำนำ "อีก" ไม่ตรงกับสถานะ ${k}`);
    if (st.lead === "เหลือ" && (k !== "open" || st.examNow)) fail(`${stamp(t)}: คำนำ "เหลือ" ขึ้นผิดสถานะ`);
    const nxt = st.rest.slice(0, 2).map(e => e.name + (st.isOpen(e) ? " [กำลังเกิด]" : e.estimate ? " [ประมาณ]" : ` ${st.daysUntil(e.start)}ว`)).join(" · ");
    rows.push({ t, key: `${st.heroName}|${k}|${st.heroDate}|${st.urgent ? "แดง" : ""}`, line: `${stamp(t).slice(0, 10)}  ${st.heroName.padEnd(18)} ${big.padEnd(14)} ${st.heroDate.padEnd(26)} ${st.urgent ? "แดง" : "   "} bar ${(st.progress * 100).toFixed(0).padStart(3)}%  | ${nxt}` });
  }
  console.log("\nตารางรายวัน (แสดงเฉพาะวันที่สถานะเปลี่ยน ใส่ --daily เพื่อดูทุกวัน)");
  rows.forEach((r, i) => { if (DAILY || i === 0 || rows[i - 1].key !== r.key || i === rows.length - 1) console.log(r.line); });

  console.log(`\nไฟล์: ${path.basename(widgetPath)} v${M.version} | เหตุการณ์ ${events.length} รายการ | รัน build ${builds} ครั้ง`);
  if (errors.length) { console.log(`\n❌ ไม่ผ่าน ${errors.length} จุด`); errors.forEach(e => console.log(" - " + e)); process.exit(1); }
  console.log("✅ ผ่านทั้งหมด");
})();
