'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  'Membaca teks dari gambar',
  'Menganalisis tanda bahaya',
  'Menyusun laporan risiko',
];

export default function UploadBox({ withNote = false }) {
  const router = useRouter();
  const input = useRef(null);
  const [img, setImg] = useState(null);
  const [fileName, setFileName] = useState('');
  const [note, setNote] = useState('');
  const [over, setOver] = useState(false);
  const [step, setStep] = useState(-1);
  const [err, setErr] = useState('');

  const load = (f) => {
    if (!f || !f.type || !f.type.startsWith('image/')) {
      setErr('Pilih file gambar yang valid (PNG atau JPG).');
      return;
    }
    setErr('');
    setFileName(f.name || 'screenshot.png');
    const fr = new FileReader();
    fr.onload = () => setImg(fr.result);
    fr.readAsDataURL(f);
  };

  // Dukungan paste screenshot (Ctrl+V / Cmd+V)
  useEffect(() => {
    const onPaste = (e) => {
      // Prioritaskan file langsung dari clipboard
      if (e.clipboardData?.files?.length > 0) {
        const f = e.clipboardData.files[0];
        if (f && f.type.startsWith('image/')) {
          e.preventDefault();
          load(f);
          return;
        }
      }
      // Periksa items clipboard jika berupa blob gambar
      if (e.clipboardData?.items) {
        for (const item of e.clipboardData.items) {
          if (item.type.startsWith('image/')) {
            const f = item.getAsFile();
            if (f) {
              e.preventDefault();
              load(f);
              return;
            }
          }
        }
      }
    };

    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const analyze = async () => {
    if (!img) return;

    setErr('');
    try {
      sessionStorage.setItem('cl_img', img);
      sessionStorage.removeItem('cl_result');
    } catch {}

    setStep(0);
    const startTime = Date.now();
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1200);

    let success = false;
    let errorMessage = '';

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: img, note, fileName }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok && data?.result) {
        sessionStorage.setItem('cl_result', JSON.stringify(data.result));
        success = true;
      } else {
        errorMessage =
          data?.error || 'Layanan AI Gemini gagal menganalisis bukti. Silakan coba lagi.';
      }
    } catch (err) {
      errorMessage =
        'Koneksi ke server analisis gagal. Pastikan internet aktif dan coba lagi.';
    } finally {
      const elapsed = Date.now() - startTime;
      const remainingWait = success ? Math.max(0, 1400 - elapsed) : 0;
      setTimeout(() => {
        clearTimeout(t1);
        clearTimeout(t2);
        if (success) {
          router.push('/hasil');
        } else {
          setStep(-1);
          setErr(errorMessage);
        }
      }, remainingWait);
    }
  };

  const pick = (e) => {
    e.stopPropagation();
    input.current?.click();
  };

  return (
    <>
      <div
        className={`drop ${over ? 'over' : ''}`}
        onClick={() => !img && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOver(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOver(false);
          const f = e.dataTransfer?.files?.[0];
          if (f) load(f);
        }}
      >
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) load(f);
          }}
        />

        {img ? (
          <>
            <img src={img} alt="Pratinjau screenshot" className="prev" />
            <button
              type="button"
              className="btn k"
              onClick={(e) => {
                e.stopPropagation();
                setImg(null);
                setFileName('');
                if (input.current) input.current.value = '';
              }}
            >
              Ganti gambar
            </button>
          </>
        ) : (
          <>
            <div className="h2" style={{ margin: 0 }}>
              Tarik screenshot ke sini
            </div>
            <button type="button" className="btn l" onClick={pick}>
              Pilih Screenshot
            </button>
            <div className="mu sm">
              atau tempel dengan Ctrl+V ·{' '}
              <Link
                href="/hasil"
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--blue)', fontWeight: 600 }}
              >
                Lihat contoh hasil
              </Link>
            </div>
          </>
        )}
      </div>

      {err && (
        <p className="err" role="alert">
          {err}
        </p>
      )}

      {withNote && (
        <div style={{ marginTop: 20 }}>
          <label className="lbl" htmlFor="cat">
            Catatan tambahan / nomor / rekening (opsional)
          </label>
          <input
            id="cat"
            className="in"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: dikirim lewat WhatsApp 08211758183, diminta transfer Mandiri 883056365"
          />
        </div>
      )}

      {img && (
        <button type="button" className="btn l full" onClick={analyze}>
          Analisis Sekarang
        </button>
      )}

      {step >= 0 && (
        <div className="ov" role="dialog" aria-label="Sedang menganalisis">
          <div className="card ovc">
            <div className="spin" />
            <h3 style={{ fontSize: 20 }}>Menganalisis dengan AI…</h3>
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`stp ${i < step ? 'done' : ''} ${i === step ? 'on' : ''}`}
              >
                <span className="nm">{i < step ? '✓' : i + 1}</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
