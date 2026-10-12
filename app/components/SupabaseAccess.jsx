"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function SupabaseAccess({ user, isMember, membershipError, onSignOut }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function sendLink(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    setMessage("");

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });

    setSending(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setMessage("Tautan masuk sudah dikirim. Buka email di perangkat ini untuk melanjutkan.");
  }

  return (
    <main className="sync-gate">
      <div className="sync-gate-orbit" aria-hidden="true" />
      <section className="sync-gate-panel">
        <span className="sync-gate-mark"><Mail size={19} /></span>
        <p className="sync-gate-kicker">OUR LITTLE ARCHIVE <i>·</i> RUANG BERDUA</p>
        {user && !isMember ? <>
          <h1>Ruang ini<br /><em>khusus berdua.</em></h1>
          <p className="sync-gate-copy">{membershipError ? "Akses anggota belum siap. Pastikan akun ini sudah ditambahkan sebagai anggota di Supabase." : `Email ${user.email} belum ditambahkan sebagai anggota album.`}</p>
          <button className="sync-gate-button" onClick={onSignOut}>Keluar dari akun <ArrowRight size={15} /></button>
        </> : <>
          <h1>Satu album,<br /><em>berdua saja.</em></h1>
          <p className="sync-gate-copy">Masuk dengan email agar cerita, kuis, dan rencana kita tersimpan sama di kedua perangkat.</p>
          <form className="sync-gate-form" onSubmit={sendLink}>
            <label htmlFor="sync-email">EMAIL KAMU</label>
            <input id="sync-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" />
            <button className="sync-gate-button" type="submit" disabled={sending}>{sending ? "Mengirim tautan..." : "Kirim tautan masuk"} <ArrowRight size={15} /></button>
          </form>
          {message && <p className="sync-gate-message">{message}</p>}
          {error && <p className="sync-gate-error">{error}</p>}
        </>}
      </section>
    </main>
  );
}
