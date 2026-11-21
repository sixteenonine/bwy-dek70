// GET /stats?k=รหัสลับ  แดชบอร์ดสถิติของเจได (รหัสลับตั้งเป็นตัวแปร STATS_KEY ใน Cloudflare Pages)
// เลือกช่วงวันได้ด้วย &d=7 / 14 / 30 · ตัวเลขเทียบกับช่วงก่อนหน้าที่ยาวเท่ากัน
import { bkkDay, SCHEMA } from "../lib/stats.js";
import { LINKS } from "../lib/links.js"; // หน้ารวมลิงก์ + ลิงก์ย่อ (สร้างจาก links/links.json)

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmt = n => Number(n || 0).toLocaleString("en-US");
const APP = { tiktok: "TikTok", lemon8: "Lemon8", threads: "Threads", instagram: "Instagram", line: "LINE", facebook: "Facebook / Messenger", x: "X", google: "Google", links: "หน้ารวมลิงก์ (เปิดใน Safari / Chrome)", web: "เว็บอื่น", safari: "Safari (พิมพ์เอง / ไม่รู้ที่มา)", chrome: "Chrome", other: "อื่นๆ" };
const DEV = { iphone: "iPhone", ipad: "iPad", android: "Android (ติดตั้งไม่ได้)", computer: "คอม", other: "อื่นๆ" };
const STEP = { visit: "หน้าแรก", 1: "1 โหลด Scriptable", 2: "2 Copy โค้ด", 3: "3 เปิด Scriptable กด + และวางโค้ด", 4: "4 ตั้งชื่อ Dek70", 5: "5 เพิ่ม Widget", 6: "6 เลือก Dek70", done: "หน้าเสร็จ" };
const FAM = { "small:small": "Small", "medium:mediumbar": "Medium นับวินาที", "medium:medium": "Medium", "large:large": "Large", "extralarge:xl": "Extra Large", "extralarge:large": "Extra Large (แบบ Large)" };
const famName = k => FAM[k] || (k.endsWith(":none") ? k.split(":")[0] + " (ยังไม่เปิดใช้)" : k);
const TH_M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const thDate = d => `${+d.slice(8, 10)} ${TH_M[+d.slice(5, 7) - 1]}`;
// ลิงก์สำหรับส่งให้น้องๆ แยกตามช่องทาง (ป้าย ?src= บอกว่าคนมาจากไหน แม่นกว่าการเดาจากแอป)
const SITE = "https://bwy-widget.pages.dev/";
const SHARE = [["line", "LINE"], ["x", "X"], ["threads", "Threads"], ["lemon8", "Lemon8"], ["tiktok", "TikTok"], ["ig", "Instagram"]];
const WRITE_LIMIT = 100000; // D1 แผนฟรี: เขียนได้ 100,000 แถว/วัน (รีเซ็ต 07:00 เวลาไทย)

