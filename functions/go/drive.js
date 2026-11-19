// GET /go/drive  แตะ Widget แล้วมาที่นี่ก่อน: นับ 1 แล้วพาไปโฟลเดอร์ Google Drive ของ BearWithYou ทันที
// ปลายทางล็อกไว้ที่ลิงก์นี้ลิงก์เดียว (กันคนเอาไปใช้พาไปเว็บอื่น)
import { later, clean } from "../../lib/stats.js";

export const DRIVE = "https://drive.google.com/drive/folders/1tSdpEq-BS-pVeHRoMoDGDK5kG5cLhAdD";

export async function onRequestGet(context) {
  const f = clean(new URL(context.request.url).searchParams.get("f")) || "-";
  later(context, [["tap", f]]);
  return new Response(null, { status: 302, headers: { location: DRIVE, "cache-control": "no-store" } });
}
