"use client";

import { CalendarDays, Clock3, Heart } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../data";

export default function CountdownExperience({ special, setSpecial, countdown, dailyMessage }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function trackPointer(event) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -5,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 7,
    });
  }

  return (
    <section className="feature-view countdown-view">
      <div className="feature-heading"><div><p className="eyebrow">05 <span className="eyebrow-rule" /> MENUJU WAKTU BERIKUTNYA</p><h1>Sudah <em>hitung hari.</em></h1></div><span className="heading-count"><Clock3 size={14} /> TERUS BERJALAN</span></div>
      <div className="countdown-panel" style={{ "--countdown-tilt-x": `${tilt.x}deg`, "--countdown-tilt-y": `${tilt.y}deg` }} onPointerMove={trackPointer} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
        <div className="countdown-copy"><span className="countdown-spark"><Heart size={18} fill="currentColor" /></span><p className="eyebrow">SAMPAI KITA BERTEMU DI</p><h2>{special.title}</h2><p className="countdown-date"><CalendarDays size={15} /> {formatDate(special.date)}</p></div>
        <div className="countdown-numbers"><div><strong>{countdown.days === null ? "--" : String(countdown.days).padStart(2, "0")}</strong><span>HARI</span></div><i>:</i><div><strong>{countdown.hours === null ? "--" : String(countdown.hours).padStart(2, "0")}</strong><span>JAM</span></div><i>:</i><div><strong>{countdown.minutes === null ? "--" : String(countdown.minutes).padStart(2, "0")}</strong><span>MENIT</span></div></div>
        <div className="countdown-bottom"><span>{dailyMessage}</span><span>♡</span></div>
      </div>
      <div className="countdown-edit"><div><p className="eyebrow">GANTI MOMENNYA</p><h2>Tanggal yang ditunggu?</h2><p>Atur sendiri. Hitung mundur akan mengikuti tanggal pilihanmu.</p></div><div className="countdown-fields"><label>Nama momen<input value={special.title} maxLength={50} onChange={(event) => setSpecial((current) => ({ ...current, title: event.target.value }))} /></label><label>Tanggal<input type="date" value={special.date} onChange={(event) => setSpecial((current) => ({ ...current, date: event.target.value }))} /></label></div></div>
    </section>
  );
}
