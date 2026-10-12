"use client";

import { Aperture } from "lucide-react";
import { NAV_ITEMS } from "../data";

export default function AppShell({ activeView, onNavigate, specialTitle, children, navItems = NAV_ITEMS }) {
  const activeItem = navItems.find((item) => item.id === activeView);

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <button className="brand" onClick={() => onNavigate("home")} aria-label="Ke beranda">
          <span className="brand-mark"><Aperture size={18} strokeWidth={1.7} /></span>
          <span>ruang<span className="brand-light">kita</span><small>PERSONAL PHOTO LOG</small></span>
        </button>
        <nav className="main-nav" aria-label="Menu utama">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${activeView === id ? "selected" : ""}`} onClick={() => onNavigate(id)} aria-current={activeView === id ? "page" : undefined}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{activeView === id && <span className="nav-marker" />}
            </button>
          ))}
        </nav>
        <div className="app-topbar-index"><span>INDEX / 01</span><span>2026</span></div>
      </header>
      <main className="view-content" key={activeView}>{children}</main>
      <footer className="app-footer"><span>RUANG KITA <i className="footer-dot" /> ARSIP PRIBADI</span><span>{activeItem?.label.toUpperCase()} / 01</span></footer>
    </div>
  );
}
