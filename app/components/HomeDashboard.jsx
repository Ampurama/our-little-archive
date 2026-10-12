"use client";

import { ArrowRight, ArrowUpRight, MapPin, Sparkles, Timer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import RelationshipClock from "./RelationshipClock";
import { getMemoryDateKey } from "../data";

const SHORTCUTS = [
  { id: "quiz", title: "Kuis kita", detail: "Seberapa kenal kita?", icon: Sparkles },
  { id: "map", title: "Peta kenangan", detail: "Tempat yang pernah kita datangi", icon: MapPin },
  { id: "countdown", title: "Hitung mundur", detail: "Hari spesial berikutnya", icon: Timer },
];

export default function HomeDashboard({ memories, onNavigate }) {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [pointerTilt, setPointerTilt] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [stackOffset, setStackOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const dragStart = useRef(null);
  const suppressClick = useRef(false);
  const timeline = [...memories].sort((left, right) => getMemoryDateKey(left).localeCompare(getMemoryDateKey(right)));
  const stackMemories = timeline.slice(0, 4);
  const displayedStack = stackMemories.map((_, index) => stackMemories[(index + stackOffset) % stackMemories.length]);
  const supportingMemories = timeline.slice(stackMemories.length);

  useEffect(() => setPortalReady(true), []);

  useEffect(() => {
    if (!selectedMemory || !portalReady) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [portalReady, selectedMemory]);

  function trackArchivePointer(event) {
    if (event.pointerType === "mouse") {
      const bounds = event.currentTarget.getBoundingClientRect();
      setPointerTilt({
        x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -5,
        y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 6,
      });
    }

    if (dragStart.current) {
      const offsetX = event.clientX - dragStart.current.x;
      const offsetY = event.clientY - dragStart.current.y;
      if (Math.abs(offsetX) > 3 || Math.abs(offsetY) > 3) {
        setIsDragging(true);
        setDragOffset({ x: offsetX, y: offsetY });
      }
    }
  }

  function startArchiveDrag(event) {
    if (event.button !== 0) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
  }

  function finishArchiveDrag(event) {
    if (!dragStart.current) return;
    const offsetX = event.clientX - dragStart.current.x;
    const offsetY = event.clientY - dragStart.current.y;
    const didSwipe = Math.abs(offsetX) > 55 && Math.abs(offsetX) > Math.abs(offsetY);

    if (didSwipe && stackMemories.length > 1) {
      suppressClick.current = true;
      setStackOffset((offset) => (offset + (offsetX < 0 ? 1 : stackMemories.length - 1)) % stackMemories.length);
      window.setTimeout(() => { suppressClick.current = false; }, 0);
    }

    dragStart.current = null;
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }

  function openStackPhoto(event, memory) {
    if (suppressClick.current) {
      event.preventDefault();
      suppressClick.current = false;
      return;
    }
    setSelectedMemory(memory);
  }

  return (
    <section className="home-gallery">
      <div className="archive-coverline"><span>OUR LITTLE ARCHIVE</span><span>SEBUAH CERITA, PUNYA KITA</span><span>{String(memories.length).padStart(2, "0")} MOMEN</span></div>

      {stackMemories.length > 0 && <section className="archive-hero">
        <div className="archive-hero-copy">
          <p className="archive-hero-kicker">ALBUM KENANGAN <span>·</span> 2026</p>
          <h1>Segala kecil<br />tentang <em>kita.</em></h1>
          <p>Sembilan momen, satu ruang kecil untuk mengingatnya.</p>
          <span className="archive-hero-index">OUR LITTLE ARCHIVE <i>—</i> DISIMPAN DENGAN SAYANG</span>
        </div>
        <div className={`archive-photo-stage ${isDragging ? "is-dragging" : ""}`} onPointerDown={startArchiveDrag} onPointerMove={trackArchivePointer} onPointerUp={finishArchiveDrag} onPointerCancel={finishArchiveDrag} onPointerLeave={() => { setPointerTilt({ x: 0, y: 0 }); if (dragStart.current) finishArchiveDrag({ clientX: dragStart.current.x, clientY: dragStart.current.y }); }} style={{ "--archive-tilt-x": `${pointerTilt.x}deg`, "--archive-tilt-y": `${pointerTilt.y}deg`, "--archive-drag-x": `${dragOffset.x}px`, "--archive-drag-y": `${dragOffset.y}px` }}>
          {displayedStack.map((memory, index) => <button className={`archive-stack-card archive-stack-card-${index + 1}`} key={memory.id} onClick={(event) => openStackPhoto(event, memory)} aria-label={`Buka cerita ${memory.title}`} draggable="false">
            <img src={memory.image} alt={memory.title} />
            <span className="archive-stack-label"><small>{memory.date}</small><strong>{memory.title}</strong></span>
            <span className="archive-stack-heart" aria-hidden="true">♡</span>
          </button>)}
          <span className="archive-stack-caption">GESER FOTO UNTUK MENJELAJAH</span>
        </div>
      </section>}

      <RelationshipClock onOpenCountdown={() => onNavigate("countdown")} />

      <section className="archive-body">
        <div className="archive-timeline-panel">
          <header className="archive-section-heading"><div><p>GARIS WAKTU <span>·</span> {String(timeline.length).padStart(2, "0")} CERITA</p><h2>Dimulai dari <em>kita.</em></h2></div><span>2026</span></header>
          <div className="archive-timeline-list">{timeline.map((memory, index) => <button className="archive-timeline-entry" key={memory.id} onClick={() => setSelectedMemory(memory)}>
            <span className="archive-timeline-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="archive-timeline-date">{memory.date}</span>
            <span className="archive-timeline-story"><strong>{memory.title}</strong><small>{memory.note}</small></span>
            <ArrowRight size={14} />
          </button>)}</div>
        </div>

        <div className="archive-memory-panel">
          <header className="archive-section-heading"><div><p>FOTO-FOTO LAINNYA</p><h2>Disimpan <em>baik-baik.</em></h2></div><button onClick={() => onNavigate("map")} aria-label="Lihat peta kenangan"><MapPin size={17} /></button></header>
          <div className="archive-memory-grid">{supportingMemories.map((memory, index) => <button className="archive-memory-photo" key={memory.id} onClick={() => setSelectedMemory(memory)} aria-label={`Buka cerita ${memory.title}`}>
            <img src={memory.image} alt={memory.title} /><span>{String(index + stackMemories.length + 1).padStart(2, "0")}</span>
          </button>)}</div>
        </div>
      </section>

      <nav className="archive-shortcuts" aria-label="Bagian ruang kita">
        {SHORTCUTS.map(({ id, title, detail, icon: Icon }) => (
          <button key={id} onClick={() => onNavigate(id)}><Icon size={17} strokeWidth={1.7} /><span><strong>{title}</strong><small>{detail}</small></span><ArrowUpRight size={15} /></button>
        ))}
      </nav>

      {portalReady && selectedMemory && createPortal(<div className="story-backdrop" role="presentation" onClick={() => setSelectedMemory(null)} onKeyDown={(event) => { if (event.key === "Escape") setSelectedMemory(null); }}>
        <article className="story-modal" role="dialog" aria-modal="true" aria-labelledby="story-title" onClick={(event) => event.stopPropagation()}>
          <button className="story-close" onClick={() => setSelectedMemory(null)} aria-label="Tutup cerita"><X size={18} /></button>
          <img src={selectedMemory.image} alt={selectedMemory.title} />
          <div className="story-copy"><p className="eyebrow">{selectedMemory.date} <span className="eyebrow-rule" /> {selectedMemory.place}</p><h2 id="story-title">{selectedMemory.title}</h2><p>{selectedMemory.note}</p><span className="story-index">OUR LITTLE ARCHIVE / {String(timeline.indexOf(selectedMemory) + 1).padStart(2, "0")}</span></div>
        </article>
      </div>, document.body)}
    </section>
  );
}
