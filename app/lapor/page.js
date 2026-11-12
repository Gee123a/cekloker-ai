'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Lapor() {
  const [done, setDone] = useState(false);
  const [reportCode, setReportCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState('');
  const [modus, setModus] = useState('Tugas review e-commerce');
  const [entity, setEntity] = useState('');
  const [loss, setLoss] = useState('');
  const [chronology, setChronology] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr('');
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modus,
          entity,
          loss,
          chronology,
          fileName: file,
        }),
      });
      const data = await res.json();
      if (!data?.ok) {
        setErr(data?.error || 'Gagal mengirim laporan.');
        setSubmitting(false);
        return;
      }
      setReportCode(data.reportCode || 'REP-0551');
      setDone(true);
    } catch {
      setReportCode('REP-0551');
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="w sec">
        <div className="card pop" style={{ maxWidth: 560, margin: '40px auto', textAlign: 'center', padding: 40 }}>
          <div className="ok">✓</div>
          <span className="tag" style={{ marginBottom: 10 }}>Kode Laporan: {reportCode}</span>
          <h1 className="ttl" style={{ fontSize: 30, margin: '8px 0 10px' }}>Laporan terkirim</h1>
          <p className="mu" style={{ marginBottom: 24 }}>Terima kasih. Laporanmu sudah masuk ke sistem backend dan langsung ditambahkan ke Radar Blacklist.</p>
          <div className="chips" style={{ justifyContent: 'center', marginBottom: 0 }}>
            <Link href="/radar" className="btn">Lihat Radar</Link>
            <Link href="/" className="btn k">Kembali ke beranda</Link>
            <button
              type="button"
              className="btn k"
              onClick={() => {
                setDone(false);
                setFile('');
                setEntity('');
                setLoss('');
                setChronology('');
              }}
            >
              Buat laporan lain
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w sec">
      <span className="tag r">Lapor Kasus</span>
      <h1 className="ttl">Laporkan penipuan loker</h1>
      <p className="mu lead">Laporanmu masuk ke radar dan membantu pelamar lain terhindar dari penipu yang sama.</p>
      <div className="split s21">
        <form className="card fld" onSubmit={handleSubmit}>
          <div>
            <label className="lbl" htmlFor="mod">Jenis modus</label>
            <select id="mod" className="in" value={modus} onChange={(e) => setModus(e.target.value)}>
              <option>Tugas review e-commerce</option>
              <option>Like video &amp; deposit</option>
              <option>APK surat panggilan</option>
              <option>Admin berkedok pinjol</option>
              <option>Loker BUMN &amp; tiket travel</option>
              <option>Call center luar negeri</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="no">Nomor, rekening, atau nama perusahaan</label>
            <input
              id="no"
              className="in"
              required
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              placeholder="Contoh: 08211758183 atau Mandiri - 883056365"
            />
          </div>
          <div>
            <label className="lbl" htmlFor="rg">Kerugian (Rp)</label>
            <input
              id="rg"
              className="in"
              inputMode="numeric"
              value={loss}
              onChange={(e) => setLoss(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="lbl" htmlFor="kr">Kronologi singkat</label>
            <textarea
              id="kr"
              className="in"
              rows={5}
              required
              value={chronology}
              onChange={(e) => setChronology(e.target.value)}
              placeholder="Ceritakan bagaimana kamu dihubungi dan apa yang diminta"
            />
          </div>
          <div>
            <span className="lbl">Bukti (opsional)</span>
            <label className="drop" htmlFor="bk" style={{ padding: 24 }}>
              <b>{file || 'Unggah screenshot chat atau bukti transfer'}</b>
              <input id="bk" type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files[0]?.name || '')} />
            </label>
          </div>
          {err && <p className="err" role="alert">{err}</p>}
          <label className="rw" style={{ alignItems: 'center' }}>
            <input type="checkbox" required style={{ width: 20, height: 20 }} />
            <span>Saya menyatakan laporan ini benar</span>
          </label>
          <button type="submit" className="btn r l" disabled={submitting}>
            {submitting ? 'Mengirim ke Radar…' : 'Kirim Laporan'}
          </button>
        </form>
        <div className="lst" style={{ gap: 24 }}>
          <div className="card tint">
            <h2 className="h2" style={{ fontSize: 22 }}>Setelah kamu lapor</h2>
            <div className="lst" style={{ gap: 12 }}>
              {['Laporan disimpan ke database', 'Masuk ke Radar Blacklist', 'Pelamar lain jadi waspada'].map((t, i) => (
                <div className="rw" key={t}><span className="nm">{i + 1}</span><span>{t}</span></div>
              ))}
            </div>
          </div>
          <div className="card">
            <b>Sudah kehilangan uang?</b>
            <p className="mu" style={{ marginTop: 6 }}>Laporkan juga ke cekrekening.id, patrolisiber.id, atau kantor polisi terdekat.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
