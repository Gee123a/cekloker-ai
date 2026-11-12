import './globals.css';
import Nav from '../components/Nav';

export const metadata = {
  title: 'CekLoker.ai — Cek apakah loker ini penipuan',
  description: 'Upload screenshot chat atau poster loker, AI memeriksa dan memberi skor risiko penipuan.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="ft">
          <div className="w">
            <b>CekLoker.ai</b>
            <span>Hasil adalah indikasi risiko, bukan putusan hukum. Korban bisa lapor ke cekrekening.id atau patrolisiber.id</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
