'use client';

import Link from 'next/link';

export default function Radar() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div className="eyebrow">Radar komunitas · Dalam pengembangan</div>
          <h1>Daftar entitas yang pernah dilaporkan.</h1>
          <p className="lead">
            Fitur Radar Blacklist sedang dalam tahap pengembangan dan integrasi database langsung.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Entitas</th>
                  <th>Tipe</th>
                  <th>Modus</th>
                  <th className="num">Laporan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <div className="note" style={{ marginBottom: '16px' }}>
                      Sedang dalam pengembangan — data komunitas akan segera tersedia di sini.
                    </div>
                    <div className="actions" style={{ justifyContent: 'center' }}>
                      <Link href="/scanner" className="btn btn-primary">
                        Kembali ke Scanner
                      </Link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
