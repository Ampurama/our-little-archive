"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getMemoryDateKey } from "../data";

export default function PhotoJourney({ memories, onFinish }) {
  const orderedMemories = [...memories].sort((left, right) => getMemoryDateKey(left).localeCompare(getMemoryDateKey(right)));
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [canRevealStory, setCanRevealStory] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const changeTimer = useRef(null);
  const revealTimer = useRef(null);
  const memory = orderedMemories[photoIndex];
  const isLastPhoto = photoIndex === orderedMemories.length - 1;

  useEffect(() => () => {
    window.clearTimeout(changeTimer.current);
    window.clearTimeout(revealTimer.current);
  }, []);

  function advance() {
    if (isChanging || !canRevealStory) return;
    if (!showStory) {
      setShowStory(true);
      return;
    }
    if (isLastPhoto) {
      onFinish();
      return;
    }
    setShowStory(false);
    setIsChanging(true);
    setCanRevealStory(false);
    changeTimer.current = window.setTimeout(() => {
      setPhotoIndex((index) => index + 1);
      setIsChanging(false);
      revealTimer.current = window.setTimeout(() => setCanRevealStory(true), 950);
    }, 430);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advance();
    }
  }

  function trackPointer(event) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: y * -2.4, y: x * 3.2 });
  }

  if (!memory) return null;

  return (
    <main className={`photo-journey ${isChanging ? "is-changing" : ""}`} tabIndex={0} aria-label="Album foto kenangan" style={{ "--journey-tilt-x": `${tilt.x}deg`, "--journey-tilt-y": `${tilt.y}deg` }} onClick={advance} onKeyDown={handleKeyDown} onPointerMove={trackPointer} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="photo-journey-backdrop" key={`backdrop-${memory.id}`}><img src={memory.image} alt="" /></div>
      <div className="photo-journey-vignette" />
      <div className={`photo-journey-image-wrap ${showStory ? "story-visible" : ""}`} key={memory.id}>
        <img className="photo-journey-image" src={memory.image} alt={memory.title} />
      </div>
      <section className={`photo-journey-story ${showStory ? "visible" : ""}`} aria-live="polite">
        <p>{memory.date} <i>·</i> {memory.place}</p>
        <h1>{memory.title}</h1>
        <span>{memory.note}</span>
        <small className="photo-journey-signature">— Rayhan</small>
      </section>
      <div className="photo-journey-bottom">
        {showStory && isLastPhoto && <button className="photo-journey-enter" onClick={(event) => { event.stopPropagation(); onFinish(); }}>Masuk ke menu utama <ArrowRight size={15} /></button>}
      </div>
    </main>
  );
}
