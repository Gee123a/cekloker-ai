import { NextResponse } from 'next/server';
import { getSupabaseClient, loadSeedData, getRuntimeData } from '../../../lib/backend';

const TYPE_MAP = {
  phone: 'Nomor',
  bank_account: 'Rekening',
  company_name: 'Perusahaan',
  domain: 'Perusahaan',
};

const REVERSE_TYPE_MAP = {
  Nomor: 'phone',
  Rekening: 'bank_account',
  Perusahaan: 'company_name',
};

function shortenModus(modus) {
  if (!modus) return 'Penipuan loker';
  if (modus.includes('Review E-Commerce')) return 'Tugas review e-commerce';
  if (modus.includes('Kamboja')) return 'Loker luar negeri / TPPO';
  if (modus.includes('APK')) return 'APK surat panggilan';
  if (modus.includes('BUMN')) return 'Loker BUMN & tiket travel';
  if (modus.includes('Like & Subscribe')) return 'Like & deposit';
  if (modus.includes('Pinjol')) return 'Admin berkedok pinjol';
  if (modus.includes('Admin Typing')) return 'Ketik dokumen berbayar';
  return modus;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const filter = searchParams.get('filter') || 'Semua';
  const limit = Math.min(Number(searchParams.get('limit') || 30), 100);

  const supabase = getSupabaseClient();
  const { reports: seedReports, blacklist: seedBlacklist } = loadSeedData();
  const { runtimeReports, runtimeBlacklist } = getRuntimeData();

  let rows = [];
  let feed = [];
  let source = 'Dataset Empiris Supabase (550 Laporan & 1.112 Blacklist)';

  if (supabase) {
    try {
      let query = supabase
        .from('blacklist_entities')
        .select('*')
        .order('report_count', { ascending: false })
        .limit(limit);

      if (filter !== 'Semua' && REVERSE_TYPE_MAP[filter]) {
        query = query.eq('entity_type', REVERSE_TYPE_MAP[filter]);
      }
      if (q) {
        query = query.ilike('display_label', `%${q}%`);
      }

      const { data: blData, error: blErr } = await query;
      const { data: repData } = await supabase
        .from('fraud_reports')
        .select('report_code, suspect_contact, suspect_payment_account, modus_category, reported_at, reporter_city')
        .order('reported_at', { ascending: false })
        .limit(5);

      if (!blErr && blData && blData.length > 0) {
        source = 'Supabase PostgreSQL Live';
        rows = blData.map((b) => [
          TYPE_MAP[b.entity_type] || 'Lainnya',
          b.display_label,
          shortenModus(b.modus_category || 'Terindikasi di laporan korban'),
          b.report_count,
          b.total_loss_idr,
          b.highest_risk_status,
        ]);
      }

      if (repData && repData.length > 0) {
        feed = repData.map((r) => [
          r.suspect_payment_account || r.suspect_contact,
          `${shortenModus(r.modus_category)} · ${r.reporter_city || 'Indonesia'}`,
        ]);
      }
    } catch {
      // Fall back to seed data
    }
  }

  if (rows.length === 0) {
    const allBlacklist = [...runtimeBlacklist, ...seedBlacklist];
    const filtered = allBlacklist.filter((item) => {
      const uiType = TYPE_MAP[item.entity_type] || 'Perusahaan';
      const matchType = filter === 'Semua' || uiType === filter;
      const matchQuery =
        !q ||
        item.display_label.toLowerCase().includes(q) ||
        (item.modus_category || '').toLowerCase().includes(q) ||
        uiType.toLowerCase().includes(q);
      return matchType && matchQuery;
    });

    rows = filtered.slice(0, limit).map((b) => [
      TYPE_MAP[b.entity_type] || 'Perusahaan',
      b.display_label,
      shortenModus(b.modus_category),
      b.report_count,
      b.total_loss_idr,
      b.highest_risk_status,
    ]);
  }

  if (feed.length === 0) {
    const allReports = [...runtimeReports, ...seedReports];
    feed = allReports.slice(0, 5).map((r, i) => [
      r.suspect_payment_account || r.suspect_contact,
      `${shortenModus(r.modus_category)} · ${r.reporter_city || 'Baru dilaporkan'}`,
    ]);
  }

  return NextResponse.json({
    ok: true,
    source,
    totalReports: 550 + runtimeReports.length,
    totalBlacklist: 1112 + runtimeBlacklist.length,
    rows,
    feed,
  });
}

