import { House, MapPin, Sparkles, Timer } from "lucide-react";

export const NAV_ITEMS = [
  { id: "home", label: "Beranda", icon: House },
  { id: "quiz", label: "Kuis kita", icon: Sparkles },
  { id: "map", label: "Peta kenangan", icon: MapPin },
  { id: "countdown", label: "Hitung mundur", icon: Timer },
];

export const STARTER_MEMORIES = [

{ id: "m9", title: "Senja di tepi laut", place: "Lokasi belum dicatat", date: "26 September 2026", sortDate: "2026-09-26", note: "senja cantik, laut cantik, pacarku paling cantik. lengkap sudah sore ini.", image: "/image/26september(1).jpeg" },

{ id: "m8", title: "LDR againn...", place: "Lokasi belum dicatat", date: "30 Agustus 2026", sortDate: "2026-08-30", note: "ketemu lagi, senang lagi, terus harus LDR lagi. siapa suruh jatuh cintanya sama kamu.", image: "/image/30agustus.jpeg" },

{ id: "m7", title: "Panasnyaa Malinoo deh", place: "Lokasi belum dicatat", date: "29 Agustus 2026", sortDate: "2026-08-29", note: "malino panas sekalii, tapi nda sepanas kamuu.", image: "/image/29agustus.jpeg" },

{ id: "m6", title: "Satu meja, satu cerita", place: "Lokasi belum dicatat", date: "16 Agustus 2026", sortDate: "2026-08-16", note: "niatnya makan, malah lebih banyak cerita sama ketawa", image: "/image/16gustus(3).jpeg" },

{ id: "m5", title: "Photobooth kedua", place: "Lokasi belum dicatat", date: "16 Agustus 2026", sortDate: "2026-08-16", note: "photobooth kedua kitaa, kayaknya harus bikin lagi deh", image: "/image/16agustus(2).jpeg" },

{ id: "m4", title: "Eskalator Keramat", place: "Lokasi belum dicatat", date: "16 Agustus 2026", sortDate: "2026-08-16", note: "eskalator keramat katanya.", image: "/image/16agustus(1).jpeg" },

{ id: "m3", title: "Di perjalanan", place: "Lokasi belum dicatat", date: "16 Agustus 2026", sortDate: "2026-08-16", note: "pergi ke mana sebenarnya nda terlalu penting, yang penting jalannya sama kamu. cieee, gombal sedikit.", image: "/image/16agustus.jpeg" },

{ id: "m2", title: "Awak bulan kita", place: "Lokasi belum dicatat", date: "2 Agustus 2026", sortDate: "2026-08-02", note: "awal bulan sama kamu, semoga bukan cuma awal bulan yang sama-sama terus, tapi sampai tua nanti juga.", image: "/image/2agustus(1).jpg" },

{ id: "m1", title: "Awal bulan kita", place: "Lokasi belum dicatat", date: "2 Agustus 2026", sortDate: "2026-08-02", note: "foto awal bulan kitaa. nda nyangka sekarang jadi orang yang paling sering saya rindukan.", image: "/image/2agustus.jpeg" },

];

export const STARTER_PLANS = [
  { id: "p1", title: "Piknik sore", place: "Taman kota", date: "2026-10-24", done: false },
  { id: "p2", title: "Masak menu baru", place: "Dapur kita", date: "2026-11-07", done: false },
];


export const STARTER_QUESTIONS = [
  {
    id: "q1",
    question: "Kalau pacarmu bilang 'terserah', kamu harus...",
    options: [
      "Pilih yang benar biar tidak perang dunia",
      "Ikut terserah juga",
      "Langsung pesan makanan sendiri"
    ],
    correctIndex: 0
  },
  {
    id: "q2",
    question: "Kalau kita lagi LDR dan saya bilang kangen, kamu...",
    options: [
      "Ikut kangen, kapan ketemu lagi?",
      "Ya sudah, tidur sana",
      "Kirim foto KTP biar bisa saya samperin"
    ],
    correctIndex: 0
  },
  {
    id: "q3",
    question: "Siapa yang paling susah berhenti ngomong kalau sudah teleponan?",
    options: [
      "Kita berdua, sampai lupa waktu",
      "Kamu, saya cuma korban",
      "Tetangga yang dengar suara kita"
    ],
    correctIndex: 0
  },
  {
    id: "q4",
    question: "Kalau pacarmu lagi ngambek, langkah pertama adalah...",
    options: [
      "Bujuk baik-baik sambil bilang sayang",
      "Ikut ngambek biar adil",
      "Menghilang sampai situasi aman"
    ],
    correctIndex: 0
  },
  {
    id: "q5",
    question: "Kalau dikasih uang satu miliar, hal pertama yang kita lakukan...",
    options: [
      "Nikah, terus bulan madu berdua",
      "Beli skincare satu toko",
      "Beli tiket ketemu, LDR sudah cukup"
    ],
    correctIndex: 0
  }
];


export const STARTER_SPECIAL = { title: "Hari spesial kita", date: "2026-12-24" };
export const DEFAULT_LETTER_PHOTO = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80";

export const DAILY_MESSAGES = [
  "Hari biasa terasa istimewa kalau ada kamu.",
  "Semoga hari ini menyisakan cerita kecil untuk kita.",
  "Pelan-pelan saja. Kita masih punya banyak waktu.",
  "Satu pesan darimu bisa mengubah seluruh hariku.",
  "Nanti kita kenang hari ini, ya.",
  "Selalu ada alasan baru untuk memilihmu lagi.",
  "Sampai bertemu, aku simpan cerita dulu di sini.",
];

export function formatDate(date) {
  if (!date) return "Pilih tanggal";
  return new Date(`${date}T12:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const MONTH_NUMBERS = {
  jan: "01", januari: "01", feb: "02", februari: "02", mar: "03", maret: "03",
  apr: "04", april: "04", mei: "05", jun: "06", juni: "06", jul: "07", juli: "07",
  agu: "08", ags: "08", agustus: "08", sep: "09", september: "09", okt: "10",
  oktober: "10", nov: "11", november: "11", des: "12", desember: "12",
};

export function getMemoryDateKey(memory) {
  if (memory.sortDate) return memory.sortDate;
  const match = memory.date?.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
  if (!match) return "";
  const [, day, monthName, year] = match;
  const month = MONTH_NUMBERS[monthName.toLowerCase()];
  return month ? `${year}-${month}-${day.padStart(2, "0")}` : "";
}

export function getMapUrl(memory) {
  const latitude = Number(memory.latitude);
  const longitude = Number(memory.longitude);
  const bounds = [longitude - 0.035, latitude - 0.023, longitude + 0.035, latitude + 0.023].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bounds)}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

export function getDailyMessage(timestamp) {
  const date = new Date(timestamp || 0);
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length];
}
