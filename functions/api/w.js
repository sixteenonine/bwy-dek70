// GET /api/w  สัญญาณจาก widget.js ในเครื่องน้อง (ส่งเอง ไม่ต้องกดอะไร)
// k=active  Widget แบบนี้ยังใช้อยู่ (แต่ละแบบในเครื่องส่งวันละครั้ง)  f=ขนาด m=แบบที่วาด t=ธีม v=เวอร์ชัน p=คำใน Parameter n=1 เครื่องใหม่
// k=app     เปิดสคริปต์ในแอป Scriptable (วันละครั้ง)
// k=theme   เปลี่ยนธีมในแอป  t=dark|light
import { later, clean, NO_CONTENT } from "../../lib/stats.js";

export async function onRequestGet(context) {
  const q = new URL(context.request.url).searchParams;
  const k = q.get("k");
  const rows = [];
  if (k === "active") {
    const f = clean(q.get("f")) || "none", m = clean(q.get("m")) || "none", t = clean(q.get("t")) || "light";
    rows.push(["active", f + ":" + m, t], ["ver", clean(q.get("v")) || "-", clean(q.get("l")) || "-"]);
    const p = (q.get("p") || "").split(".").map(x => clean(x, 12)).filter(Boolean).slice(0, 5);
    if (!p.length) rows.push(["param", "-"]);
    p.forEach(x => rows.push(["param", x]));
    if (q.get("n") === "1") rows.push(["new", f]);
  } else if (k === "app") {
    rows.push(["app", clean(q.get("v")) || "-"]);
  } else if (k === "theme") {
    rows.push(["theme", q.get("t") === "dark" ? "dark" : "light"]);
  } else {
    return NO_CONTENT();
  }
  later(context, rows);
  return NO_CONTENT();
}
