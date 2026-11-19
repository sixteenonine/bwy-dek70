// POST /api/e  สัญญาณจากหน้าเว็บ (ส่งเองเงียบๆ ผู้ใช้ไม่ต้องกดอะไร) ส่งเป็นชุดเดียวตอนออกจากหน้า
// body: { src: ป้ายลิงก์ ?src=, ref: โดเมนที่มา, ev: [[ชื่อ, ค่า], ...] }
//   visit = เปิดหน้า · step = ไปถึงขั้น (1-7, done, theme, options, faq) · copy · appstore · fold = เปิดกล่อง (why, code) · tap = แตะ Widget (หน้า /go/drive)
// 1 event = เขียน 1 แถว
import { appFrom, deviceFrom, isBot, later, clean, NO_CONTENT } from "../../lib/stats.js";

const KINDS = new Set(["visit", "step", "copy", "appstore", "fold", "tap"]);

export async function onRequestPost(context) {
  const { request } = context;
  const ua = request.headers.get("user-agent") || "";
  if (isBot(ua)) return NO_CONTENT();
  let body;
  try {
    const text = await request.text();
    if (text.length > 2000) return NO_CONTENT();
    body = JSON.parse(text);
  } catch (e) { return NO_CONTENT(); }
  if (!body || !Array.isArray(body.ev)) return NO_CONTENT();
  const app = appFrom(ua, body.ref), src = clean(body.src);
  const rows = [];
  for (const [kind, val] of body.ev.slice(0, 20)) {
    if (!KINDS.has(kind)) continue;
    if (kind === "visit") {
      rows.push(["visit", app, deviceFrom(ua)]);
      if (src) rows.push(["src", src, app]);
    } else if (kind === "tap") rows.push(["tap", clean(val) || "-"]);
    else rows.push([kind, clean(val) || "-", app]);
  }
  if (rows.length) later(context, rows);
  return NO_CONTENT();
}
