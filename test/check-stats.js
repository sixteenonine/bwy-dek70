// ทดสอบระบบสถิติแบบไม่ระบุตัวตน
//  1) widget.js ส่งสัญญาณวันละครั้ง ไม่ส่งตอนดูตัวอย่างในแอป ส่งไม่ได้ก็ยังวาด widget ได้ แตะแล้วไป /go/drive
//  2) functions/ (Cloudflare Pages) นับถูก เขียนน้อย ไม่มีฐานข้อมูลก็ไม่พัง · go/drive.html พาไป Drive เสมอ · /stats ต้องมีรหัส
// ใช้: node test/check-stats.js   (ต้องใช้ Node 22 ขึ้นไป เพราะใช้ node:sqlite แทน D1)
"use strict";
process.env.TZ = "Asia/Bangkok";
process.removeAllListeners("warning"); process.on("warning", w => { if (!/SQLite/i.test(w.message)) console.warn(w); });
const fs = require("fs"), path = require("path");
const NodeRequest = globalThis.Request; // เก็บของจริงไว้ก่อน ตัวจำลอง Scriptable จะเขียนทับ
const root = path.join(__dirname, "..");
let failed = 0;
const ok = (cond, label) => { if (!cond) failed++; console.log(`${cond ? "✅" : "❌"} ${label}`); };

async function widgetSide() {
  const mock = require("./mock-scriptable.js");
  const S = mock.state;
  mock.install();
  const src = fs.readFileSync(path.join(root, "widget.js"), "utf8");
  const csv = fs.readFileSync(path.join(root, "events.csv"), "utf8");
  const EVENTS_URL = src.match(/EVENTS_URL\s*=\s*"([^"]+)"/)[1];
  const STATS = "https://bwy-widget.pages.dev/api/w";
  const M = mock.loadModule(src);
  const pings = () => S.requests.filter(u => u === STATS).length;
  const net = { [EVENTS_URL]: { status: 200, body: csv }, [STATS]: { status: 204, body: "" } };
  S.files.clear(); S.requests = []; S.net = net;
  S.now = new Date(2027, 0, 5, 9, 0).getTime();

  const w = await M.build("small", "", { loader: 3 });
  ok(w && /^https:\/\/bwy-widget\.pages\.dev\/go\/drive\?f=small$/.test(w.url), "widget: แตะแล้วไป /go/drive?f=small");
  ok(pings() === 1, "widget: ครั้งแรกส่งสัญญาณ 1 ครั้ง");
  await M.build("small", "", { loader: 3 });
  ok(pings() === 1, "widget: วันเดียวกันไม่ส่งซ้ำ");
  await M.build("medium", "tgat Dark", { loader: 3 });
  ok(pings() === 2, "widget: แบบที่ต่างกัน (Medium + Parameter) ส่งแยก 1 ครั้ง");
  S.now += 24 * 3600e3;
  await M.build("small", "", { loader: 3 });
  ok(pings() === 3, "widget: วันใหม่ส่งอีก 1 ครั้ง");
  const before = pings(); S.alertPick = 0;
  await M.runInApp({ loader: 3 });
  ok(pings() === before + 1 && S.presented === "small", "widget: เปิดในแอปส่งแค่ k=app ตัวอย่างไม่นับเป็น Widget ที่ใช้งาน");
  S.alertPick = undefined;
  S.net = { [EVENTS_URL]: { status: 200, body: csv } }; S.now += 24 * 3600e3; S.texts = [];
  const w2 = await M.build("small", "", { loader: 3 });
  ok(w2 && S.texts.length > 0, "widget: ส่งสถิติไม่ได้ (เน็ตล่ม) ก็ยังวาด widget ได้ปกติ");
  S.net = net;
  await M.build("small", "", { loader: 3 });
  ok(pings() >= 5, "widget: ส่งไม่ได้เมื่อกี้ รอบถัดไปลองส่งใหม่");
}

