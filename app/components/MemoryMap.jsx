"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, MapPin, Plus, X } from "lucide-react";
import { formatDate, getMapUrl, STARTER_MEMORIES } from "../data";

const EMPTY_DRAFT = { title: "", place: "", date: "", note: "", image: "", latitude: "", longitude: "" };

export default function MemoryMap({ memories, setMemories }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState("m1");
  const selectedMemory = memories.find((memory) => memory.id === selectedId) || memories[0];
  const selectedLatitude = Number.parseFloat(selectedMemory?.latitude);
  const selectedLongitude = Number.parseFloat(selectedMemory?.longitude);
  const hasCoordinates = Number.isFinite(selectedLatitude) && Number.isFinite(selectedLongitude);

  function addMemory(event) {
    event.preventDefault();
    const latitude = Number(draft.latitude);
    const longitude = Number(draft.longitude);
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return;
    const memory = {
      ...draft,
      id: `m${Date.now()}`,
      date: formatDate(draft.date),
      sortDate: draft.date,
      latitude,
      longitude,
      image: draft.image || STARTER_MEMORIES[0].image,
    };
    setMemories((current) => [...current, memory]);
    setSelectedId(memory.id);
    setDraft(EMPTY_DRAFT);
    setShowForm(false);
  }

  return (
    <section className="feature-view map-view">
      <div className="feature-heading">
        <div><p className="eyebrow">04 <span className="eyebrow-rule" /> TITIK-TITIK KECIL KITA</p><h1>Pernah <em>di sini.</em></h1></div>
        <button className="primary-button add-memory-top" onClick={() => setShowForm((show) => !show)}>
          {showForm ? <X size={15} /> : <Plus size={15} />} {showForm ? "Tutup form" : "Tambah kenangan"}
        </button>
      </div>

      {showForm && <form className="memory-form" onSubmit={addMemory}>
        <p className="form-kicker"><MapPin size={15} /> TITIK BARU DI PETA</p>
        <div className="memory-form-grid">
          <label>Nama momen<input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Momen yang ingin disimpan" /></label>
          <label>Tempat<input required value={draft.place} onChange={(event) => setDraft({ ...draft, place: event.target.value })} placeholder="Nama kota atau lokasi" /></label>
          <label>Tanggal<input required type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label>
          <label>Foto (URL)<input type="url" value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="https://..." /></label>
          <label>Latitude<input required type="number" step="any" min="-90" max="90" value={draft.latitude} onChange={(event) => setDraft({ ...draft, latitude: event.target.value })} placeholder="-6.2000" /></label>
          <label>Longitude<input required type="number" step="any" min="-180" max="180" value={draft.longitude} onChange={(event) => setDraft({ ...draft, longitude: event.target.value })} placeholder="106.8167" /></label>
          <label className="memory-note-field">Cerita singkat<input required value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} placeholder="Apa yang ingin kalian ingat?" /></label>
        </div>
        <button className="primary-button" type="submit">Simpan titik <MapPin size={15} /></button>
      </form>}

      {selectedMemory ? <div className="map-layout">
        <div className="map-frame">
          {hasCoordinates ? <><iframe key={selectedMemory.id} src={getMapUrl(selectedMemory)} title={`Peta ${selectedMemory.place}`} loading="lazy" /><a className="map-credit" href={`https://www.openstreetmap.org/?mlat=${selectedMemory.latitude}&mlon=${selectedMemory.longitude}#map=14/${selectedMemory.latitude}/${selectedMemory.longitude}`} target="_blank" rel="noreferrer">BUKA PETA <ArrowUpRight size={12} /></a></> : <div className="map-empty"><MapPin size={24} /><strong>Lokasi belum ditambahkan</strong><span>Tambahkan titik koordinat untuk kenangan ini.</span></div>}
        </div>
        <div className="map-moments">
          <div className="list-heading"><span>KENANGAN DI PETA</span><span>{String(memories.length).padStart(2, "0")} TITIK</span></div>
          <div className="memory-pins">{memories.map((memory, index) => <button key={memory.id} className={`memory-pin ${selectedMemory.id === memory.id ? "pin-selected" : ""}`} onClick={() => setSelectedId(memory.id)}>
            <span className="pin-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="pin-copy"><strong>{memory.title}</strong><small><MapPin size={12} /> {memory.place}</small></span>
            <ArrowRight size={15} />
          </button>)}</div>
          <article className="selected-memory"><img src={selectedMemory.image} alt={`Kenangan: ${selectedMemory.title}`} /><div><span className="memory-date">{selectedMemory.date}</span><h2>{selectedMemory.title}</h2><p>{selectedMemory.note}</p></div></article>
          <p className="map-note">Titik bawaan adalah contoh. Tambahkan koordinat tempat kalian sendiri.</p>
        </div>
      </div> : <p className="empty-plans">Tambahkan kenangan pertama untuk mulai mengisi peta.</p>}
    </section>
  );
}
