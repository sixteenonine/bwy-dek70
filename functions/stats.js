// GET /stats?k=รหัสลับ  หน้าสรุปตัวเลขของเจได (รหัสลับตั้งเป็นตัวแปร STATS_KEY ใน Cloudflare Pages)
// เลือกช่วงวันได้ด้วย &d=7 / 14 / 30
import { bkkDay, SCHEMA } from "../lib/stats.js";

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const APP = { tiktok: "TikTok", instagram: "Instagram", line: "LINE", facebook: "Facebook / Messenger", x: "X", google: "Google", web: "เว็บอื่น", safari: "Safari (พิมพ์เอง / ไม่รู้ที่มา)", chrome: "Chrome", other: "อื่นๆ" };
const DEV = { iphone: "iPhone", ipad: "iPad", android: "Android (ติดตั้งไม่ได้)", computer: "คอม", other: "อื่นๆ" };
const STEP = { visit: "หน้าแรก", 1: "1 โหลด Scriptable", 2: "2 Copy โค้ด", 3: "3 เปิด Scriptable กด +", 4: "4 Paste", 5: "5 ตั้งชื่อ Dek70", 6: "6 เพิ่ม Widget", 7: "7 เลือก Dek70", done: "หน้าเสร็จ" };
const FAM = { "small:small": "Small", "medium:mediumbar": "Medium นับวินาที", "medium:medium": "Medium", "large:large": "Large", "extralarge:xl": "Extra Large", "extralarge:large": "Extra Large (แบบ Large)" };
const famName = k => FAM[k] || (k.endsWith(":none") ? k.split(":")[0] + " (ยังไม่เปิดใช้)" : k);
const WRITE_LIMIT = 100000; // D1 แผนฟรี: เขียนได้ 100,000 แถว/วัน (รีเซ็ต 07:00 เวลาไทย)