// ตัวจำลอง D1 ด้วย node:sqlite
function fakeD1() {
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(":memory:");
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    run: async () => { db.prepare(sql).run(...args); return { success: true }; },
    all: async () => ({ results: db.prepare(sql).all(...args) }),
  });
  return { db, prepare: sql => stmt(sql), batch: async list => { for (const s of list) await s.run(); return []; } };
}

async function serverSide() {
  const imp = p => import("file://" + path.join(root, p));
  const E = await imp("functions/api/e.js"), W = await imp("functions/api/w.js"), ST = await imp("functions/stats.js");
  const IG = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0";
  const TT = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_37.0 BytedanceWebview/d8a21c6";
  const SA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
  const call = async (fn, url, { ua = SA, body, env } = {}) => {
    const pend = [];
    const request = new NodeRequest(url, body === undefined ? { headers: { "user-agent": ua } } : { method: "POST", body, headers: { "user-agent": ua } });
    const res = await fn({ request, env, waitUntil: p => pend.push(p) });
    await Promise.all(pend);
    return res;
  };
  const post = (ua, o, env) => call(E.onRequestPost, "https://bwy-widget.pages.dev/api/e", { ua, body: JSON.stringify(o), env });
  const ping = (q, env) => call(W.onRequestGet, "https://bwy-widget.pages.dev/api/w?" + q, { env, ua: "Scriptable" });

  ok((await post(IG, { ev: [["visit"]] }, {})).status === 204, "server: ยังไม่ได้ผูก D1 ก็ตอบ 204 ไม่พัง");

  // หน้า /go/drive เป็นไฟล์ static: พาไป Drive เสมอ (ไม่พึ่ง Functions) และส่งสัญญาณ tap
  const go = fs.readFileSync(path.join(root, "go/drive.html"), "utf8");
  const DRIVE = "https://drive.google.com/drive/folders/1tSdpEq-BS-pVeHRoMoDGDK5kG5cLhAdD";
  ok(go.includes(`location.replace("${DRIVE}")`) && go.includes(`url=${DRIVE}`) && go.includes('["tap"'), "go/drive.html: พาไป Drive (มีสำรองกรณีไม่มี JS) และส่งสัญญาณแตะ");
  ok(!fs.existsSync(path.join(root, "functions/go")), "go/drive: ไม่มี Function ทับหน้า static");

  const env = { DB: fakeD1(), STATS_KEY: "test-key-123456" };
  // คนจาก IG ทำครบทุกขั้น ส่งเป็นชุดเดียว
  await post(IG, { src: "ig-bio", ev: [["visit", ""], ["step", "1"], ["appstore", ""], ["fold", "why"], ["step", "2"], ["copy", ""], ["step", "3"], ["step", "4"], ["step", "5"], ["step", "6"], ["step", "7"], ["step", "done"]] }, env);
  const writes1 = sum(env.DB.db.prepare("SELECT n FROM daily").all());
  ok(writes1 === 13, `server: คนที่ทำครบทุกขั้นเขียนแค่ ${writes1} แถว (เดิม ~28) และส่งคำขอครั้งเดียว`);
  await post(TT, { ev: [["visit", ""], ["step", "1"]] }, env);
  await post(SA, { ref: "t.co", ev: [["visit", ""]] }, env);
  await post("Googlebot/2.1", { ev: [["visit", ""]] }, env);
  await post(IG, { ev: [["hack", ""], ["step", "<script>"]] }, env);
  await post(SA, { ev: [["tap", "small"]] }, env);
  const before = sum(env.DB.db.prepare("SELECT n FROM daily").all());
  await ping("k=active&f=small&m=small&t=dark&v=7.8.8&l=3&p=tgat&n=1", env);
  await ping("k=active&f=medium&m=mediumBar&t=light&v=7.8.8&l=3&p=", env);
  const widgetWrites = sum(env.DB.db.prepare("SELECT n FROM daily").all()) - before;
  ok(widgetWrites === 3, `server: Widget 1 ตัวเขียน 1 แถว/วัน (+1 ถ้าเครื่องใหม่) = ${widgetWrites} แถวจาก 2 ตัว (เดิม ~8)`);
  const rows = env.DB.db.prepare("SELECT kind, k1, k2, n FROM daily").all();
  const get = (kind, k1, k2) => sum(rows.filter(r => r.kind === kind && r.k1 === k1 && (k2 === undefined || r.k2 === k2)));
  ok(get("visit", "instagram", "iphone") === 1 && get("visit", "tiktok") === 1 && get("visit", "x") === 1 && get("src", "ig-bio", "instagram") === 1, "server: แยกแอปที่มา (Instagram / TikTok / X จาก t.co) อุปกรณ์ และป้าย ?src=");
  ok(get("step", "2", "instagram") === 1 && get("copy", "-", "instagram") === 1 && get("fold", "why") === 1, "server: นับขั้น การกด Copy และกล่องที่เปิด แยกตามแอป");
  ok(!rows.some(r => r.kind === "hack") && get("step", "other", "instagram") === 1, "server: ไม่รับ event แปลก และกรองข้อความแปลกเป็น other");
  ok(sum(rows.filter(r => r.kind === "visit")) === 3, "server: ไม่นับบอท");
  ok(get("active", "small:small:dark", "7.8.8:3:tgat") === 1 && get("active", "medium:mediumbar:light", "7.8.8:3:-") === 1 && get("new", "small") === 1 && get("tap", "small") === 1, "server: Widget ใช้งาน (ขนาด ธีม เวอร์ชัน Parameter ในแถวเดียว) เครื่องใหม่ และการแตะ");
  const L = await imp("lib/stats.js");
  ok(L.appFrom("Mozilla/5.0 (iPhone) Mobile/15E148 Barcelona 300.0.0.0") === "threads" && L.appFrom("Mozilla/5.0 (iPhone) Mobile/15E148 Lemon8/6.0 BytedanceWebview") === "lemon8" && L.appFrom("Mozilla/5.0 (iPhone) Safari/604.1", "www.threads.net") === "threads", "server: รู้จัก Threads และ Lemon8 (ไม่ปนกับ TikTok)");
  ok(!JSON.stringify(rows).includes("Mozilla") && !JSON.stringify(rows).includes("Instagram 350"), "server: ไม่เก็บ User-Agent ลงฐานข้อมูล");

  ok((await call(ST.onRequestGet, "https://bwy-widget.pages.dev/stats", { env })).status === 404, "stats: ไม่มีรหัสเปิดไม่ได้ (404)");
  ok((await call(ST.onRequestGet, "https://bwy-widget.pages.dev/stats?k=wrong", { env })).status === 404, "stats: รหัสผิดเปิดไม่ได้");
  const html = await (await call(ST.onRequestGet, "https://bwy-widget.pages.dev/stats?k=test-key-123456&d=14", { env })).text();
  ok(html.includes("Instagram") && html.includes("หลุดขั้นไหน") && html.includes("Medium นับวินาที") && html.includes("tgat") && html.includes("ใช้โควตาฟรีวันนี้") && ["line", "x", "threads", "lemon8", "tiktok"].every(x => html.includes("https://bwy-widget.pages.dev/?src=" + x)) && !/undefined|NaN/.test(html), "stats: เปิดได้ มีตัวเลขครบ (แอป ขั้น ขนาด Parameter โควตา) มีลิงก์แยก 5 ช่องทาง ไม่มีค่าแปลก");
  const empty = await call(ST.onRequestGet, "https://bwy-widget.pages.dev/stats?k=test-key-123456", { env: { DB: fakeD1(), STATS_KEY: "test-key-123456" } });
  ok(empty.status === 200 && !/undefined|NaN/.test(await empty.text()), "stats: ฐานข้อมูลว่าง (ยังไม่มีตาราง) ก็เปิดได้");
}
const sum = rows => rows.reduce((a, r) => a + r.n, 0);

(async () => {
  await widgetSide();
  await serverSide();
  if (failed) { console.log(`\n❌ ไม่ผ่าน ${failed} ข้อ`); process.exit(1); }
  console.log("\n✅ สถิติผ่านทั้งหมด");
})().catch(e => { console.error(e); process.exit(1); });
