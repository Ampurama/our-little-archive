"use client";

import { useEffect, useRef, useState } from "react";

const INTRO_LINES = ["Haiii, Utarii.", "Ini buat kamuuu.", "Dari akuu, Rayhan."];
const INTRO_MESSAGE = "Haiii, Utarii. Ini buat kamuuu. Dari akuu, Rayhan.";

const INTRO_PHOTO = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=2400&q=90";
const AUTO_ENTER_DELAY_MS = 12000;

export default function IntroScreen({ onEnter, onUserGesture }) {
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [opening, setOpening] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const openTimer = useRef(null);
  const typingDone = lineIndex === INTRO_LINES.length;

  useEffect(() => () => window.clearTimeout(openTimer.current), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLineIndex(INTRO_LINES.length);
    }
  }, []);

  useEffect(() => {
    if (typingDone) return undefined;

    const line = INTRO_LINES[lineIndex];
    const delay = typedText.length === 0 ? 230 : typedText.length === line.length ? 420 : 72;
    const timer = window.setTimeout(() => {
      if (typedText.length < line.length) {
        setTypedText(line.slice(0, typedText.length + 1));
      } else {
        setTypedText("");
        setLineIndex((index) => index + 1);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [lineIndex, typedText, typingDone]);

  useEffect(() => {
    if (!typingDone || opening) return undefined;

    const timer = window.setTimeout(() => {
      setOpening(true);
      openTimer.current = window.setTimeout(onEnter, 520);
    }, AUTO_ENTER_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [onEnter, opening, typingDone]);
  function trackPointer(event) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setPointerOffset({ x: x * -12, y: y * -10 });
  }

  function advanceIntro() {
    if (opening) return;
    onUserGesture();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onEnter();
      return;
    }
    setOpening(true);
    openTimer.current = window.setTimeout(onEnter, 520);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advanceIntro();
    }
  }

  return (
    <main
      className={`intro-screen ${opening ? "is-opening" : ""}`}
      aria-label="Pesan pembuka untuk Utari"
      tabIndex={0}
      style={{ "--light-x": `${50 + pointerOffset.x * -2}%`, "--light-y": `${43 + pointerOffset.y * -2}%` }}
      onClick={advanceIntro}
      onKeyDown={handleKeyDown}
      onPointerMove={trackPointer}
      onPointerLeave={() => setPointerOffset({ x: 0, y: 0 })}
    >
      <div className="intro-photo-layer">
        <img className="intro-image" src={INTRO_PHOTO} alt="" style={{ transform: `scale(1.06) translate(${pointerOffset.x}px, ${pointerOffset.y}px)` }} />
      </div>
      <span className="intro-light-sweep" aria-hidden="true" />
      <section className="intro-hero">
        <div className="intro-copy">
          <p className="intro-kicker">SEBUAH PESAN UNTUKMU</p>
          <h1 className="intro-message" aria-label={INTRO_MESSAGE}>
            {INTRO_LINES.map((line, index) => (
              <span className={`intro-message-line ${index === 2 ? "signed-line" : ""} ${index < lineIndex ? "line-complete" : ""}`} key={line}>
                {index < lineIndex ? line : index === lineIndex ? typedText : ""}
                {index === lineIndex && !typingDone && <span className="typing-caret" aria-hidden="true" />}
              </span>
            ))}
          </h1>
        </div>
      </section>
    </main>
  );
}
