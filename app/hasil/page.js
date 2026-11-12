'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CountUp, Bar, Reveal } from '../../components/Fx';

const ROWS = [
  ['Nomor WA', '0812-••••-3921', '3 laporan', true, '/radar'],
  ['Rekening', 'BCA ••••4821 a.n. pribadi', '5 laporan', true, '/radar'],
  ['Perusahaan', 'PT Maju Jaya', 'Belum terverifikasi', false, null],
  ['Data diminta', 'Foto KTP + selfie', 'Bahaya', true, null],
];
const FLAGS = [
  ['Komisi tak wajar.', 'Rp 500 ribu per hari hanya untuk like video.'],
  ['Minta deposit.', 'Harus transfer dulu untuk bisa lanjut.'],
  ['Rekening tercatat.', 'Sudah ada di laporan korban lain.'],
  ['Minta KTP & selfie.', 'Rawan dipakai pinjol atas namamu.'],
];

export default function Hasil() {
  const [img, setImg] = useState(null);
  useEffect(() => { try { setImg(sessionStorage.getItem('cl_img')); } catch {} }, []);

  return (
    <section className="w sec">
      <div className="chips"><span className="tag">Hasil #0001</span><span className="tag w2">Data contoh</span></div>

      <div className="split s11 mb">
        <div className="card">
          <div className="m mu sm">SKOR RISIKO PENIPUAN</div>
          <div className="big red"><CountUp to={87} suffix="%" /></div>
          <Bar value={87} />
          <div className="mt"><span className="stamp pop">Kemungkinan besar penipuan</span></div>
        </div>
        <div className="card">
          <b>Bukti yang kamu unggah</b>
          <div className="hatch">
            {img ? <img src={img} alt="Screenshot yang diunggah" className="prev" /> : <span className="tag w2">Contoh: screenshot_chat.png</span>}
          </div>
          <span className="mu">Mirip modus: </span><b>Tugas review e-commerce</b>
        </div>
      </div>

      <Reveal>
        <div className="card mb">
          <h2 className="h2">Data yang ditemukan</h2>
          <div className="sc">
            <table className="tbl">
              <thead><tr><th>Jenis</th><th>Isi</th><th>Radar</th></tr></thead>
              <tbody>
                {ROWS.map(([j, v, t, red, href]) => (
                  <tr key={j} className="ro">
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
            <h2 className="h2">Tanda bahaya ({FLAGS.length})</h2>
            <div className="lst">
              {FLAGS.map(([a, b], i) => (<div className="rw" key={a}><span className="nm r">{i + 1}</span><span><b>{a}</b> {b}</span></div>))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="card tint">
            <h2 className="h2">Yang sebaiknya kamu lakukan</h2>
            <p style={{ fontSize: 18, marginBottom: 20 }}>Jangan transfer dan jangan kirim data pribadi. Hentikan percakapan, lalu laporkan agar pelamar lain terlindungi.</p>
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
