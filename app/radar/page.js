'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const FALLBACK_DATA = [
  ['Perusahaan', 'Shopee Task Partnership', 'Tugas review e-commerce', 62],
  ['Perusahaan', 'PT Samudera Logistik Indo', 'APK surat panggilan', 51],
  ['Rekening', 'Mandiri - 883056365', 'APK surat panggilan', 1],
  ['Nomor', '08211758183', 'APK surat panggilan', 1],
  ['Rekening', 'BRI - 109088086', 'Ketik dokumen berbayar', 1],
];
const FALLBACK_FEED = [
  ['BRI - 109088086', 'Ketik dokumen berbayar · Bandung'],
  ['BRI - 554794021', 'Like & deposit · Tangerang'],
  ['Mandiri - 883056365', 'APK surat panggilan · Medan'],
];
const FILTERS = ['Semua', 'Nomor', 'Rekening', 'Perusahaan'];

export default function Radar() {
  const [q, setQ] = useState('');
  const [f, setF] = useState('Semua');
  const [rows, setRows] = useState(FALLBACK_DATA);
  const [feed, setFeed] = useState(FALLBACK_FEED);
  const [meta, setMeta] = useState('1.112 Blacklist · 550 Laporan');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams({ q: q.trim(), filter: f, limit: '30' });
    fetch(`/api/radar?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (!active || !data?.ok) return;
        setRows(data.rows || []);
        if (data.feed?.length) setFeed(data.feed);
        setMeta(`${data.totalBlacklist || 1112} Blacklist · ${data.totalReports || 550} Laporan`);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [q, f]);

  return (
    <section className="w sec">
      <span className="tag">Radar Blacklist</span>
      <h1 className="ttl">Cek nomor atau rekening</h1>
      <p className="mu lead">Cari dulu sebelum kamu transfer. Terhubung dengan 1.112 entitas blacklist &amp; 550 laporan korban.</p>

      <div className="card mb" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          className="in"
          style={{ flex: 1, minWidth: 240 }}
          aria-label="Cari"
          placeholder="Ketik nomor WA (mis. 0821), rekening (mis. Mandiri / BRI), atau nama PT"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          type="button"
          className="btn"
          onClick={() => document.querySelector('.tbl')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        >
          {loading ? 'Mencari…' : 'Cari'}
        </button>
      </div>

      <div className="split s21">
        <div className="card">
          <div className="chips">
            {FILTERS.map((x) => (
              <button key={x} type="button" className={`chip ${f === x ? 'on' : ''}`} onClick={() => setF(x)}>
                {x}
              </button>
            ))}
            <span className="tag w2" style={{ marginLeft: 'auto' }}>{meta}</span>
          </div>
          <div className="sc">
            <table className="tbl">
              <thead><tr><th>Jenis</th><th>Data</th><th>Modus</th><th>Laporan</th></tr></thead>
              <tbody>
                {rows.map(([j, d, m, n], idx) => (
                  <tr key={`${d}-${idx}`} className="ro">
                    <td>{j}</td>
                    <td className="m">{d}</td>
                    <td>{m}</td>
                    <td><span className="tag r">{n}</span></td>
                  </tr>
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
              {feed.map(([a, b], idx) => (
                <div className="rw" key={`${a}-${idx}`}>
                  <span className="dot" />
                  <span><b className="m">{a}</b><br /><span className="mu sm">{b}</span></span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <b>Menemukan penipu baru?</b>
            <p className="mu" style={{ margin: '6px 0 14px' }}>Laporanmu langsung masuk ke Radar Blacklist dan membantu pelamar lain.</p>
            <Link href="/lapor" className="btn r">Laporkan sekarang</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
