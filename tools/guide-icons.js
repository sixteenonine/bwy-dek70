// ไอคอน BWY: ฟันเฟือง / จานสี / คำถาม (viewBox 24, สีตาม currentColor, ขนาดภาพเท่ากัน ~20/24)
let uid = 0;
const f = n => +n.toFixed(2);
function gear() {
  // 8 ฟัน ปลายมน โคนโค้ง
  const T = 8, R = 9.7, r = 7.5, pts = [];
  for (let i = 0; i < T; i++) {
    const a = (i / T) * Math.PI * 2 - Math.PI / 2, w = Math.PI / T;
    for (const [rad, da] of [[r, -w * 0.62], [R, -w * 0.34], [R, w * 0.34], [r, w * 0.62]]) pts.push([12 + rad * Math.cos(a + da), 12 + rad * Math.sin(a + da)]);
  }
  const d = "M" + pts.map(p => p.map(f).join(" ")).join("L") + "Z";
  const id = "bi" + uid++;
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><mask id="${id}"><rect width="24" height="24" fill="#fff"/><circle cx="12" cy="12" r="3.3" fill="#000"/></mask><path d="${d}" fill="currentColor" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" mask="url(#${id})"/></svg>`;
}
function palette() {
  const id = "bi" + uid++;
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><mask id="${id}"><rect width="24" height="24" fill="#fff"/>` +
    [[7.9, 6.4], [12, 5.2], [16, 6.7], [18.5, 10.4], [17.7, 14.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.45" fill="#000"/>`).join("") +
    `<ellipse cx="8.4" cy="16.5" rx="2.2" ry="1.5" transform="rotate(-30 8.4 16.5)" fill="#000"/></mask>` +
    `<path d="M13 2.5C18.3 2.5 21.8 6.6 21.8 11.8c0 5.8-4.6 9.7-10.6 9.7-5.2 0-8.9-2.7-8.9-5.9 0-2.2 2.1-3.2 3.7-3.8 1.3-.5 1.4-1.4.1-1.8-2.1-.6-3.2-1.4-2.7-3.2C4.2 4.2 8.2 2.5 13 2.5Z" fill="currentColor" mask="url(#${id})"/></svg>`;
}
function help() {
  const id = "bi" + uid++;
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><mask id="${id}"><rect width="24" height="24" fill="#fff"/>` +
    `<path d="M9.1 9.3c0-1.8 1.3-3 3-3s3 1.1 3 2.7c0 1.3-.8 2-1.8 2.6-.9.5-1.3 1.1-1.3 2v.5" fill="none" stroke="#000" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="12" cy="17.2" r="1.45" fill="#000"/></mask><circle cx="12" cy="12" r="10.1" fill="currentColor" mask="url(#${id})"/></svg>`;
}
module.exports = { gear, palette, help };
