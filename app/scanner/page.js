import UploadBox from '../../components/UploadBox';

export const metadata = { title: 'AI Scanner — CekLoker.ai' };

const CHECKS = [
  'Komisi atau gaji yang tidak masuk akal',
  'Permintaan deposit atau top up berjenjang',
  'Rekening atas nama pribadi',
  'Permintaan foto KTP dan selfie',
  'Kecocokan dengan blacklist laporan korban',
];

export default function Scanner() {
  return (
    <section className="w sec">
      <span className="tag">AI Scanner</span>
      <h1 className="ttl">Periksa loker yang mencurigakan</h1>
      <p className="mu lead">Unggah buktinya, kami baca isinya lalu beri skor risiko beserta alasannya.</p>
      <div className="split">
        <div className="card"><UploadBox withNote /></div>
        <div className="card tint">
          <h2 className="h2">Yang kami periksa</h2>
          <div className="lst">
            {CHECKS.map((t, i) => (<div className="rw" key={t}><span className="nm">{i + 1}</span><span>{t}</span></div>))}
          </div>
        </div>
      </div>
    </section>
  );
}
