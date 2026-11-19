// POST /api/e  สัญญาณจากหน้าติดตั้ง (index.html) ส่งเองแบบเงียบๆ ผู้ใช้ไม่ต้องกดอะไรเพิ่ม
// body: { e: "visit" | "step" | "copy" | "appstore" | "fold", s: ชื่อขั้น, src: ป้ายลิงก์ ?src=, ref: โดเมนที่มา }
import { appFrom, deviceFrom, isBot, later, clean, NO_CONTENT } from "../../lib/stats.js";

const EVENTS = new Set(["visit", "step", "copy", "appstore", "fold"]);

export async function onRequestPost(context) {
  const { request } = context;
  const ua = request.headers.get("user-agent") || "";
  if (isBot(ua)) return NO_CONTENT();
  let body = {};
  try {
    const text = await request.text();
    if (text.length > 1000) return NO_CONTENT();
    body = JSON.parse(text || "{}") || {};
  } catch (e) { return NO_CONTENT(); }
  const ev = String(body.e || "");
  if (!EVENTS.has(ev)) return NO_CONTENT();
  const app = appFrom(ua, body.ref);
  const rows = [];
  if (ev === "visit") {
    rows.push(["visit", app, clean(body.src) || "-"], ["device", deviceFrom(ua)]);
  } else if (ev === "step") {
    rows.push(["step", clean(body.s) || "intro", app]);
  } else {
    rows.push([ev, clean(body.s) || "-", app]);
  }
  later(context, rows);
  return NO_CONTENT();
}
