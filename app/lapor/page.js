'use client';

import Link from 'next/link';

export default function Lapor() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div className="eyebrow">Lapor kasus · Dalam pengembangan</div>
          <h1>Laporkan lowongan penipuan.</h1>
          <p className="lead">
            Fitur pelaporan kasus komunitas sedang dalam tahap pengembangan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px', maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '12px' }}>Sedang dalam pengembangan</h2>
            <p className="note" style={{ marginBottom: '24px' }}>
              Formulir pelaporan kasus ke database Radar Blacklist sedang disiapkan untuk iterasi berikutnya.
            </p>
            <div className="actions" style={{ justifyContent: 'center' }}>
              <Link href="/scanner" className="btn btn-primary">
                Gunakan Scanner
              </Link>
              <Link href="/radar" className="btn btn-ghost">
                Lihat Radar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
