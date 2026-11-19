// สถิติแบบไม่ระบุตัวตนของ BWY Widget (ใช้ร่วมกันใน functions/ ทุกไฟล์)
// เก็บแค่ "ตัวเลขรวมรายวัน" ในตาราง stats: ไม่มีรหัสเครื่อง ไม่มี IP ไม่มีข้อมูลรายคน
// ต้องผูกฐานข้อมูล D1 ชื่อตัวแปร DB ไว้ในโปรเจกต์ Cloudflare Pages (ดู RUNBOOK.md หัวข้อ "สถิติ")
// ถ้ายังไม่ได้ผูก ทุกอย่างยังทำงานปกติ แค่ไม่นับ

export const SCHEMA = "CREATE TABLE IF NOT EXISTS stats (day TEXT NOT NULL, kind TEXT NOT NULL, k1 TEXT NOT NULL DEFAULT '', k2 TEXT NOT NULL DEFAULT '', n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, kind, k1, k2))";
const UPSERT = "INSERT INTO stats (day, kind, k1, k2, n) VALUES (?1, ?2, ?3, ?4, 1) ON CONFLICT (day, kind, k1, k2) DO UPDATE SET n = n + 1";

// วันที่ตามเวลาไทย เช่น 2026-11-19
export function bkkDay(ms = Date.now()) {
  return new Date(ms + 7 * 3600e3).toISOString().slice(0, 10);
}

// รับเฉพาะคำสั้นๆ ที่ปลอดภัย (กันคนยิงข้อความแปลกๆ เข้ามา)
export function clean(v, max = 24) {
  const s = String(v == null ? "" : v).toLowerCase().trim();
  return /^[a-z0-9._:-]*$/.test(s) ? s.slice(0, max) : "other";
}

// บวกเลข 1 ให้หลายแถวพร้อมกัน rows = [[kind, k1, k2], ...]
export async function bump(env, rows, day = bkkDay()) {
  if (!env || !env.DB || !rows.length) return false;
  const run = () => env.DB.batch(rows.map(([kind, k1 = "", k2 = ""]) => env.DB.prepare(UPSERT).bind(day, kind, clean(k1, 40), clean(k2, 40))));
  try { await run(); }
  catch (e) {
    if (!/no such table/i.test(String(e && e.message || e))) throw e;
    await env.DB.prepare(SCHEMA).run();
    await run();
  }
  return true;
}

// บันทึกเบื้องหลัง: ตอบผู้ใช้ทันที ไม่ต้องรอฐานข้อมูล
export function later(context, rows) {
  const p = bump(context.env, rows).catch(() => {});
  if (context.waitUntil) context.waitUntil(p);
  return p;
}

// มาจากแอปไหน: ดูจาก User-Agent ของเบราว์เซอร์ในแอป (ไม่เก็บ User-Agent เอง เก็บแค่ชื่อแอป)
export function appFrom(ua = "", ref = "") {
  const u = String(ua);
  if (/musical_ly|bytedance|tiktok/i.test(u)) return "tiktok";
  if (/instagram/i.test(u)) return "instagram";
  if (/\bline\//i.test(u)) return "line";
  if (/fb_iab|fban|fbav|messenger/i.test(u)) return "facebook";
  if (/twitter/i.test(u)) return "x";
  const r = String(ref).toLowerCase();
  if (/tiktok/.test(r)) return "tiktok";
  if (/instagram/.test(r)) return "instagram";
  if (/(^|\.)line\.me$|lin\.ee/.test(r)) return "line";
  if (/(^|\.)(t\.co|x\.com|twitter\.com)$/.test(r)) return "x";
  if (/facebook|fb\.com/.test(r)) return "facebook";
  if (/google\./.test(r)) return "google";
  if (r && !/bwy-widget\.pages\.dev$/.test(r)) return "web";
  if (/crios/i.test(u)) return "chrome";
  if (/safari/i.test(u)) return "safari";
  return "other";
}

export function deviceFrom(ua = "") {
  const u = String(ua);
  if (/ipad/i.test(u) || (/macintosh/i.test(u) && /mobile/i.test(u))) return "ipad";
  if (/iphone|ipod/i.test(u)) return "iphone";
  if (/android/i.test(u)) return "android";
  if (/macintosh|windows|linux|cros/i.test(u)) return "computer";
  return "other";
}

export const isBot = (ua = "") => !ua || /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|curl|wget|python|node-fetch/i.test(ua);

export const NO_CONTENT = () => new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
