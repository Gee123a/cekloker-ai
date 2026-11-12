'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = ['Membaca teks dari gambar', 'Mencari tanda penipuan', 'Mencocokkan dengan laporan korban'];

export default function UploadBox({ withNote = false }) {
  const router = useRouter();
  const input = useRef(null);
  const [img, setImg] = useState(null);
  const [over, setOver] = useState(false);
  const [step, setStep] = useState(-1);
  const [err, setErr] = useState('');

  const load = (f) => {
    if (!f || !f.type.startsWith('image/')) { setErr('Pilih file gambar (PNG atau JPG).'); return; }
    setErr('');
    const fr = new FileReader();
    fr.onload = () => setImg(fr.result);
    fr.readAsDataURL(f);
  };

  // Ctrl+V untuk menempel screenshot
  useEffect(() => {
    const onPaste = (e) => { const f = e.clipboardData?.files?.[0]; if (f) load(f); };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const analyze = () => {
    try { sessionStorage.setItem('cl_img', img); } catch {}
    setStep(0);
    [1, 2, 3].forEach((i) => setTimeout(() => (i < 3 ? setStep(i) : router.push('/hasil')), i * 900));
  };

  const pick = (e) => { e.stopPropagation(); input.current.click(); };

  return (
    <>
      <div
        className={`drop ${over ? 'over' : ''}`}
        onClick={() => !img && input.current.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); load(e.dataTransfer.files[0]); }}
      >
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => load(e.target.files[0])} />
        {img ? (
          <>
            <img src={img} alt="Pratinjau screenshot" className="prev" />
            <button type="button" className="btn k" onClick={(e) => { e.stopPropagation(); setImg(null); input.current.value = ''; }}>Ganti gambar</button>
          </>
        ) : (
          <>
            <div className="h2" style={{ margin: 0 }}>Tarik screenshot ke sini</div>
            <button type="button" className="btn l" onClick={pick}>Pilih Screenshot</button>
            <div className="mu sm">atau tempel dengan Ctrl+V · <Link href="/hasil" onClick={(e) => e.stopPropagation()} style={{ color: 'var(--blue)', fontWeight: 600 }}>Lihat contoh hasil</Link></div>
          </>
        )}
      </div>
      {err && <p className="err" role="alert">{err}</p>}
      {withNote && (
        <div style={{ marginTop: 20 }}>
          <label className="lbl" htmlFor="cat">Catatan tambahan (opsional)</label>
          <input id="cat" className="in" placeholder="Contoh: dikirim lewat WhatsApp, diminta transfer Rp 200.000" />
        </div>
      )}
      {img && <button type="button" className="btn l full" onClick={analyze}>Analisis Sekarang</button>}
      {step >= 0 && (
        <div className="ov" role="dialog" aria-label="Sedang menganalisis">
          <div className="card ovc">
            <div className="spin" />
            <h3 style={{ fontSize: 20 }}>Menganalisis…</h3>
            {STEPS.map((s, i) => (
              <div key={s} className={`stp ${i < step ? 'done' : ''} ${i === step ? 'on' : ''}`}>
                <span className="nm">{i < step ? '✓' : i + 1}</span>{s}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