function page(body) {
  return new Response(`<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer"><title>สถิติ BWY Widget</title>
<style>
:root{--bg:#F3F3F3;--card:#FFF;--ink:#0B0B0C;--sub:#6B6B70;--line:#ECECEC;--bar:#0B0B0C;--track:#EFEFEF}
@media (prefers-color-scheme:dark){:root{--bg:#0F0F11;--card:#1B1B1E;--ink:#F4F4F6;--sub:#A3A3AA;--line:#2B2B30;--bar:#F4F4F6;--track:#26262B}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Sukhumvit Set","Segoe UI",sans-serif}
main{max-width:760px;margin:0 auto;padding:20px 16px 60px}h1{font-size:1.6rem;margin:0 0 4px}h2{font-size:1.05rem;margin:0 0 10px}
.sub{color:var(--sub);font-size:.88rem;margin:0}.range{display:flex;gap:6px;margin:12px 0 18px}.range a{padding:5px 12px;border-radius:999px;background:var(--card);border:1px solid var(--line);color:var(--ink);text-decoration:none;font-size:.88rem}
.range a.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:14px}
.kpi,.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px}.kpi b{display:block;font-size:1.7rem;line-height:1.1}.kpi span{color:var(--sub);font-size:.82rem}
.card{margin-top:12px}.row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,2fr) auto;gap:10px;align-items:center;padding:5px 0;font-size:.92rem}
.row .t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.b{height:8px;border-radius:4px;background:var(--track);overflow:hidden}.b i{display:block;height:100%;background:var(--bar);border-radius:4px}
.row .n{font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}.row .n small{color:var(--sub)}
table{width:100%;border-collapse:collapse;font-size:.88rem;font-variant-numeric:tabular-nums}th,td{padding:6px 4px;border-bottom:1px solid var(--line);text-align:right}th:first-child,td:first-child{text-align:left}th{color:var(--sub);font-weight:600}
.note{color:var(--sub);font-size:.82rem;margin:8px 0 0}.empty{color:var(--sub);font-size:.9rem}
</style></head><body><main>${body}</main></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}

const sum = rows => rows.reduce((a, r) => a + r.n, 0);
function group(rows, key) {
  const m = new Map();
  rows.forEach(r => { const k = key(r); m.set(k, (m.get(k) || 0) + r.n); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
function bars(list, name = x => x) {
  if (!list.length) return `<p class="empty">ยังไม่มีข้อมูล</p>`;
  const max = Math.max(...list.map(x => x[1]), 1), all = list.reduce((a, x) => a + x[1], 0) || 1;
  return list.map(([k, n]) => `<div class="row"><span class="t">${esc(name(k))}</span><span class="b"><i style="width:${(n / max * 100).toFixed(1)}%"></i></span><span class="n">${n.toLocaleString()} <small>${Math.round(n / all * 100)}%</small></span></div>`).join("");
}
const card = (title, html, note) => `<div class="card"><h2>${title}</h2>${html}${note ? `<p class="note">${note}</p>` : ""}</div>`;

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const key = env.STATS_KEY || "";
  if (key.length < 8 || url.searchParams.get("k") !== key) return new Response("Not found", { status: 404 });
  if (!env.DB) return page(`<h1>สถิติ BWY Widget</h1><p class="sub">ยังไม่ได้ผูกฐานข้อมูล D1 ชื่อ DB กับโปรเจกต์นี้ (ดู RUNBOOK.md หัวข้อ "สถิติ")</p>`);
  const days = [7, 14, 30].includes(+url.searchParams.get("d")) ? +url.searchParams.get("d") : 7;
  const today = bkkDay(), from = bkkDay(Date.now() - (days - 1) * 864e5), yesterday = bkkDay(Date.now() - 864e5);
  let all = [];
  try { all = (await env.DB.prepare("SELECT day, kind, k1, k2, n FROM daily WHERE day >= ?1").bind(from).all()).results || []; }
  catch (e) { if (/no such table/i.test(String(e && e.message || e))) await env.DB.prepare(SCHEMA).run(); else throw e; }
  const of = kind => all.filter(r => r.kind === kind);
  const visits = of("visit"), steps = of("step"), copies = of("copy"), active = of("active");
  const perDay = (rows, d) => sum(rows.filter(r => r.day === d));
  const latest = perDay(active, yesterday) ? yesterday : today, latestName = latest === today ? "วันนี้" : "เมื่อวาน";
  const live = active.filter(r => r.day === latest);
  const part = (s, i) => String(s).split(":")[i] || "-";

  // หลุดขั้นไหน (หน้าแรก = จำนวนคนเปิดหน้า)
  const reach = k => (k === "visit" ? sum(visits) : sum(steps.filter(r => r.k1 === k)));
  const order = ["visit", "1", "2", "3", "4", "5", "6", "7", "done"];
  const base = reach("visit") || 1;
  const funnel = order.map((k, i) => {
    const n = reach(k), prev = i ? reach(order[i - 1]) : n, drop = i && prev ? Math.round((1 - n / prev) * 100) : 0;
    return `<tr><td>${esc(STEP[k])}${k === "2" ? ` <span class="sub">(กด Copy ${sum(copies).toLocaleString()})</span>` : ""}</td><td>${n.toLocaleString()}</td><td>${Math.round(n / base * 100)}%</td><td>${i ? (drop > 0 ? "−" + drop + "%" : "0%") : ""}</td></tr>`;
  }).join("");

  // แต่ละแอป: เข้าเว็บ → กด Copy → ถึงหน้าเสร็จ
  const apps = group(visits, r => r.k1).map(([a, n]) => {
    const c = sum(copies.filter(r => r.k2 === a)), d = sum(steps.filter(r => r.k1 === "done" && r.k2 === a));
    return `<tr><td>${esc(APP[a] || a)}</td><td>${n.toLocaleString()}</td><td>${c.toLocaleString()}</td><td>${d.toLocaleString()}</td><td>${Math.round(d / (n || 1) * 100)}%</td></tr>`;
  }).join("");

  const dayList = Array.from({ length: days }, (_, i) => bkkDay(Date.now() - i * 864e5));
  const daily = dayList.map(d => `<tr><td>${d.slice(5)}${d === today ? " (วันนี้)" : ""}</td><td>${perDay(visits, d)}</td><td>${perDay(copies, d)}</td><td>${perDay(of("new"), d)}</td><td>${perDay(active, d)}</td><td>${perDay(of("tap"), d)}</td></tr>`).join("");

  // โควตา: ตาราง WITHOUT ROWID บวกเลข 1 ครั้ง = เขียน 1 แถว ผลรวมของวันนี้จึงเท่ากับจำนวนแถวที่เขียนไป (นับตามวันไทย ใกล้เคียงรอบของ Cloudflare)
  const writes = perDay(all, today), pct = Math.min(100, writes / WRITE_LIMIT * 100);

  const range = [7, 14, 30].map(d => `<a class="${d === days ? "on" : ""}" href="?k=${encodeURIComponent(key)}&d=${d}">${d} วัน</a>`).join("");
  return page(`<h1>สถิติ BWY Widget</h1><p class="sub">${from} ถึง ${today} (เวลาไทย) · ตัวเลขรวมแบบไม่ระบุตัวตน</p>
<div class="range">${range}</div>
<div class="kpis">
  <div class="kpi"><b>${perDay(active, latest).toLocaleString()}</b><span>Widget ใช้งานจริง (${latest === today ? "วันนี้ ยังนับไม่ครบวัน" : "เมื่อวาน"})</span></div>
  <div class="kpi"><b>${sum(visits).toLocaleString()}</b><span>คนเปิดหน้าติดตั้ง</span></div>
  <div class="kpi"><b>${sum(copies).toLocaleString()}</b><span>กด Copy โค้ด</span></div>
  <div class="kpi"><b>${sum(of("new")).toLocaleString()}</b><span>เครื่องที่ติดตั้งใหม่ (Widget ทำงานครั้งแรก)</span></div>
  <div class="kpi"><b>${sum(of("tap")).toLocaleString()}</b><span>แตะ Widget ไปเปิด Drive</span></div>
</div>
${card("ใช้โควตาฟรีวันนี้", `<div class="row"><span class="t">เขียน D1</span><span class="b"><i style="width:${pct.toFixed(1)}%"></i></span><span class="n">${writes.toLocaleString()} <small>/ 100,000</small></span></div>`,
  "ประมาณการ (Cloudflare รีเซ็ต 07:00 เวลาไทย) เกิน 100% = หยุดนับถึงรอบถัดไป Widget และหน้าเว็บยังใช้ได้ปกติ คำขอ Functions มีไม่เกินจำนวนนี้ (ลิมิต 100,000 ครั้ง/วัน)")}
${card("มาจากแอปไหน", bars(group(visits, r => r.k1), a => APP[a] || a), "ดูจากเบราว์เซอร์ในแอปที่เปิดลิงก์ ถ้าเปิดลิงก์ผ่าน Safari ตรงๆ จะนับเป็น Safari")}
${card("ป้ายลิงก์ (?src=)", bars(group(of("src"), r => r.k1)), "ใส่ท้ายลิงก์ที่แปะแต่ละที่ เช่น bwy-widget.pages.dev/?src=tiktok-bio จะรู้ว่าโพสต์ไหนพาคนมา")}
${card("หลุดขั้นไหน", `<table><tr><th>ขั้น</th><th>คน</th><th>จากหน้าแรก</th><th>หลุดจากขั้นก่อน</th></tr>${funnel}</table>`, "นับคนละ 1 ครั้งต่อการเปิดหน้า ถ้ากระโดดข้ามขั้นด้วยแถบเลขด้านบน ขั้นที่ข้ามจะไม่ถูกนับ")}
${card("แต่ละแอปติดตั้งสำเร็จแค่ไหน", `<table><tr><th>แอป</th><th>เข้าเว็บ</th><th>กด Copy</th><th>ถึงหน้าเสร็จ</th><th>สำเร็จ</th></tr>${apps || `<tr><td colspan="5" class="empty">ยังไม่มีข้อมูล</td></tr>`}</table>`)}
${card("รายวัน", `<table><tr><th>วัน</th><th>เข้าเว็บ</th><th>Copy</th><th>ติดตั้งใหม่</th><th>Widget ใช้งาน</th><th>แตะไป Drive</th></tr>${daily}</table>`, "\"Widget ใช้งาน\" = Widget แต่ละแบบในแต่ละเครื่องส่งสัญญาณวันละครั้ง (เครื่องเดียววาง Small สองตัวที่ตั้งค่าเหมือนกัน นับเป็น 1)")}
${card(`ขนาดที่ใช้ (${latestName})`, bars(group(live, r => part(r.k1, 0) + ":" + part(r.k1, 1)), famName))}
${card(`ธีม (${latestName})`, bars(group(live, r => part(r.k1, 2)), t => (t === "dark" ? "มืด" : "สว่าง")))}
${card(`คำใน Parameter (${latestName})`, bars(group(live.flatMap(r => part(r.k2, 2).split(".").map(p => ({ k: p, n: r.n }))), r => r.k), p => (p === "-" ? "ไม่ใส่" : p)), "Widget ที่ใส่หลายคำนับทุกคำ")}
${card(`เวอร์ชัน widget.js (${latestName})`, bars(group(live, r => part(r.k2, 0))))}
${card("อุปกรณ์ที่เปิดหน้าติดตั้ง", bars(group(visits, r => r.k2), d => DEV[d] || d))}
${card("เปิดดูเพิ่ม", bars([...group(of("fold"), r => r.k1).map(([k, n]) => [k === "why" ? "กล่อง ทำไมต้องโหลด Scriptable?" : k === "code" ? "กล่อง โค้ดนี้ปลอดภัยไหม?" : k, n]),
  ...group(steps.filter(r => ["theme", "options", "faq"].includes(r.k1)), r => r.k1).map(([k, n]) => [{ theme: "หน้า เปลี่ยนธีมสี", options: "หน้า ปรับแต่งด้วย Parameter", faq: "หน้า คำถามที่เจอบ่อย" }[k], n])].sort((a, b) => b[1] - a[1])),
  `กดปุ่ม App Store ในขั้นที่ 1: ${sum(of("appstore")).toLocaleString()} ครั้ง · เปิดสคริปต์ในแอป Scriptable: ${sum(of("app")).toLocaleString()} ครั้ง · เปลี่ยนธีมในแอป: ${sum(of("theme")).toLocaleString()} ครั้ง`)}`);
}
