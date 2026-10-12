import "./globals.css";

export const metadata = {
  title: "Ruang Kita — arsip kecil berdua",
  description: "Surat, rencana kencan, kuis, peta kenangan, dan hitung mundur untuk kalian berdua.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
