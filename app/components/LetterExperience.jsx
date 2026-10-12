"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Mail, Music2, Pause, PencilLine, RotateCcw } from "lucide-react";
import { DEFAULT_LETTER_PHOTO } from "../data";
import useStoredState from "../hooks/useStoredState";

const DEFAULT_LETTER = "Aku suka bagaimana hal-hal biasa berubah jadi cerita kalau ada kamu.\n\nTerima kasih sudah jadi tempat pulang, teman paling sabar, dan alasan kenapa hari sederhana terasa istimewa.\n\nSemoga kita selalu punya waktu untuk membuat kenangan baru. Hari ini, besok, dan seterusnya.";

export default function LetterExperience() {
  const [letterText, setLetterText] = useStoredState("ruang-kita-letter", DEFAULT_LETTER);
  const [letterTo, setLetterTo] = useStoredState("ruang-kita-recipient", "Sayang");
  const [letterPhoto, setLetterPhoto] = useStoredState("ruang-kita-letter-photo", DEFAULT_LETTER_PHOTO);
  const [letterStep, setLetterStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const audioTimerRef = useRef(null);
  const paragraphs = letterText.split(/\n\s*\n/).filter(Boolean);

  useEffect(() => () => {
    window.clearInterval(audioTimerRef.current);
    if (audioRef.current) audioRef.current.close();
  }, []);

  function toggleMusic() {
    if (audioRef.current) {
      window.clearInterval(audioTimerRef.current);
      audioRef.current.close();
      audioRef.current = null;
      setMusicOn(false);
      return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    audioRef.current = context;
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    let noteIndex = 0;
    const playNote = () => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = notes[noteIndex % notes.length];
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.65);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.68);
      noteIndex += 1;
    };
    playNote();
    audioTimerRef.current = window.setInterval(playNote, 620);
    setMusicOn(true);
  }

  return (
    <section className="feature-view letter-view">
      <div className="feature-heading"><div><p className="eyebrow">01 <span className="eyebrow-rule" /> KATA-KATA YANG DISIMPAN</p><h1>Surat <em>untukmu.</em></h1></div><button className={`sound-button ${musicOn ? "sound-on" : ""}`} onClick={toggleMusic}>{musicOn ? <Pause size={15} /> : <Music2 size={15} />} {musicOn ? "Jeda nada" : "Putar nada"}</button></div>
      <div className="letter-layout">
        <div className={`envelope ${letterStep > 0 ? "envelope-open" : ""}`}>
          <figure className="envelope-snapshot"><img src={letterPhoto} alt="Foto kenangan untuk surat" /><figcaption>FOTO KITA</figcaption></figure>
          <div className="envelope-paper"><Mail size={28} strokeWidth={1.3} /><span>SURAT KECIL</span><strong>Untuk {letterTo || "kamu"}</strong><small>DIBUKA SAAT KAMU SIAP</small></div>
          <div className="envelope-flap" />
          <div className="envelope-seal"><Heart size={17} fill="currentColor" /></div>
          <span className="envelope-index">01 — 03</span>
        </div>
        <article className="letter-paper">
          <div className="paper-topline"><span>CATATAN PRIBADI</span><span>{letterStep ? `${Math.min(letterStep, paragraphs.length)} / ${paragraphs.length}` : "BELUM DIBUKA"}</span></div>
          <p className="letter-greeting">Untuk {letterTo || "kamu"},</p>
          {letterStep === 0 ? <div className="letter-placeholder"><Mail size={22} /><p>Ada beberapa hal yang ingin kusimpan di sini.</p><span>SURAT INI PUNYAMU SAJA</span></div> : <div className="letter-body">{paragraphs.slice(0, letterStep).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{letterStep >= paragraphs.length && <p className="letter-signoff">Dengan sayang,<br /><em>aku.</em></p>}</div>}
          <div className="letter-actions"><button className="primary-button" onClick={() => setLetterStep((step) => step === paragraphs.length ? 0 : Math.min(step + 1, paragraphs.length))}>{letterStep === 0 ? "Buka surat" : letterStep === paragraphs.length ? "Baca lagi" : "Lanjut membaca"} {letterStep === paragraphs.length ? <RotateCcw size={15} /> : <ArrowRight size={15} />}</button><button className="quiet-button" onClick={() => setEditing((value) => !value)}><PencilLine size={15} /> {editing ? "Selesai mengubah" : "Ubah isi surat"}</button></div>
          {editing && <div className="letter-editor"><label>Nama panggilan<input value={letterTo} onChange={(event) => setLetterTo(event.target.value)} maxLength={40} /></label><label>Foto kenangan (URL)<input type="url" value={letterPhoto} onChange={(event) => setLetterPhoto(event.target.value)} placeholder="https://..." /></label><label>Isi surat<textarea value={letterText} onChange={(event) => setLetterText(event.target.value)} rows={7} /></label><p>Tiap paragraf baru akan terbuka satu per satu.</p></div>}
        </article>
      </div>
      <p className="feature-footnote"><Music2 size={13} /> Nada pengiring dibuat langsung di perangkatmu.</p>
    </section>
  );
}
