// GET /api/w  สัญญาณจาก widget.js ในเครื่องน้อง (ส่งเอง ไม่ต้องกดอะไร)
// k=active  Widget แบบนี้ยังใช้อยู่ (แต่ละแบบในเครื่องส่งวันละครั้ง)  f=ขนาด m=แบบที่วาด t=ธีม v=เวอร์ชัน l=รุ่นตัวติดตั้ง p=คำใน Parameter n=1 เครื่องใหม่
//           เขียนแถวเดียว: k1 = ขนาด:แบบ:ธีม  k2 = เวอร์ชัน:รุ่นตัวติดตั้ง:คำใน Parameter (หน้า /stats แยกเอง)
// k=app     เปิดสคริปต์ในแอป Scriptable (วันละครั้ง)
// k=theme   เปลี่ยนธีมในแอป  t=dark|light
import { later, clean, NO_CONTENT } from "../../lib/stats.js";

export async function onRequestGet(context) {
  const q = new URL(context.request.url).searchParams;
  const g = (k, d) => clean(q.get(k)) || d;
  const rows = [];
  const k = q.get("k");
  if (k === "active") {
    const f = g("f", "none");
    rows.push(["active", `${f}:${g("m", "none")}:${q.get("t") === "dark" ? "dark" : "light"}`, `${g("v", "-")}:${g("l", "-")}:${g("p", "-")}`]);
    if (q.get("n") === "1") rows.push(["new", f]);
  } else if (k === "app") rows.push(["app", g("v", "-")]);
  else if (k === "theme") rows.push(["theme", q.get("t") === "dark" ? "dark" : "light"]);
  if (rows.length) later(context, rows);
  return NO_CONTENT();
}