// icon เส้น (ไม่ใช้ emoji)
const ICON = {
  widget: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M15.5 4.8a3.3 3.3 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.4 3.5 5.2"/>',
  copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V6A2.5 2.5 0 0 0 13 3.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/>',
  install: '<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5M4 15.5v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2"/>',
  tap: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v3.5a3 3 0 0 1-3 3H7.5a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3H11"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
};
const ico = (k, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

const sum = rows => rows.reduce((a, r) => a + r.n, 0);
function group(rows, key) {
  const m = new Map();
  rows.forEach(r => { const k = key(r); m.set(k, (m.get(k) || 0) + r.n); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
// รายการแบบชื่อ + ตัวเลข แล้วมีแถบด้านล่าง
function bars(list, name = x => x) {
  if (!list.length) return `<p class="empty">ยังไม่มีข้อมูล</p>`;
  const max = Math.max(...list.map(x => x[1]), 1), all = list.reduce((a, x) => a + x[1], 0) || 1;
  return `<ul class="bars">${list.map(([k, n]) => `<li><span class="bl">${esc(name(k))}</span><span class="bn">${fmt(n)} <small>${Math.round(n / all * 100)}%</small></span><span class="track"><i style="width:${Math.max(1.5, n / max * 100).toFixed(1)}%"></i></span></li>`).join("")}</ul>`;
}
const card = (cls, title, html, { note = "", aside = "" } = {}) =>
  `<section class="card ${cls}"><header><h2>${title}</h2>${aside}</header>${html}${note ? `<p class="note">${note}</p>` : ""}</section>`;

// กราฟเส้นรายวัน 1 ตัวเลข (ไม่มีแกนคู่) ชี้/แตะเพื่อดูค่ารายวัน
const CW = 640, CH = 240, PL = 58, PR = 16, PT = 16, PB = 34;
function niceMax(m) { if (m <= 4) return 4; const p = Math.pow(10, Math.floor(Math.log10(m))), f = m / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
function lineChart(id, series, hidden) {
  const max = niceMax(Math.max(...series.map(p => p[1]), 0));
  const n = series.length, x = i => PL + (n < 2 ? (CW - PL - PR) / 2 : i * (CW - PL - PR) / (n - 1)), y = v => PT + (CH - PT - PB) * (1 - v / max);
  const xs = series.map((_, i) => +x(i).toFixed(1)), ys = series.map(p => +y(p[1]).toFixed(1));
  const path = xs.map((v, i) => (i ? "L" : "M") + v + " " + ys[i]).join("");
  const grid = [0, 0.25, 0.5, 0.75, 1].map(f => `<line class="gl" vector-effect="non-scaling-stroke" x1="${PL}" x2="${CW - PR}" y1="${y(max * f)}" y2="${y(max * f)}"/><text class="ax" x="${PL - 8}" y="${y(max * f) + 4}" text-anchor="end">${fmt(Math.round(max * f))}</text>`).join("");
  const ticks = [...new Set([0, Math.round((n - 1) / 2), n - 1])].map(i => `<text class="ax" x="${xs[i]}" y="${CH - 8}" text-anchor="${i === 0 ? "start" : i === n - 1 ? "end" : "middle"}">${thDate(series[i][0])}</text>`).join("");
  return `<div class="chart" id="${id}"${hidden ? " hidden" : ""} data-x="${esc(JSON.stringify(xs))}" data-y="${esc(JSON.stringify(ys))}" data-v="${esc(JSON.stringify(series.map(p => [thDate(p[0]), p[1]])))}">
<svg viewBox="0 0 ${CW} ${CH}" role="img" aria-label="กราฟรายวัน"><defs><linearGradient id="g-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ga"/><stop offset="1" class="gb"/></linearGradient></defs>${grid}<path class="area" fill="url(#g-${id})" d="${path}L${xs[n - 1]} ${y(0)}L${xs[0]} ${y(0)}Z"/><path class="line" vector-effect="non-scaling-stroke" d="${path}"/>
<circle class="end" cx="${xs[n - 1]}" cy="${ys[n - 1]}" r="4.5"/>${ticks}<line class="cross" vector-effect="non-scaling-stroke" x1="0" x2="0" y1="${PT}" y2="${y(0)}"/><circle class="dot" cx="0" cy="0" r="5"/><rect class="hit" x="0" y="0" width="${CW}" height="${CH}"/></svg>
<div class="tip" hidden></div></div>`;
}
// เกจครึ่งวงกลม (โควตา)
function gauge(pct) {
  const r = 80, len = Math.PI * r, v = Math.min(100, Math.max(0, pct));
  return `<svg class="gauge" viewBox="0 0 200 116" role="img" aria-label="ใช้โควตาไป ${v.toFixed(1)}%"><path class="gt" d="M20 100a80 80 0 0 1 160 0"/><path class="gv" d="M20 100a80 80 0 0 1 160 0" stroke-dasharray="${(len * v / 100).toFixed(1)} ${len.toFixed(1)}"/>
<text x="100" y="92" text-anchor="middle" class="gp">${v < 10 ? v.toFixed(1) : Math.round(v)}%</text></svg>`;
}
function delta(cur, prev) {
  if (!prev) return `<span class="delta flat">${cur ? "ใหม่" : "—"}</span>`;
  const p = Math.round((cur - prev) / prev * 100);
  return `<span class="delta">${p === 0 ? "" : ico(p > 0 ? "up" : "down")}${Math.abs(p)}%</span>`;
}

const CSS = `
@font-face{font-family:"Prompt";font-weight:400;src:url(/guide/fonts/prompt-thai-400.woff2) format("woff2");unicode-range:U+0E01-0E5B,U+200C-200D,U+25CC;font-display:swap}
@font-face{font-family:"Prompt";font-weight:600;src:url(/guide/fonts/prompt-thai-600.woff2) format("woff2");unicode-range:U+0E01-0E5B,U+200C-200D,U+25CC;font-display:swap}
@font-face{font-family:"Prompt";font-weight:400;src:url(/guide/fonts/prompt-latin-400.woff2) format("woff2");unicode-range:U+0000-00FF,U+2000-206F,U+2190-2193;font-display:swap}
@font-face{font-family:"Prompt";font-weight:600;src:url(/guide/fonts/prompt-latin-600.woff2) format("woff2");unicode-range:U+0000-00FF,U+2000-206F,U+2190-2193;font-display:swap}
:root{color-scheme:light;--bg:#F4F4F5;--card:#FFFFFF;--soft:#F7F7F8;--line:#EAEAEC;--ink:#0B0B0C;--sub:#6B6B70;--mute:#A3A3A8;--track:#EFEFF1;--shadow:0 1px 2px rgba(0,0,0,.04),0 12px 32px -18px rgba(0,0,0,.18)}
@media (prefers-color-scheme:dark){:root{color-scheme:dark;--bg:#0F0F11;--card:#1A1A1D;--soft:#222226;--line:#2B2B30;--ink:#F4F4F6;--sub:#A3A3AA;--mute:#6E6E76;--track:#2A2A2F;--shadow:0 1px 0 rgba(255,255,255,.03) inset}}
*{box-sizing:border-box}html{background:var(--bg)}body{margin:0;color:var(--ink);font:15px/1.5 "Prompt",-apple-system,BlinkMacSystemFont,"Sukhumvit Set","Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:1180px;margin:0 auto;padding:22px 16px 56px}
.top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px}.brand{display:flex;align-items:center;gap:10px;font-weight:600}
.mark{width:34px;height:34px;border-radius:10px;background:var(--ink);color:var(--bg);display:grid;place-items:center;font-weight:600;font-size:15px;letter-spacing:-.02em}
.crumb{color:var(--sub);font-weight:400}.top .sp{flex:1}
.seg{display:inline-flex;flex-wrap:wrap;max-width:100%;padding:4px;gap:2px;border-radius:12px;background:var(--card);border:1px solid var(--line)}
.seg a,.seg button{border:0;background:none;color:var(--sub);font:inherit;font-size:.86rem;padding:6px 12px;border-radius:9px;text-decoration:none;cursor:pointer;white-space:nowrap}
.seg .on{background:var(--ink);color:var(--bg);font-weight:600}
h1{font-size:1.7rem;line-height:1.2;margin:0;font-weight:600;letter-spacing:-.01em}.lead{color:var(--sub);margin:4px 0 0;font-size:.9rem}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:18px 0 12px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;box-shadow:var(--shadow);display:grid;grid-template-columns:1fr auto;gap:2px 10px;align-items:start}
.kpi .k{color:var(--sub);font-size:.84rem}.kpi .v{font-size:1.85rem;line-height:1.15;font-weight:600;font-variant-numeric:tabular-nums;grid-column:1}
.kpi .tile{grid-column:2;grid-row:1/span 2;width:40px;height:40px;border-radius:12px;background:var(--soft);border:1px solid var(--line);display:grid;place-items:center}
.kpi .tile .ico{width:20px;height:20px}.kpi .s{grid-column:1/-1;color:var(--mute);font-size:.78rem;display:flex;gap:6px;align-items:center}
.ico{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.delta{display:inline-flex;align-items:center;gap:2px;color:var(--ink);font-weight:600;font-size:.78rem;padding:1px 7px;border-radius:999px;background:var(--soft);border:1px solid var(--line)}.delta .ico{width:12px;height:12px;stroke-width:2.4}.delta.flat{color:var(--sub);font-weight:400}
.grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:18px;box-shadow:var(--shadow);min-width:0}
.card header{display:flex;align-items:center;gap:10px;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap}.card h2{font-size:1rem;margin:0;font-weight:600}
.s4{grid-column:span 4}.s5{grid-column:span 5}.s7{grid-column:span 7}.s8{grid-column:span 8}.s12{grid-column:span 12}
.minis{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:12px;align-items:start}
@media (max-width:900px){.grid>*{grid-column:1/-1}}
.note{color:var(--mute);font-size:.78rem;margin:12px 0 0}.empty{color:var(--sub);font-size:.88rem;margin:4px 0}
.bars{list-style:none;margin:0;padding:0;display:grid;gap:12px}.bars li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px 10px;font-size:.9rem}
.bl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bn{font-variant-numeric:tabular-nums;font-weight:600;text-align:right}.bn small{color:var(--mute);font-weight:400;margin-left:4px}
.track{grid-column:1/-1;height:6px;border-radius:3px;background:var(--track);overflow:hidden}.track i{display:block;height:100%;border-radius:3px;background:var(--ink)}
.chart{position:relative}.chart svg{display:block;width:100%;height:auto;overflow:visible}
.gl{stroke:var(--line);stroke-width:1}.ax{fill:var(--mute);font-size:11px;font-family:inherit}
.line{fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-linecap:round}.ga{stop-color:var(--ink);stop-opacity:.12}.gb{stop-color:var(--ink);stop-opacity:0}
.end{fill:var(--ink);stroke:var(--card);stroke-width:2}.cross{stroke:var(--mute);stroke-dasharray:3 3;opacity:0}.dot{fill:var(--card);stroke:var(--ink);stroke-width:2;opacity:0}
.chart.hover .cross,.chart.hover .dot{opacity:1}.hit{fill:transparent;cursor:crosshair;touch-action:pan-y}
@media (max-width:600px){.ax{font-size:20px}.end{r:7px}.dot{r:8px}}
.tip{position:absolute;top:0;transform:translateX(-50%);box-shadow:0 6px 16px -6px rgba(0,0,0,.35);background:var(--ink);color:var(--bg);font-size:.78rem;padding:5px 9px;border-radius:8px;white-space:nowrap;pointer-events:none}.tip b{font-size:.9rem;margin-right:4px}
details.table{margin-top:10px}details.table summary{cursor:pointer;color:var(--sub);font-size:.84rem}
table{width:100%;border-collapse:collapse;font-size:.86rem;font-variant-numeric:tabular-nums}th,td{padding:8px 6px;border-bottom:1px solid var(--line);text-align:right;white-space:nowrap}th:first-child,td:first-child{text-align:left}th{color:var(--sub);font-weight:400;font-size:.8rem}tr:last-child td{border-bottom:0}
.scroll{overflow-x:auto;margin:0 -4px;padding:0 4px}
.wrap1 td:first-child{white-space:normal;min-width:8.5em;line-height:1.35}
.fun{display:grid;grid-template-columns:minmax(120px,1.2fr) minmax(0,2fr) 64px 48px;gap:10px;align-items:center;padding:7px 0;font-size:.88rem;border-bottom:1px solid var(--line)}.fun:last-of-type{border-bottom:0}
.fun .track{grid-column:auto;height:10px;border-radius:5px}.fun .fn{text-align:right;font-weight:600;font-variant-numeric:tabular-nums}.fun .fp{text-align:right;color:var(--sub);font-variant-numeric:tabular-nums}
.fun .dr{grid-column:1/-1;margin-top:-6px;color:var(--mute);font-size:.75rem;padding-left:0}
@media (max-width:520px){.fun{grid-template-columns:minmax(0,1fr) 56px 42px}.fun .track{grid-column:1/-1;grid-row:2}}
.gwrap{display:grid;place-items:center;padding:4px 0 0}.gauge{width:min(240px,100%)}.gt,.gv{fill:none;stroke-width:16;stroke-linecap:round}.gt{stroke:var(--track)}.gv{stroke:var(--ink)}.gp{fill:var(--ink);font-size:30px;font-weight:600;font-family:inherit}
.gsub{text-align:center;color:var(--sub);font-size:.86rem;margin:2px 0 0}.gsub b{color:var(--ink)}
.link{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)}.link:last-of-type{border-bottom:0}
.link b{font-size:.92rem;font-weight:600}.link b small{color:var(--mute);font-size:.78rem;font-weight:400;margin-left:6px}
.link code{grid-column:1;min-width:0;overflow-wrap:anywhere;font:12px ui-monospace,Menlo,monospace;color:var(--sub);-webkit-user-select:all;user-select:all}
.link button{grid-column:2;grid-row:1/span 2;border:1px solid var(--line);border-radius:10px;padding:7px 14px;background:var(--soft);color:var(--ink);font:inherit;font-weight:600;font-size:.82rem;cursor:pointer;white-space:nowrap}
.link button.done{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.views{display:flex;gap:4px;padding:5px;margin:0 0 18px;border-radius:16px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow)}
.views button{flex:1;min-width:0;border:0;background:none;color:var(--sub);font:inherit;font-weight:600;font-size:.98rem;padding:10px 12px;border-radius:12px;cursor:pointer}
.views button.on{background:var(--ink);color:var(--bg)}
.s6{grid-column:span 6}
.foot{color:var(--mute);font-size:.78rem;margin-top:22px;text-align:center}
`;

// ชี้/แตะกราฟ = ขึ้นค่าของวันนั้น, แท็บสลับกราฟ, ปุ่ม Copy ลิงก์ (ไม่ใช้ template literal ในนี้ เพราะทั้งก้อนอยู่ใน template ของหน้า)
const JS = `
document.querySelectorAll(".chart").forEach(function (c) {
  var xs = JSON.parse(c.dataset.x), ys = JSON.parse(c.dataset.y), vs = JSON.parse(c.dataset.v);
  var svg = c.querySelector("svg"), cross = c.querySelector(".cross"), dot = c.querySelector(".dot"), tip = c.querySelector(".tip");
  function move(e) {
    var r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * ${CW}, i = 0;
    xs.forEach(function (x, j) { if (Math.abs(x - vx) < Math.abs(xs[i] - vx)) i = j; });
    cross.setAttribute("x1", xs[i]); cross.setAttribute("x2", xs[i]); dot.setAttribute("cx", xs[i]); dot.setAttribute("cy", ys[i]);
    tip.innerHTML = "<b>" + vs[i][1].toLocaleString("en-US") + "</b>" + vs[i][0]; tip.hidden = false;
    var py = ys[i] / ${CH} * r.height; // ป้ายอยู่เหนือจุด ถ้าที่ไม่พอให้อยู่ใต้จุด
    tip.style.left = Math.min(88, Math.max(12, xs[i] / ${CW} * 100)) + "%"; tip.style.top = (py > 46 ? py - 42 : py + 14) + "px"; c.classList.add("hover");
  }
  svg.addEventListener("pointermove", move); svg.addEventListener("pointerdown", move);
  svg.addEventListener("pointerleave", function (e) { if (e.pointerType !== "mouse") return; c.classList.remove("hover"); tip.hidden = true; }); // แตะบนมือถือ: ค่าค้างไว้ให้อ่าน
});
document.querySelectorAll("[data-tab]").forEach(function (b) {
  b.addEventListener("click", function () {
    var box = b.closest(".card");
    box.querySelectorAll("[data-tab]").forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
    box.querySelectorAll(".chart").forEach(function (c) { c.hidden = c.id !== b.dataset.tab; });
  });
});
// แท็บใหญ่ Widget / หน้ารวมลิงก์ (จำไว้ในลิงก์ &v=links ให้กดเปลี่ยนช่วงวันแล้วยังอยู่แท็บเดิม)
document.querySelectorAll("[data-view]").forEach(function (b) {
  b.addEventListener("click", function () {
    var v = b.dataset.view, q = function (u) { return u.replace(/&v=links/, "") + (v === "links" ? "&v=links" : ""); };
    document.querySelectorAll("[data-view]").forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
    document.querySelectorAll(".view").forEach(function (s) { s.hidden = s.id !== "v-" + v; });
    document.querySelectorAll("a[data-d]").forEach(function (a) { a.setAttribute("href", q(a.getAttribute("href"))); });
    try { history.replaceState(null, "", location.pathname + q(location.search)); } catch (e) {}
  });
});
document.querySelectorAll(".link button").forEach(function (b) {
  b.addEventListener("click", function () {
    var done = function (t) { b.textContent = t; b.classList.add("done"); setTimeout(function () { b.textContent = "Copy"; b.classList.remove("done"); }, 1600); };
    navigator.clipboard.writeText(b.dataset.url).then(function () { done("Copied!"); }, function () { getSelection().selectAllChildren(b.parentNode.querySelector("code")); done("กดค้างเพื่อ Copy"); });
  });
});`;

function page(body) {
  return new Response(`<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer"><title>สถิติ BearWithYou</title><style>${CSS}</style></head>
<body><main>${body}</main><script>${JS}</script></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}
const topbar = right => `<div class="top"><div class="brand"><span class="mark" aria-hidden="true">B</span>BearWithYou <span class="crumb">/ สถิติ</span></div><span class="sp"></span>${right || ""}</div>`;

// แท็บ "หน้ารวมลิงก์" (bearwithyou.pages.dev): hub k1 = home / home:<ป้าย> (เปิดหน้า) หรือ id ปุ่ม (กด), k2 = แอป · link k1 = ชื่อลิงก์ย่อ
function linksView({ of, perDay, prevSum, dayList, today, days, kpi, quota }) {
  const isOpen = r => r.k1 === "home" || r.k1.startsWith("home:");
  const hub = of("hub"), opens = hub.filter(isOpen), clicks = hub.filter(r => !isOpen(r)), shorts = of("link");
  const opened = sum(opens);
  const site = LINKS.site, host = site.replace("https://", "");
  const srcOf = r => r.k1.slice(5);
  const kpis = `<div class="kpis">
${kpi("users", "เครื่องที่เปิดหน้ารวมลิงก์", opened, prevSum("hub", true), `เทียบ ${days} วันก่อน`)}
${kpi("tap", "กดปุ่ม", sum(clicks), prevSum("hub", false), opened ? `เฉลี่ย ${(sum(clicks) / opened).toFixed(2)} ปุ่มต่อเครื่อง` : `เทียบ ${days} วันก่อน`)}
${kpi("link", "เปิดลิงก์ย่อ", sum(shorts), prevSum("link"), `เทียบ ${days} วันก่อน`)}
</div>`;
  const CH = [["c-hub", "เปิดหน้า", d => perDay("hub", d, 1)], ["c-click", "กดปุ่ม", d => perDay("hub", d, 0)], ["c-short", "ลิงก์ย่อ", d => perDay("link", d)]];
  const tabs = `<div class="seg" role="group" aria-label="เลือกกราฟ">${CH.map(([id, name], i) => `<button type="button" data-tab="${id}" aria-pressed="${!i}" class="${i ? "" : "on"}">${name}</button>`).join("")}</div>`;
  const charts = CH.map(([id, , at], i) => lineChart(id, dayList.map(d => [d, at(d)]), i > 0)).join("");
  const table = `<details class="table"><summary>ดูเป็นตาราง</summary><div class="scroll"><table><tr><th>วัน</th>${CH.map(c => `<th>${c[1]}</th>`).join("")}</tr>${dayList.slice().reverse().map(d => `<tr><td>${thDate(d)}${d === today ? " (วันนี้)" : ""}</td>${CH.map(c => `<td>${fmt(c[2](d))}</td>`).join("")}</tr>`).join("")}</table></div></details>`;

  // มาจากลิงก์ไหน (/tt /ig ...)
  const entryTitle = new Map(LINKS.entry.map(e => [e.name, e.title]));
  const srcName = s => (!s ? `${host}/ (ไม่ติดป้าย)` : entryTitle.has(s) ? `/${s} ${entryTitle.get(s)}` : `?src=${s}`);

  // กดปุ่มไหน แยกแอป (คอลัมน์ = แอปที่เปิดหน้ามากสุด 4 อันดับ ที่เหลือรวมเป็น อื่นๆ)
  const apps = group(hub, r => r.k2).slice(0, 4).map(x => x[0]);
  const cells = list => [...apps.map(a => sum(list.filter(r => r.k2 === a))), sum(list.filter(r => !apps.includes(r.k2)))].map(n => `<td>${fmt(n)}</td>`).join("");
  const titles = new Map(LINKS.buttons.map(b => [b.id, b.title]));
  const ids = [...new Set([...LINKS.buttons.map(b => b.id), ...clicks.map(r => r.k1)])].map(id => [id, clicks.filter(r => r.k1 === id)]).sort((a, b) => sum(b[1]) - sum(a[1]));
  const btnTable = `<div class="scroll"><table class="wrap1"><tr><th>ปุ่ม</th><th>กด</th><th>ต่อการเปิด</th>${apps.map(a => `<th>${esc(APP[a] || a)}</th>`).join("")}<th>อื่นๆ</th></tr>
<tr><td><b>เปิดหน้า</b></td><td><b>${fmt(opened)}</b></td><td>—</td>${cells(opens)}</tr>
${ids.map(([id, list]) => `<tr><td>${esc(titles.get(id) || id)}</td><td>${fmt(sum(list))}</td><td>${opened ? Math.round(sum(list) / opened * 100) + "%" : "—"}</td>${cells(list)}</tr>`).join("")}</table></div>`;

  // ลิงก์ให้กด Copy
  const topApp = list => { const g = group(list, r => r.k2)[0]; return g ? ` · ส่วนใหญ่จาก ${esc(APP[g[0]] || g[0])}` : ""; };
  const row = (name, link, list, verb) => `<div class="link"><b>${esc(name)}<small>${verb} ${fmt(sum(list))} ครั้ง${topApp(list)}</small></b><button type="button" data-url="${esc(link)}" aria-label="Copy ลิงก์ ${esc(name)}">Copy</button><code>${esc(link.replace("https://", ""))}</code></div>`;
  const entryLinks = LINKS.entry.map(e => row(e.title, `${site}/${e.name}`, opens.filter(r => srcOf(r) === e.name), "เปิด")).join("") + row("ไม่ติดป้าย", `${site}/`, opens.filter(r => !srcOf(r)), "เปิด");
  const shortNames = [...new Set([...LINKS.short.map(x => x.name), ...shorts.map(r => r.k1)])];
  const shortLinks = shortNames.map(n => [n, shorts.filter(r => r.k1 === n)]).sort((a, b) => sum(b[1]) - sum(a[1])).map(([n, list]) => row("/" + n, `${site}/${n}`, list, "เปิด")).join("") || `<p class="empty">ยังไม่มีลิงก์ย่อ</p>`;

  return `${kpis}
<div class="grid">
${card("s8", "รายวัน", charts + table, { aside: tabs })}
${card("s4", "มาจากลิงก์ไหน", bars(group(opens, srcOf), srcName), { note: "นับจากลิงก์ที่แปะไว้แต่ละที่ (การ์ด ลิงก์สำหรับแปะ bio)" })}
${card("s8", "กดปุ่มไหน", btnTable, { note: "นับเครื่องละไม่เกิน 1 ครั้งต่อปุ่มต่อวัน · แยกแอปจากเบราว์เซอร์ในแอปที่เปิดหน้า · ต่อการเปิด = เครื่องที่กดปุ่มนั้นเทียบกับเครื่องที่เปิดหน้า (เครื่องเดียวกดหลายปุ่มนับทุกปุ่ม)" })}
${card("s4", "มาจากแอปไหน", bars(group(opens, r => r.k2), a => APP[a] || a), { note: "ดูจากเบราว์เซอร์ในแอปที่เปิดลิงก์ ถ้าเปิดผ่าน Safari ตรงๆ จะนับเป็น Safari" })}
${card("s4", "ลิงก์สำหรับแปะ bio", entryLinks, { note: `หน้าเดียวกันทุกลิงก์ แค่บอกสถิติว่ามาจากไหน · นับ ${days} วันล่าสุด` })}
${card("s4", "ลิงก์ย่อ", shortLinks, { note: `เปิดแล้วพาไปปลายทางทันที · นับเครื่องละไม่เกิน 1 ครั้งต่อลิงก์ต่อวัน · ${days} วันล่าสุด` })}
${quota}
</div>`;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const key = env.STATS_KEY || "";
  if (key.length < 8 || url.searchParams.get("k") !== key) return new Response("Not found", { status: 404 });
  if (!env.DB) return page(`${topbar()}<h1>ภาพรวม</h1><p class="lead">ยังไม่ได้ผูกฐานข้อมูล D1 ชื่อ DB กับโปรเจกต์นี้ (ดู RUNBOOK.md หัวข้อ "สถิติ")</p>`);
  const days = [7, 14, 30].includes(+url.searchParams.get("d")) ? +url.searchParams.get("d") : 7;
  const ago = i => bkkDay(Date.now() - i * 864e5);
  const today = ago(0), yesterday = ago(1), from = ago(days - 1), prevFrom = ago(days * 2 - 1);
  // ให้ D1 รวมตัวเลขให้ (GROUP BY) Function ได้แค่ผลรวมไม่กี่ร้อยแถว ไม่ต้องไล่ทุกแถวเอง
  // (ถ้าดึงทุกแถวมารวมใน JS ช่วง 30 วันใช้ CPU เกินเพดาน 10 ms ของแผนฟรี) · ส่งทีเดียว 4 คำสั่ง (batch)
  const OPEN = "(kind = 'hub' AND (k1 = 'home' OR k1 LIKE 'home:%'))"; // เปิดหน้ารวมลิงก์ (ไม่ใช่กดปุ่ม)
  const q = (sql, ...a) => env.DB.prepare(sql).bind(...a);
  let all = [], prevRows = [], dayRows = [], activeRows = [];
  try {
    [all, prevRows, dayRows, activeRows] = (await env.DB.batch([
      q("SELECT kind, k1, k2, SUM(n) AS n FROM daily WHERE day >= ?1 GROUP BY kind, k1, k2", from),
      q(`SELECT kind, ${OPEN} AS o, SUM(n) AS n FROM daily WHERE day >= ?1 AND day < ?2 GROUP BY kind, o`, prevFrom, from),
      q(`SELECT day, kind, ${OPEN} AS o, SUM(n) AS n FROM daily WHERE day >= ?1 GROUP BY day, kind, o`, from),
      q("SELECT day, k1, k2, SUM(n) AS n FROM daily WHERE kind = 'active' AND day >= ?1 GROUP BY day, k1, k2", yesterday),
    ])).map(r => (r && r.results) || []);
  } catch (e) { if (/no such table/i.test(String(e && e.message || e))) await env.DB.prepare(SCHEMA).run(); else throw e; }
  const byKind = new Map();
  for (const r of all) { const l = byKind.get(r.kind); if (l) l.push(r); else byKind.set(r.kind, [r]); }
  const of = kind => byKind.get(kind) || [];
  const daily = new Map();
  for (const r of dayRows) { const k = `${r.kind}|${r.o ? 1 : 0}|${r.day}`; daily.set(k, (daily.get(k) || 0) + r.n); }
  const perDay = (kind, d, o = 0) => daily.get(`${kind}|${o}|${d}`) || 0; // ยอดของชนิดนั้นในวันนั้น
  const prevSum = (kind, o) => sum(prevRows.filter(r => r.kind === kind && (o === undefined || Boolean(r.o) === o)));
  const visits = of("visit"), steps = of("step"), copies = of("copy");
  const latest = perDay("active", yesterday) ? yesterday : today, latestName = latest === today ? "วันนี้" : "เมื่อวาน";
  const live = activeRows.filter(r => r.day === latest);
  const part = (s, i) => String(s).split(":")[i] || "-";
  const dayList = Array.from({ length: days }, (_, i) => ago(days - 1 - i)); // เก่า → ใหม่

  // การ์ดตัวเลขหลัก (เทียบกับช่วงก่อนหน้า, Widget ใช้งานเทียบวันก่อนหน้า)
  const activeNow = perDay("active", latest), activeBefore = perDay("active", latest === today ? yesterday : ago(2));
  const kpi = (icon, label, value, prev, sub) => `<div class="kpi"><span class="k">${label}</span><span class="v">${fmt(value)}</span><span class="tile">${ico(icon)}</span><span class="s">${delta(value, prev)}${sub}</span></div>`;
  const kpis = `<div class="kpis">
${kpi("widget", "Widget ใช้งานจริง", activeNow, activeBefore, latest === today ? "วันนี้ (ยังนับไม่ครบวัน)" : "เมื่อวาน เทียบวันก่อน")}
${kpi("users", "เครื่องที่เปิดหน้าติดตั้ง", sum(visits), prevSum("visit"), `เทียบ ${days} วันก่อน`)}
${kpi("copy", "กด Copy โค้ด", sum(copies), prevSum("copy"), `เทียบ ${days} วันก่อน`)}
${kpi("install", "เครื่องที่ติดตั้งใหม่", sum(of("new")), prevSum("new"), "Widget ทำงานครั้งแรก")}
${kpi("tap", "แตะ Widget ไป Drive", sum(of("tap")), prevSum("tap"), `เทียบ ${days} วันก่อน`)}
</div>`;

  // กราฟรายวัน (แท็บละ 1 ตัวเลข)
  const CHARTS = [["c-active", "Widget ใช้งาน", "active"], ["c-visit", "เปิดหน้า", "visit"], ["c-new", "ติดตั้งใหม่", "new"], ["c-tap", "แตะไป Drive", "tap"]];
  const tabs = `<div class="seg" role="group" aria-label="เลือกกราฟ">${CHARTS.map(([id, name], i) => `<button type="button" data-tab="${id}" aria-pressed="${!i}" class="${i ? "" : "on"}">${name}</button>`).join("")}</div>`;
  const charts = CHARTS.map(([id, , kind], i) => lineChart(id, dayList.map(d => [d, perDay(kind, d)]), i > 0)).join("");
  const dailyTable = `<details class="table"><summary>ดูเป็นตาราง</summary><div class="scroll"><table><tr><th>วัน</th><th>Widget ใช้งาน</th><th>เปิดหน้า</th><th>Copy</th><th>ติดตั้งใหม่</th><th>แตะไป Drive</th></tr>${dayList.slice().reverse().map(d => `<tr><td>${thDate(d)}${d === today ? " (วันนี้)" : ""}</td>${["active", "visit", "copy", "new", "tap"].map(k => `<td>${fmt(perDay(k, d))}</td>`).join("")}</tr>`).join("")}</table></div></details>`;

  // หลุดขั้นไหน (หน้าแรก = จำนวนคนเปิดหน้า)
  const reach = k => (k === "visit" ? sum(visits) : sum(steps.filter(r => r.k1 === k)));
  const order = ["visit", "1", "2", "3", "4", "5", "6", "done"], base = reach("visit") || 1;
  const funnel = order.map((k, i) => {
    const n = reach(k), prev = i ? reach(order[i - 1]) : n, drop = i && prev ? Math.round((1 - n / prev) * 100) : 0;
    return `<div class="fun"><span>${esc(STEP[k])}</span><span class="track"><i style="width:${Math.max(1.5, n / base * 100).toFixed(1)}%"></i></span><span class="fn">${fmt(n)}</span><span class="fp">${Math.round(n / base * 100)}%</span>${drop > 0 ? `<span class="dr">หลุดจากขั้นก่อน ${drop}%${k === "2" ? ` · กด Copy ${fmt(sum(copies))} ครั้ง` : ""}</span>` : ""}</div>`;
  }).join("");

  // แต่ละแอป: เข้าเว็บ → กด Copy → ถึงหน้าเสร็จ
  const appRows = group(visits, r => r.k1).map(([a, n]) => {
    const c = sum(copies.filter(r => r.k2 === a)), d = sum(steps.filter(r => r.k1 === "done" && r.k2 === a));
    return `<tr><td>${esc(APP[a] || a)}</td><td>${fmt(n)}</td><td>${fmt(c)}</td><td>${fmt(d)}</td><td>${Math.round(d / (n || 1) * 100)}%</td></tr>`;
  }).join("");

  const links = SHARE.map(([src, name]) => `<div class="link"><b>${name}<small>เข้ามา ${fmt(sum(of("src").filter(r => r.k1 === src)))} คน</small></b><button type="button" data-url="${SITE}?src=${src}" aria-label="Copy ลิงก์ ${name}">Copy</button><code>${SITE.replace("https://", "")}?src=${src}</code></div>`).join("");

  // โควตา: ตาราง WITHOUT ROWID บวกเลข 1 ครั้ง = เขียน 1 แถว ผลรวมของวันนี้จึงเท่ากับจำนวนแถวที่เขียนไป
  const writes = sum(dayRows.filter(r => r.day === today));

  const extra = [...group(of("fold"), r => r.k1).map(([k, n]) => [k === "why" ? "กล่อง ทำไมต้องโหลด Scriptable?" : k === "code" ? "กล่อง โค้ดนี้ปลอดภัยไหม?" : k, n]),
    ...group(steps.filter(r => ["theme", "options", "faq"].includes(r.k1)), r => r.k1).map(([k, n]) => [{ theme: "หน้า เปลี่ยนธีมสี", options: "หน้า ปรับแต่งด้วย Parameter", faq: "หน้า คำถามที่เจอบ่อย" }[k], n]),
    ["กดปุ่ม App Store", sum(of("appstore"))], ["เปิดสคริปต์ในแอป Scriptable", sum(of("app"))], ["เปลี่ยนธีมในแอป", sum(of("theme"))]].filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);

  const view = url.searchParams.get("v") === "links" ? "links" : "widget";
  const range = `<nav class="seg" aria-label="ช่วงเวลา">${[7, 14, 30].map(d => `<a class="${d === days ? "on" : ""}" data-d="${d}" href="?k=${encodeURIComponent(key)}&d=${d}${view === "links" ? "&v=links" : ""}">${d} วัน</a>`).join("")}</nav>`;
  const quota = card("s4", "ใช้โควตาฟรีวันนี้", `<div class="gwrap">${gauge(writes / WRITE_LIMIT * 100)}</div><p class="gsub">เขียน D1 <b>${fmt(writes)}</b> / 100,000 แถว</p>`, { note: "รวม Widget และหน้ารวมลิงก์ · ประมาณการ (Cloudflare รีเซ็ต 07:00 เวลาไทย) เกิน 100% = หยุดนับถึงรอบถัดไป Widget และหน้าเว็บยังใช้ได้ปกติ" });
  const lead = `<p class="lead">${thDate(from)} – ${thDate(today)} ${today.slice(0, 4)} (เวลาไทย) · ตัวเลขรวมแบบไม่ระบุตัวตน</p>`;
  const views = `<div class="views" role="tablist" aria-label="เลือกสถิติ">${[["widget", "Widget"], ["links", "หน้ารวมลิงก์"]].map(([v, name]) => `<button type="button" role="tab" data-view="${v}" aria-selected="${v === view}" class="${v === view ? "on" : ""}">${name}</button>`).join("")}</div>`;
  return page(`${topbar(range)}
${views}
<section class="view" id="v-widget"${view === "widget" ? "" : " hidden"}>
<h1>Widget</h1>${lead}
${kpis}
<div class="grid">
${card("s8", "รายวัน", charts + dailyTable, { aside: tabs, note: "Widget ใช้งาน = Widget แต่ละแบบในแต่ละเครื่องส่งสัญญาณวันละครั้ง (เครื่องเดียววาง Small สองตัวที่ตั้งค่าเหมือนกัน นับเป็น 1)" })}
${card("s4", "มาจากแอปไหน", bars(group(visits, r => r.k1), a => APP[a] || a), { note: "ดูจากเบราว์เซอร์ในแอปที่เปิดลิงก์ ถ้าเปิดผ่าน Safari ตรงๆ จะนับเป็น Safari" })}
${card("s7", "หลุดขั้นไหน", funnel, { note: "นับเครื่องละไม่เกิน 1 ครั้งต่อวัน (เข้าๆ ออกๆ ไม่นับซ้ำ) เปอร์เซ็นต์เทียบกับหน้าแรก ถ้ากระโดดข้ามขั้นด้วยแถบเลขด้านบน ขั้นที่ข้ามจะไม่ถูกนับ" })}
${card("s5", "ลิงก์สำหรับส่งน้องๆ", links, { note: `ตัวเลข "เข้ามา" นับ ${days} วันล่าสุด · อยากแยกรายโพสต์ให้ต่อท้ายเอง เช่น ?src=tiktok-0120 (a-z 0-9 . _ - ไม่เกิน 24 ตัว) จะขึ้นในการ์ด "ป้ายลิงก์"` })}
${card("s8", "แต่ละแอปติดตั้งสำเร็จแค่ไหน", `<div class="scroll"><table><tr><th>แอป</th><th>เข้าเว็บ</th><th>กด Copy</th><th>ถึงหน้าเสร็จ</th><th>สำเร็จ</th></tr>${appRows || `<tr><td colspan="5" class="empty">ยังไม่มีข้อมูล</td></tr>`}</table></div>`)}
${quota}
</div>
<div class="minis">
${card("", "ป้ายลิงก์ (?src=)", bars(group(of("src"), r => r.k1)))}
${card("", `ขนาดที่ใช้ (${latestName})`, bars(group(live, r => part(r.k1, 0) + ":" + part(r.k1, 1)), famName))}
${card("", `ธีม (${latestName})`, bars(group(live, r => part(r.k1, 2)), t => (t === "dark" ? "มืด" : "สว่าง")))}
${card("", `คำใน Parameter (${latestName})`, bars(group(live.flatMap(r => part(r.k2, 2).split(".").map(p => ({ k: p, n: r.n }))), r => r.k), p => (p === "-" ? "ไม่ใส่" : p)), { note: "Widget ที่ใส่หลายคำนับทุกคำ" })}
${card("", `เวอร์ชัน widget.js (${latestName})`, bars(group(live, r => part(r.k2, 0))))}
${card("", "อุปกรณ์ที่เปิดหน้าติดตั้ง", bars(group(visits, r => r.k2), d => DEV[d] || d))}
${card("", "เปิดดูเพิ่ม", bars(extra))}
</div>
</section>
<section class="view" id="v-links"${view === "links" ? "" : " hidden"}>
<h1>หน้ารวมลิงก์</h1>${lead}
${linksView({ of, perDay, prevSum, dayList, today, days, kpi, quota })}
</section>
<p class="foot">ไม่มีรหัสเครื่อง ไม่มี IP ไม่มี cookie · เก็บเป็นตัวเลขรวมรายวันเท่านั้น</p>`);
}
