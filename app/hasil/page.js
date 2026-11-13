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

  // State untuk form 'Kirim Hasil Pemeriksaan ke Email'
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const savedImg = sessionStorage.getItem('cl_img');
      if (savedImg) setImg(savedImg);
      const savedRes = sessionStorage.getItem('cl_result');
      if (savedRes) {
        const parsed = JSON.parse(savedRes);
        if (parsed && typeof parsed === 'object') {
          setRes((prev) => ({
            ...prev,
            ...parsed,
            score: parsed.score !== undefined ? Number(parsed.score) : prev.score,
            flags: parsed.flags || parsed.red_flags || prev.flags,
            rows: parsed.rows || prev.rows,
          }));
        }
      }
    } catch {}
  }, []);

  // Auto-dismiss floating toast after 4s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg('Masukkan alamat email yang valid.');
      return;
    }

    setErrorMsg('');
    setSending(true);

    try {
      const payload = {
        email: cleanEmail,
        recipient: cleanEmail,
        scanId: res.scanId || '#0001',
        score: res.score ?? 87,
        stamp: res.stamp || 'Kemungkinan besar penipuan',
        modus: res.modus || 'Tugas review e-commerce',
        red_flags: Array.isArray(res.flags)
          ? res.flags.map((f) => (Array.isArray(f) ? { indicator: f[0], evidence: f[1] } : f))
          : [],
        flags: res.flags || [],
        recommendation: res.recommendation || '',
      };

      const response = await fetch('/api/mail/send-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data?.ok) {
        setSentSuccess(true);
        setSentEmail(cleanEmail);
        setToast({
          type: 'success',
          message: `Laporan forensik berhasil dikirim ke ${cleanEmail}!`,
        });
      } else {
        const msg = data?.error || 'Gagal mengirim email hasil pemeriksaan.';
        setErrorMsg(msg);
        setToast({
          type: 'error',
          message: msg,
        });
      }
    } catch (err) {
      const msg = 'Terjadi kesalahan koneksi saat mengirim email: ' + (err?.message || 'Offline');
      setErrorMsg(msg);
      setToast({
        type: 'error',
        message: msg,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="w sec">
      <div className="chips">
        <span className="tag">Hasil {res.scanId || '#0001'}</span>
        <span className="tag w2">{res.engine || 'Terhubung ke AI Vision & Radar'}</span>
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
                {(res.rows || DEFAULT_RESULT.rows).length > 0 ? (
                  (res.rows || DEFAULT_RESULT.rows).map(([j, v, t, red, href], idx) => (
                    <tr key={`${j}-${idx}`} className="ro">
                      <td>{j}</td><td className="m">{v}</td>
                      <td>{href ? <Link href={href} className="tag r">{t}</Link> : <span className={`tag ${red ? 'r' : ''}`}>{t}</span>}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="mu">Tidak ada entitas mencurigakan yang terdeteksi.</td>
                  </tr>
                )}
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
              {(res.flags || DEFAULT_RESULT.flags).length > 0 ? (
                (res.flags || DEFAULT_RESULT.flags).map(([a, b], i) => (
                  <div className="rw" key={`${a}-${i}`}><span className="nm r">{i + 1}</span><span><b>{a}</b> {b}</span></div>
                ))
              ) : (
                <p className="mu" style={{ margin: 0 }}>Tidak ditemukan tanda bahaya pada bukti ini.</p>
              )}
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

      {/* Interactive 'Kirim Hasil Pemeriksaan ke Email' Card */}
      <Reveal delay={180}>
        <div className="card mt" style={{ border: '1px solid #C9D8F8', background: '#F8FAFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 26 }}>✉️</span>
            <div>
              <h2 className="h2" style={{ margin: 0, fontSize: 20 }}>Kirim Hasil Pemeriksaan ke Email</h2>
              <p className="mu sm" style={{ margin: '4px 0 0' }}>
                Simpan salinan berkas forensik ini sebagai arsip bukti resmi atau teruskan ke teman dan keluarga.
              </p>
            </div>
          </div>

          {sentSuccess ? (
            <div
              style={{
                background: '#E6F6EC',
                border: '1px solid #A6E3B8',
                borderRadius: 10,
                padding: '16px 20px',
                marginTop: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <b style={{ color: '#166534', display: 'block', fontSize: 15 }}>
                  ✓ Hasil pemeriksaan berhasil dikirim!
                </b>
                <span className="sm" style={{ color: '#276749' }}>
                  Dokumen laporan docket telah dikirimkan ke <b>{sentEmail}</b>. Silakan periksa kotak masuk atau spam email Anda.
                </span>
              </div>
              <button
                type="button"
                className="btn k"
                style={{ padding: '8px 16px', fontSize: 13 }}
                onClick={() => {
                  setSentSuccess(false);
                  setEmail('');
                }}
              >
                Kirim ke email lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <input
                    type="email"
                    required
                    className="in"
                    placeholder="Masukkan alamat email Anda (contoh: nama@gmail.com)"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    disabled={sending}
                  />
                  {errorMsg && <p className="err" style={{ marginTop: 6 }}>{errorMsg}</p>}
                </div>
                <button
                  type="submit"
                  className="btn"
                  disabled={sending || !email.trim()}
                  style={{
                    padding: '13px 24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    opacity: sending || !email.trim() ? 0.75 : 1,
                  }}
                >
                  {sending ? (
                    <>
                      <div className="spin" style={{ width: 16, height: 16, borderWidth: 2 }} />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Hasil ke Email</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </Reveal>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 99,
            background: toast.type === 'error' ? '#B42318' : '#166534',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 15,
            fontWeight: 600,
            animation: 'up .3s ease-out',
            maxWidth: 'min(90vw, 440px)',
          }}
        >
          <span style={{ fontSize: 18 }}>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}
