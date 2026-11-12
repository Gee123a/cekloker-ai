import { NextResponse } from 'next/server';
import { getSupabaseClient, addRuntimeReport, loadSeedData } from '../../../lib/backend';

const MODUS_NORMALIZE = {
  'Tugas review e-commerce': 'Tugas Review E-Commerce / Top Up Saldo Fiktif',
  'Like video & deposit': 'Freelance Like & Subscribe YouTube / TikTok Deposit',
  'APK surat panggilan': 'Kerja Paruh Waktu Undangan File APK Surat Panggilan',
  'Admin berkedok pinjol': 'Loker Admin Berkedok Pinjol (Minta KTP & Selfie)',
  'Loker BUMN & tiket travel': 'Loker BUMN / Pertamina Tiket Travel Bodong',
  'Call center luar negeri': 'Loker Luar Negeri / Kamboja Scam Call Center',
  Lainnya: 'Admin Typing / Ketik Dokumen Berbayar Registrasi',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const rawModus = body.modus || 'Tugas review e-commerce';
    const modusCategory = MODUS_NORMALIZE[rawModus] || rawModus;
    const entityInput = (body.entity || '').trim();
    const lossIdr = Math.max(0, Number(String(body.loss || '0').replace(/[^0-9]/g, '')) || 0);
    const chronology = (body.chronology || '').trim();
    const city = (body.city || 'Indonesia').trim();
    const platform = body.platform || 'WhatsApp';

    if (!entityInput || !chronology) {
      return NextResponse.json(
        { ok: false, error: 'Mohon lengkapi nomor/rekening/perusahaan dan kronologi kejadian.' },
        { status: 400 }
      );
    }

    const { reports } = loadSeedData();
    const nextNum = 551 + Math.floor(Math.random() * 400);
    const reportCode = `REP-0${nextNum}`;

    const isPhone = /^[+0-9\s-]{8,18}$/.test(entityInput);
    const isBank = /bca|bri|bni|mandiri|dana|ovo|gopay|seabank|jago|\d{6,}/i.test(entityInput) && !isPhone;

    const newReport = {
      report_code: reportCode,
      reported_at: new Date().toISOString(),
      reporter_alias: 'Pel*** r',
      reporter_city: city,
      platform_contact: platform,
      fake_company_name: !isPhone && !isBank ? entityInput : 'Perusahaan Terlapor',
      modus_category: modusCategory,
      financial_loss_idr: lossIdr,
      suspect_contact: isPhone ? entityInput : '-',
      suspect_payment_account: isBank ? entityInput : entityInput,
      chronology_snippet: chronology,
      risk_status: 'High Risk',
      is_email_verified: false,
    };

    // Save in runtime memory immediately so /radar updates right away
    addRuntimeReport(newReport);

    // Also persist to Supabase if configured
    const supabase = getSupabaseClient();
    let savedToSupabase = false;
    if (supabase) {
      const { error } = await supabase.from('fraud_reports').insert([newReport]);
      if (!error) savedToSupabase = true;
    }

    return NextResponse.json({
      ok: true,
      reportCode,
      savedToSupabase,
      report: newReport,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Gagal memproses laporan: ' + (err?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

