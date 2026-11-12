'use client';
import Link from 'next/link';
import { useState } from 'react';

const DATA = [
  ['Nomor', '0857-••••-1204', 'Tugas review', 12],
  ['Rekening', 'BCA ••••4821', 'Like & deposit', 5],
  ['Perusahaan', 'PT Maju Jaya', 'Loker BUMN palsu', 3],
  ['Nomor', '0821-••••-7765', 'Admin pinjol', 8],
  ['Rekening', 'BRI ••••0937', 'Tiket travel', 2],
];
const FEED = [
  ['0812-••••-3921', 'Tugas review · baru saja'],
  ['Mandiri ••••5518', 'Like & deposit · 4 menit lalu'],
  ['0896-••••-2240', 'APK surat panggilan · 11 menit lalu'],
];
const FILTERS = ['Semua', 'Nomor', 'Rekening', 'Perusahaan'];

export default function Radar() {
  const [q, setQ] = useState('');
  const [f, setF] = useState('Semua');
  const rows = DATA.filter((r) => (f === 'Semua' || r[0] === f) && `${r[1]} ${r[2]}`.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <section className="w sec">
      <span className="tag">Radar Blacklist</span>
      <h1 className="ttl">Cek nomor atau rekening</h1>
      <p className="mu lead">Cari dulu sebelum kamu transfer. Datanya berasal dari laporan korban lain.</p>

      <div className="card mb" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input className="in" style={{ flex: 1, minWidth: 240 }} aria-label="Cari" placeholder="Ketik nomor WA, rekening, atau nama perusahaan" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="btn" onClick={() => document.querySelector('.tbl')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Cari</button>
      </div>

      <div className="split s21">
        <div className="card">
          <div className="chips">
            {FILTERS.map((x) => (<button key={x} type="button" className={`chip ${f === x ? 'on' : ''}`} onClick={() => setF(x)}>{x}</button>))}
            <span className="tag w2" style={{ marginLeft: 'auto' }}>Data contoh</span>
          </div>
          <div className="sc">
            <table className="tbl">
              <thead><tr><th>Jenis</th><th>Data</th><th>Modus</th><th>Laporan</th></tr></thead>
              <tbody>
                {rows.map(([j, d, m, n]) => (
                  <tr key={d} className="ro"><td>{j}</td><td className="m">{d}</td><td>{m}</td><td><span className="tag r">{n}</span></td></tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '32px 10px', textAlign: 'center' }}>
                    <b>Tidak ditemukan di blacklist.</b>
                    <p className="mu" style={{ margin: '6px 0 16px' }}>Ini belum tentu aman, penipu sering ganti nomor.</p>
                    <Link href="/scanner" className="btn">Periksa dengan AI Scanner</Link>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lst" style={{ gap: 24 }}>
          <div className="card tint">
            <h2 className="h2" style={{ fontSize: 22 }}>Baru dilaporkan</h2>
            <div className="lst" style={{ gap: 12 }}>
              {FEED.map(([a, b]) => (<div className="rw" key={a}><span className="dot" /><span><b className="m">{a}</b><br /><span className="mu sm">{b}</span></span></div>))}
            </div>
          </div>
          <div className="card">
            <b>Menemukan penipu baru?</b>
            <p className="mu" style={{ margin: '6px 0 14px' }}>Laporanmu membantu pelamar lain terhindar.</p>
            <Link href="/lapor" className="btn r">Laporkan sekarang</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
