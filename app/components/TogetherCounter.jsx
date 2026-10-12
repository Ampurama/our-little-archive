"use client";

import { useEffect, useRef, useState } from "react";

const STARTED_AT = new Date(2026, 7, 1, 0, 0, 0);
const PHOTO = "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=2400&q=90";

function getDuration(now) {
  const totalSeconds = Math.max(0, Math.floor((now - STARTED_AT.getTime()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function TogetherCounter({ onContinue }) {
  const [now, setNow] = useState(null);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [opening, setOpening] = useState(false);
  const enterTimer = useRef(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(enterTimer.current);
    };
  }, []);

  const duration = now ? getDuration(now) : null;

  function enterRoom() {
    if (opening) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onContinue();
      return;
    }
    setOpening(true);
    enterTimer.current = window.setTimeout(onContinue, 520);
  }

  function trackPointer(event) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setPointerOffset({ x: x * -10, y: y * -8 });
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      enterRoom();
    }
  }

  return (
    <main
      className={`together-screen ${opening ? "is-opening" : ""}`}
      aria-label="Waktu kebersamaan sejak satu Agustus dua ribu dua puluh enam"
      tabIndex={0}
      style={{ "--together-x": `${pointerOffset.x}px`, "--together-y": `${pointerOffset.y}px`, "--timepiece-tilt-x": `${pointerOffset.y * 0.35}deg`, "--timepiece-tilt-y": `${pointerOffset.x * 0.45}deg` }}
      onClick={enterRoom}
      onKeyDown={handleKeyDown}
      onPointerMove={trackPointer}
      onPointerLeave={() => setPointerOffset({ x: 0, y: 0 })}
    >
      <div className="together-photo-layer"><img src={PHOTO} alt="" /></div>
      <section className="together-content">
        <p className="together-kicker"><span /> SEJAK 01 AGUSTUS 2026</p>
        <h1>Hari bertambah.<br /><em>Masih kamu.</em></h1>
        <div className="together-timepiece" aria-label={duration ? `${duration.days} hari bersama` : "Menghitung waktu bersama"}>
          <div className="timepiece-face">
            <div className="timepiece-topline"><span>OUR TIME / 01</span><span>01 AGUSTUS 2026</span></div>
            <div className="timepiece-main">
              <div className="timepiece-day-count"><strong key={duration?.days ?? "loading"}>{duration ? duration.days : "--"}</strong><span>HARI<br />BERSAMA</span></div>
              <div className="timepiece-units" aria-live="off">
                <div className="timepiece-unit unit-hours"><strong key={duration?.hours ?? "loading"}>{duration ? pad(duration.hours) : "--"}</strong><span>JAM</span></div>
                <i>:</i>
                <div className="timepiece-unit unit-minutes"><strong key={duration?.minutes ?? "loading"}>{duration ? pad(duration.minutes) : "--"}</strong><span>MENIT</span></div>
                <i>:</i>
                <div className="timepiece-unit unit-seconds"><strong key={duration?.seconds ?? "loading"} className="timepiece-second">{duration ? pad(duration.seconds) : "--"}</strong><span>DETIK</span></div>
              </div>
            </div>
            <div className="timepiece-footer"><span>WAKTU YANG JADI MILIK KITA</span><span>TERUS BERTAMBAH <i>↗</i></span></div>
          </div>
          <span className="timepiece-shadow" aria-hidden="true" />
        </div>
        <p className="together-note">Dan ceritanya masih berjalan.</p>
      </section>
    </main>
  );
}