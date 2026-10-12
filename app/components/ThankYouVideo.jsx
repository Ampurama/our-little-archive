"use client";

import { ArrowRight } from "lucide-react";

export default function ThankYouVideo({ onContinue }) {
  return (
    <main className="thank-you-screen">
      <div className="thank-you-film"><video src="/image/16agustus.mp4" poster="/image/16agustus.jpeg" autoPlay loop playsInline controls preload="auto" /></div>
      <section className="thank-you-copy">
        <p className="thank-you-kicker">OUR LITTLE ARCHIVE <span>·</span> 16 AGUSTUS 2026</p>
        <h1>Terima kasih,<br /><em>Utari.</em></h1>
        <p className="thank-you-message">Sudah menemani aku sejauh ini. Semoga kita masih punya banyak hari, tawa, dan cerita kecil untuk disimpan bersama.</p>
        <div className="thank-you-actions"><span>— RAYHAN</span><button className="thank-you-continue" onClick={onContinue}>Masuk ke album <ArrowRight size={16} /></button></div>
      </section>
      <span className="thank-you-index">16 / 08 / 2026</span>
    </main>
  );
}
