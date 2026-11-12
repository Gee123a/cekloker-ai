'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CountUp, Bar, Reveal } from '../../components/Fx';

const DEFAULT_RESULT = {
  scanId: '#0001',
  score: 87,
  stamp: 'Kemungkinan besar penipuan',
  modus: 'Tugas review e-commerce',
  engine: 'Hybrid Radar Matcher (550 Kasus Empiris)',
  rows: [
    ['Nomor WA', '0821-1758-183', 'Tercatat di Blacklist', true, '/radar'],
    ['Rekening', 'Mandiri - 883056365 a.n. Pribadi', 'Cocok REP-0044', true, '/radar'],
    ['Perusahaan', 'PT Samudera Logistik Indo', '51 laporan terkait', true, '/radar'],
    ['Data diminta', 'Foto KTP + deposit / file .APK', 'Bahaya Tinggi', true, null],
  ],
  flags: [
    ['Komisi tak wajar.', 'Rp 500 ribu per hari hanya untuk like video atau tugas ringan.'],
    ['Minta deposit.', 'Harus transfer dulu untuk bisa lanjut atau mencairkan komisi.'],
    ['Rekening tercatat.', 'Sudah ada di database laporan korban CekLoker.ai.'],
    ['Minta KTP & selfie.', 'Rawan disalahgunakan untuk pengajuan pinjol ilegal atas namamu.'],
  ],
  recommendation:
    'Jangan transfer dan jangan kirim data pribadi. Hentikan percakapan, lalu laporkan agar pelamar lain terlindungi.',
};

export default function Hasil() {
  const [img, setImg] = useState(null);
  const [res, setRes] = useState(DEFAULT_RESULT);

  useEffect(() => {
    try {
      const savedImg = sessionStorage.getItem('cl_img');
      if (savedImg) setImg(savedImg);
      const savedRes = sessionStorage.getItem('cl_result');
      if (savedRes) {
        const parsed = JSON.parse(savedRes);
        if (parsed && parsed.score) setRes(parsed);
      }
    } catch {}
  }, []);

  return (
    <section className="w sec">
      <div className="chips">
        <span className="tag">Hasil {res.scanId || '#0001'}</span>
        <span className="tag w2">{res.engine || 'Terhubung ke API Backend'}</span>
      </div>

      <div className="split s11 mb">
        <div className="card">
          <div className="m mu sm">SKOR RISIKO PENIPUAN</div>
          <div className="big red"><CountUp to={res.score} suffix="%" /></div>
          <Bar value={res.score} />
          <div className="mt"><span className="stamp pop">{res.stamp}</span></div>
        </div>
        <div className="card">
          <b>Bukti yang kamu unggah</b>
          <div className="hatch">
            {img ? <img src={img} alt="Screenshot yang diunggah" className="prev" /> : <span className="tag w2">Contoh: screenshot_chat.png</span>}
          </div>
          <span className="mu">Mirip modus: </span><b>{res.modus}</b>
        </div>
      </div>

      <Reveal>
        <div className="card mb">
          <h2 className="h2">Data yang ditemukan</h2>
          <div className="sc">
            <table className="tbl">
              <thead><tr><th>Jenis</th><th>Isi</th><th>Radar</th></tr></thead>
              <tbody>
                {(res.rows || DEFAULT_RESULT.rows).map(([j, v, t, red, href], idx) => (
                  <tr key={`${j}-${idx}`} className="ro">
                    <td>{j}</td><td className="m">{v}</td>
                    <td>{href ? <Link href={href} className="tag r">{t}</Link> : <span className={`tag ${red ? 'r' : ''}`}>{t}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <div className="split s11">
        <Reveal>
          <div className="card">
            <h2 className="h2">Tanda bahaya ({(res.flags || DEFAULT_RESULT.flags).length})</h2>
            <div className="lst">
              {(res.flags || DEFAULT_RESULT.flags).map(([a, b], i) => (
                <div className="rw" key={`${a}-${i}`}><span className="nm r">{i + 1}</span><span><b>{a}</b> {b}</span></div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="card tint">
            <h2 className="h2">Yang sebaiknya kamu lakukan</h2>
            <p style={{ fontSize: 18, marginBottom: 20 }}>{res.recommendation || DEFAULT_RESULT.recommendation}</p>
            <div className="chips" style={{ marginBottom: 0 }}>
              <Link href="/lapor" className="btn r">Laporkan loker ini</Link>
              <Link href="/scanner" className="btn k">Cek loker lain</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
