// หน้าตาหน้ารวมลิงก์ (ใช้ร่วมกัน 2 ที่: tools/make-links.js สร้างเว็บจริง + หน้าแก้ไข Links Studio ใช้ดูตัวอย่างสด)
// ทั้งก้อนอยู่ในฟังก์ชันเดียว ไม่พึ่งอะไรภายนอก เพื่อให้คัดลอกไปรันในเบราว์เซอร์ได้ตรงทุกตัวอักษร (linksRender.toString())
function linksRender() {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // ข้อความที่แสดง: คำที่มีขีด เช่น A-Level ห้ามตัดบรรทัดกลางคำ
  const txt = s => esc(s).replace(/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+/g, w => `<span class="nw">${w}</span>`);

  // icon เส้น (viewBox 24) ไม่ใช้ emoji
  const ICON = {
    folder: '<path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3.6l2.2 2.4H18a2.5 2.5 0 0 1 2.5 2.5v7.6A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M3.5 10.5h17"/>',
    widget: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    chat: '<path d="M12 4c4.7 0 8.5 3 8.5 6.8 0 3.7-3.8 6.7-8.5 6.7-.8 0-1.5-.1-2.2-.2L5.5 20l.6-3.9C4.4 14.9 3.5 13 3.5 10.8 3.5 7 7.3 4 12 4Z"/><path d="M8.5 10.8h.01M12 10.8h.01M15.5 10.8h.01" stroke-width="2.6"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15.5H5.5A1.5 1.5 0 0 1 4 18Z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15.5h5.5A1.5 1.5 0 0 0 20 18Z"/>',
    exam: '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
    pen: '<path d="M14.5 5.5 18.5 9.5M4 20l1-4.5L15.8 4.7a1.8 1.8 0 0 1 2.5 0l1 1a1.8 1.8 0 0 1 0 2.5L8.5 19Z"/>',
    play: '<rect x="3.5" y="5" width="17" height="14" rx="3.5"/><path d="M10.2 9.2v5.6l4.6-2.8Z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    star: '<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8Z"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6M12 8.5v12M12 8.5C10.5 5 7 4.6 7 6.6S10 8.5 12 8.5Zm0 0c1.5-3.5 5-3.9 5-1.9S14 8.5 12 8.5Z"/>',
    bag: '<path d="M5 8h14l-1 12.5H6Z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6 7.5-6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
  };
  const svg = (d, cls) => `<svg class="${cls || "ico"}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const ARROW = '<path d="M9 5.5 15.5 12 9 18.5"/>';

  // สีสองโหมด (ดำ/ขาว soft neutral ไม่มีสีสด)
  const LIGHT = `--paper:#FEFEFE;--dot:#E4E4E6;--card:#FFFFFF;--ink:#0B0B0C;--sub:#6B6B70;--mute:#A3A3A8;--line:#ECECEC;--chip:#F2F2F2;
--shadow:0 1px 2px rgba(0,0,0,.04),0 12px 28px -14px rgba(0,0,0,.18);--chip-shadow:0 1px 2px rgba(0,0,0,.04),0 6px 14px -8px rgba(0,0,0,.18);
--btn:linear-gradient(180deg,#3B3B3D 0%,#161617 55%,#050505 100%);--btn-ink:#FFFFFF;--btn-sub:rgba(255,255,255,.66);--btn-tile:rgba(255,255,255,.12);
--btn-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 2px 3px rgba(0,0,0,.18),0 10px 22px -6px rgba(0,0,0,.45)`;
  const DARK = `--paper:#0F0F11;--dot:#232327;--card:#1B1B1E;--ink:#F4F4F6;--sub:#A3A3AA;--mute:#6E6E76;--line:#2B2B30;--chip:#26262B;
--shadow:0 1px 0 rgba(255,255,255,.04) inset,0 12px 28px -14px rgba(0,0,0,.7);--chip-shadow:0 1px 0 rgba(255,255,255,.04) inset;
--btn:linear-gradient(180deg,#FFFFFF 0%,#E9E9EB 60%,#D2D2D6 100%);--btn-ink:#0B0B0C;--btn-sub:rgba(11,11,12,.6);--btn-tile:rgba(0,0,0,.07);
--btn-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 2px 3px rgba(0,0,0,.4),0 10px 22px -6px rgba(0,0,0,.6)`;

  // ส่วนประกอบของหน้า (ใช้แค่ class ไม่แตะ html/body)
  const PARTS = `.me{text-align:center;margin:0 6px 26px}
.me img{display:block;width:104px;height:auto;margin:0 auto 12px;filter:drop-shadow(0 10px 18px rgba(0,0,0,.14))}
.me h1{margin:0;font-size:2.1rem;line-height:1.15;font-weight:700;letter-spacing:-.01em;color:var(--ink)}
.me .by{margin:2px 0 0;color:var(--sub);font-size:1rem}
.me .pill{display:inline-block;margin:10px 0 0;padding:3px 14px 4px;border-radius:999px;background:var(--card);color:var(--ink);border:1px solid var(--line);box-shadow:var(--chip-shadow);font-size:.92rem}
.me .bio{margin:14px auto 0;max-width:22em;font-size:1.04rem;color:var(--ink);white-space:pre-line}
.blocks{display:grid;gap:12px}
.sec{margin:16px 4px 0;font-size:.92rem;font-weight:600;color:var(--sub);text-align:center}
.sec:first-child{margin-top:0}
.b{display:flex;align-items:center;gap:14px;min-height:72px;padding:12px 14px 12px 12px;border-radius:22px;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);-webkit-tap-highlight-color:transparent}
.b.slim{min-height:56px;padding:8px 14px}
.b.slim .tile{width:38px;height:38px;border-radius:12px}.b.slim .ico{width:21px;height:21px}
.b.center{justify-content:center;text-align:center;padding-inline:20px}
.b .tile{flex:none;width:46px;height:46px;border-radius:14px;background:var(--chip);display:grid;place-items:center}
.b .ico{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.b .t{flex:1;min-width:0}.b b{display:block;font-size:1.06rem;line-height:1.3;font-weight:600}.b small{display:block;margin-top:1px;color:var(--sub);font-size:.86rem;line-height:1.35}
.b .tag{display:inline-block;vertical-align:2px;margin-left:6px;padding:0 8px 1px;border-radius:999px;border:1px solid var(--line);background:var(--chip);color:var(--ink);font-size:.72rem;font-weight:600;line-height:1.6;white-space:nowrap}
.b .go{flex:none;width:18px;height:18px;color:var(--mute);stroke-width:2.2}
.b.main{background:var(--btn);color:var(--btn-ink);border-color:transparent;box-shadow:var(--btn-shadow)}
.b.main .tile{background:var(--btn-tile)}.b.main small,.b.main .go{color:var(--btn-sub)}
.b.main .tag{background:var(--btn-tile);border-color:transparent;color:var(--btn-ink)}
.b:focus-visible,.chips a:focus-visible{outline:3px solid #4C8DFF;outline-offset:3px}
@media (prefers-reduced-motion:no-preference){.b,.chips a{transition:transform .18s cubic-bezier(.3,1.8,.5,1),box-shadow .2s}.b:active,.chips a:active{transform:scale(.97)}}
.follow{margin:18px 0 0;text-align:center}.follow:first-child{margin-top:0}.follow h2{margin:0 0 12px;font-size:.92rem;font-weight:600;color:var(--sub)}
.chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.chips a{display:block;min-height:40px;padding:8px 16px;border-radius:999px;background:var(--card);border:1px solid var(--line);box-shadow:var(--chip-shadow);color:var(--ink);text-decoration:none;font-weight:600;font-size:.95rem;line-height:1.5;-webkit-tap-highlight-color:transparent}
.nw{white-space:nowrap}
.b[hidden]{display:none}`;

  // เนื้อหาหน้า: ส่วนหัว + บล็อก (ปุ่ม / หัวข้อ / ชิปโซเชียล) ตามลำดับใน links.json
  // ปุ่มที่ตั้งวันไว้ใส่ data-from / data-until ให้สคริปต์ในหน้าซ่อนตามวันที่ (เวลาไทย)
  function renderMain(cfg, photo) {
    const p = cfg.profile || {};
    const button = b => {
      const cls = ["b", b.style === "main" ? "main" : "", b.size === "slim" ? "slim" : "", b.icon === "none" ? "center" : ""].filter(Boolean).join(" ");
      const when = (b.from ? ` data-from="${esc(b.from)}"` : "") + (b.until ? ` data-until="${esc(b.until)}"` : "");
      const tile = b.icon === "none" ? "" : `<span class="tile">${svg(ICON[b.icon] || ICON.link)}</span>`;
      const tag = b.badge ? `<span class="tag">${esc(b.badge)}</span>` : "";
      return `<a class="${cls}" href="${esc(b.url)}" data-id="${esc(b.id)}"${when}>${tile}<span class="t"><b>${txt(b.title)}${tag}</b>${b.note ? `<small>${txt(b.note)}</small>` : ""}</span>${b.icon === "none" ? "" : svg(ARROW, "ico go")}</a>`;
    };
    const block = k => {
      if (k.hidden) return "";
      if (k.type === "heading") return `<h2 class="sec">${txt(k.text)}</h2>`;
      if (k.type === "socials") return (k.items || []).length ? `<section class="follow">${k.title ? `<h2>${txt(k.title)}</h2>` : ""}<ul class="chips">${k.items.map(s => `<li><a href="${esc(s.url)}" data-id="${esc(s.id)}">${esc(s.title)}</a></li>`).join("")}</ul></section>` : "";
      return button(k);
    };
    return `<header class="me">
${photo ? `<img src="${esc(photo)}" width="264" height="289" alt="${esc(p.photoAlt || "พี่เจได")}">\n` : ""}<h1>${esc(p.name)}</h1>
${p.by ? `<p class="by">${txt(p.by)}</p>\n` : ""}${p.school ? `<p class="pill">${txt(p.school)}</p>\n` : ""}${p.bio ? `<p class="bio">${txt(p.bio)}</p>\n` : ""}</header>
<div class="blocks">
${(cfg.blocks || []).map(block).filter(Boolean).join("\n")}
</div>`;
  }

  // ซ่อนปุ่มที่ยังไม่ถึงวัน / เลยวันแล้ว (วันที่แบบ 2026-12-01 เวลาไทย ทั้งสองวันนับรวม)
  function applySchedule(root, now) {
    const today = new Date((now || Date.now()) + 7 * 3600e3).toISOString().slice(0, 10);
    root.querySelectorAll("[data-from],[data-until]").forEach(a => {
      const f = a.getAttribute("data-from"), u = a.getAttribute("data-until");
      a.hidden = Boolean((f && today < f) || (u && today > u));
    });
  }

  return { esc, txt, ICON, LIGHT, DARK, PARTS, renderMain, applySchedule };
}
module.exports = linksRender;
