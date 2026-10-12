"use client";

import { ArrowRight, Heart } from "lucide-react";

export default function AinunIntro({ onContinue }) {
  return (
    <main className="ainun-intro">
      <div className="ainun-intro-photo"><img src="/image/16agustus(2).jpeg" alt="Foto kenangan Rayhan dan Utari" /></div>
      <div className="ainun-intro-shade" />
      <section className="ainun-intro-copy">
        <p className="ainun-intro-kicker"><span>CATATAN KHUSUS</span><Heart size={13} fill="currentColor" /></p>
        <h1>Haii Ainun,<br /><em>masih jomblo yaa?</em></h1>
        <p>Nikmatin kebucinan kita yaa...</p>
        <button onClick={onContinue}>Wkwk, lanjut lihat album <ArrowRight size={16} /></button>
      </section>
      <span className="ainun-intro-signature">— DARI RAYHAN & UTARI</span>
    </main>
  );
}
