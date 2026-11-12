import Link from 'next/link';
import UploadBox from '../components/UploadBox';
import { Reveal, CountUp, Bar } from '../components/Fx';

const MODUS = [
  ['Top up', 'Tugas review e-commerce', 'Dibayar kecil di awal, lalu disuruh top up saldo yang tak bisa ditarik.'],
  ['Deposit', 'Like video & deposit', 'Komisi receh dari like YouTube, berujung setoran deposit.'],
  ['Malware', 'APK “surat panggilan”', 'Undangan wawancara berisi file APK penyedot data.'],
  ['Data KTP', 'Admin berkedok pinjol', 'Minta KTP dan selfie, lalu dipakai ajukan pinjaman atas namamu.'],
  ['Biaya palsu', 'Loker BUMN & tiket travel', 'Mengaku rekrutmen resmi, minta biaya tes atau booking.'],
  ['TPPO', 'Call center luar negeri', 'Gaji besar di luar negeri, berujung perdagangan orang.'],
];

const STEPS = [
  ['Upload bukti', 'Screenshot chat WhatsApp, Telegram, atau poster loker.'],
  ['AI menganalisis', 'Membaca teks dari gambar dan mendeteksi pola manipulasi psikologis atau rekening mencurigakan.'],
  ['Baca hasilnya', 'Skor risiko persentase instan, daftar tanda bahaya, dan langkah pencegahan aman.'],
];

export default function Home() {
  return (
    <>
      <section className="w sec">
        <div className="g2">
          <div>
            <span className="tag">Pendeteksi Penipuan Lowongan Kerja</span>
            <h1 className="hero">Cek apakah loker ini penipuan</h1>
            <p className="mu lead" style={{ marginBottom: 28 }}>
              Unggah screenshot chat atau poster lowongan kerja. AI menganalisis isi pesan, mendeteksi indikasi penipuan, dan memberikan hasil dalam hitungan detik.
            </p>
            <div className="card">
              <UploadBox />
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="hd">
              <b>Contoh hasil pemeriksaan</b>
              <span className="tag w2">Ilustrasi</span>
            </div>
            <div className="chat">
              <div className="bub" style={{ animationDelay: '.3s' }}>
                Halo kak, ada kerja online gaji <span className="hl">Rp 500rb/hari</span>
              </div>
              <div className="bub" style={{ animationDelay: '.9s' }}>
                Cukup like video YouTube, tanpa pengalaman
              </div>
              <div className="bub" style={{ animationDelay: '1.5s' }}>
                Untuk lanjut, silakan <span className="hl">transfer deposit Rp 200.000</span> ke rekening ini
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <div className="rw" style={{ alignItems: 'center', gap: 16 }}>
                <div className="n red" style={{ fontSize: 52 }}>
                  <CountUp to={87} suffix="%" />
                </div>
                <div>
                  <span className="stamp pop" style={{ fontSize: 16, padding: '6px 12px' }}>
                    Risiko tinggi
                  </span>
                  <div className="mu sm">Kemungkinan besar penipuan</div>
                </div>
              </div>
              <div style={{ margin: '16px 0' }}>
                <Bar value={87} />
              </div>
              <div className="lst" style={{ fontSize: 15, gap: 10 }}>
                {[
                  'Komisi tidak wajar untuk pekerjaan ringan',
                  'Diminta transfer deposit di awal',
                  'Indikasi rekening nominee pribadi',
                ].map((t, i) => (
                  <div className="rw" key={t}>
                    <span className="nm r">{i + 1}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w" style={{ paddingBottom: 56 }}>
        <h2 className="sec-t">Tiga langkah, tanpa ribet</h2>
        <div className="gr">
          {STEPS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="card hv" style={{ height: '100%' }}>
                <div className="n" style={{ fontSize: 36, color: 'var(--blue)' }}>
                  {i + 1}
                </div>
                <h3 className="h2" style={{ margin: '10px 0 6px', fontSize: 22 }}>
                  {t}
                </h3>
                <p className="mu">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="w" style={{ paddingBottom: 56 }}>
        <h2 className="sec-t">Modus yang paling sering</h2>
        <div className="gr">
          {MODUS.map(([tag, t, d], i) => (
            <Reveal key={t} delay={(i % 3) * 100}>
              <div className="card hv" style={{ height: '100%', padding: 20 }}>
                <span className="tag r">{tag}</span>
                <h3 style={{ fontSize: 19, margin: '10px 0 6px' }}>{t}</h3>
                <p className="mu">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="w" style={{ paddingBottom: 72 }}>
        <Reveal>
          <div
            className="card"
            style={{
              background: 'var(--navy)',
              color: '#fff',
              textAlign: 'center',
              padding: '56px 24px',
              border: 0,
            }}
          >
            <h2 className="sec-t" style={{ marginBottom: 12 }}>
              Ragu sama tawaran kerja?
            </h2>
            <p style={{ fontSize: 19, margin: '0 0 24px' }}>
              Cek dulu sebelum transfer atau kirim foto KTP.
            </p>
            <Link href="/scanner" className="btn l w2">
              Cek Loker Sekarang
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
