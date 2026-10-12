"use client";

import { useState } from "react";
import { CalendarDays, Check, MapPin, Plus, Trash2 } from "lucide-react";
import { formatDate } from "../data";

export default function DatePlanner({ plans, setPlans }) {
  const [draft, setDraft] = useState({ title: "", place: "", date: "" });
  const [notice, setNotice] = useState("");

  function addPlan(event) {
    event.preventDefault();
    setPlans((current) => [...current, { ...draft, id: `p${Date.now()}`, done: false }]);
    setDraft({ title: "", place: "", date: "" });
    setNotice("Rencana kencan tersimpan.");
    window.setTimeout(() => setNotice(""), 2400);
  }

  return (
    <section className="feature-view">
      <div className="feature-heading"><div><p className="eyebrow">02 <span className="eyebrow-rule" /> RENCANA YANG MENUNGGU</p><h1>Mau ke mana <em>kita?</em></h1></div><span className="heading-count">{plans.filter((plan) => !plan.done).length} RENCANA</span></div>
      <div className="planner-layout">
        <form className="planner-form" onSubmit={addPlan}>
          <p className="form-kicker"><Plus size={15} /> TAMBAH RENCANA</p>
          <label>Ide kencan<input required maxLength={60} placeholder="Misalnya: cari ramen terenak" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
          <label>Tempat<input required maxLength={70} placeholder="Nama tempat atau area" value={draft.place} onChange={(event) => setDraft({ ...draft, place: event.target.value })} /></label>
          <label>Tanggal<input required type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label>
          <button className="primary-button" type="submit">Simpan ide <Plus size={16} /></button>
          {notice && <p className="inline-notice"><Check size={14} /> {notice}</p>}
        </form>
        <div className="plan-list"><div className="list-heading"><span>DAFTAR KENCAN</span><span>URUT BERDASARKAN TANGGAL</span></div>
          {plans.length ? [...plans].sort((a, b) => a.date.localeCompare(b.date)).map((plan) => <article className={`plan-row ${plan.done ? "plan-done" : ""}`} key={plan.id}>
            <button className="plan-check" onClick={() => setPlans((current) => current.map((item) => item.id === plan.id ? { ...item, done: !item.done } : item))} aria-label={plan.done ? "Tandai belum terlaksana" : "Tandai sudah terlaksana"}>{plan.done && <Check size={15} />}</button>
            <div className="plan-details"><span className="plan-date"><CalendarDays size={13} /> {formatDate(plan.date)}</span><h2>{plan.title}</h2><span className="plan-place"><MapPin size={13} /> {plan.place}</span></div>
            <button className="delete-button" onClick={() => setPlans((current) => current.filter((item) => item.id !== plan.id))} aria-label={`Hapus ${plan.title}`}><Trash2 size={15} /></button>
          </article>) : <div className="empty-plans"><CalendarDays size={22} /><p>Belum ada ide di daftar.</p><span>Satu rencana kecil bisa jadi cerita besar.</span></div>}
        </div>
      </div>
    </section>
  );
}
