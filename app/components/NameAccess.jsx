"use client";

import { useState } from "react";
import { ArrowRight, UserRound } from "lucide-react";

const KNOWN_NAMES = {
  rayhan: "Rayhan",
  tari: "Tari",
  einun: "Einun",
};

export default function NameAccess({ onChooseName }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function submitName(event) {
    event.preventDefault();
    const knownName = KNOWN_NAMES[name.trim().toLowerCase()];
    if (!knownName) {
      setError("Nama belum terdaftar. Masukkan Rayhan, Tari, atau Einun.");
      return;
    }

    onChooseName(knownName);
  }

  return (
    <main className="sync-gate">
      <div className="sync-gate-orbit" aria-hidden="true" />
      <section className="sync-gate-panel">
        <span className="sync-gate-mark"><UserRound size={19} /></span>
        <p className="sync-gate-kicker">OUR LITTLE ARCHIVE <i>·</i> RUANG BERDUA</p>
        <h1>Siapa yang<br /><em>datang hari ini?</em></h1>
        <p className="sync-gate-copy">Masukkan nama untuk membuka ruang kita.</p>
        <form className="sync-gate-form" onSubmit={submitName}>
          <label htmlFor="access-name">NAMA</label>
          <input id="access-name" type="text" required autoComplete="off" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} />
          <button className="sync-gate-button" type="submit">Masuk ke ruang kita <ArrowRight size={15} /></button>
        </form>
        {error && <p className="sync-gate-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}