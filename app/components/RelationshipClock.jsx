"use client";

import { useEffect, useState } from "react";

const STARTED_AT = new Date(2026, 7, 1, 0, 0, 0).getTime();

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function RelationshipClock({ onOpenCountdown }) {
  const [now, setNow] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const elapsed = now ? Math.max(0, Math.floor((now - STARTED_AT) / 1000)) : null;
  const days = elapsed === null ? "--" : String(Math.floor(elapsed / 86400));
  const hours = elapsed === null ? "--" : pad(Math.floor((elapsed % 86400) / 3600));
  const minutes = elapsed === null ? "--" : pad(Math.floor((elapsed % 3600) / 60));
  const seconds = elapsed === null ? "--" : pad(elapsed % 60);

  function trackPointer(event) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -7,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 8,
    });
  }

  return (
    <button
      className="relationship-clock"
      onClick={onOpenCountdown}
      onPointerMove={trackPointer}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ "--clock-tilt-x": `${tilt.x}deg`, "--clock-tilt-y": `${tilt.y}deg` }}
      aria-label={`${days} hari bersama sejak 1 Agustus 2026. Buka hitung mundur.`}
    >
      <span className="relationship-orbit" aria-hidden="true" />
      <div className="relationship-clock-top"><span>SEJAK KITA BERSAMA</span><span>01 <i>·</i> 08 <i>·</i> 2026</span></div>
      <div className="relationship-clock-main">
        <div className="relationship-days"><strong>{days}</strong><span>HARI<br />BERSAMA</span></div>
        <div className="relationship-units">
          <div><strong>{hours}</strong><span>JAM</span></div><i>:</i>
          <div><strong>{minutes}</strong><span>MENIT</span></div><i>:</i>
          <div><strong>{seconds}</strong><span>DETIK</span></div>
        </div>
      </div>
      <div className="relationship-clock-bottom"><span className="relationship-whisper">Satu hari lagi, satu cerita lagi.</span><span className="relationship-open">LIHAT WAKTU KITA ↗</span></div>
    </button>
  );
}
