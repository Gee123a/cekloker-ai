import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

let cachedSeed = null;
const runtimeReports = [];
const runtimeBlacklist = [];

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !key ||
    url.includes('placeholder') ||
    url.includes('your-project-ref') ||
    key.includes('placeholder') ||
    key.includes('your-supabase')
  ) {
    return null;
  }

  try {
    return createClient(url, key, {
      auth: { persistSession: false },
    });
  } catch {
    return null;
  }
}

export function loadSeedData() {
  if (cachedSeed) return cachedSeed;

  const reports = [];
  const blacklist = [];

  try {
    const seedPath = path.join(process.cwd(), 'supabase', 'seed.sql');
    const raw = fs.readFileSync(seedPath, 'utf8');
    const lines = raw.split(/\r?\n/);

    // Parse fraud_reports rows:
    // ('REP-0001', '2024-09-13 00:00:00+07', 'Riz*** i', 'Bandung', 'SMS', 'PT Sinergi Niaga Express', 'Admin Typing...', 0, '08219532357', 'BRI - 109088086', 'Chronology...', 'High Risk', true)
    const reportRegex =
      /^\('(REP-\d+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*'([^']+)',\s*'([^']+)',\s*'((?:[^']|'')*)',\s*'([^']+)',\s*(true|false)\)/;

    // Parse blacklist_entities rows:
    // ('phone', '08128456866', '08128456866', 1, 25000000, 'Verified Scam', '2024-08-01 00:00:00+07')
    const blacklistRegex =
      /^\('(phone|bank_account|company_name|domain)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*'([^']+)',\s*'([^']+)'\)/;

    for (const line of lines) {
      const trimmed = line.trim();
      const repMatch = trimmed.match(reportRegex);
      if (repMatch) {
        reports.push({
          report_code: repMatch[1],
          reported_at: repMatch[2],
          reporter_alias: repMatch[3],
          reporter_city: repMatch[4],
          platform_contact: repMatch[5],
          fake_company_name: repMatch[6],
          modus_category: repMatch[7],
          financial_loss_idr: Number(repMatch[8]),
          suspect_contact: repMatch[9],
          suspect_payment_account: repMatch[10],
          chronology_snippet: repMatch[11].replace(/''/g, "'"),
          risk_status: repMatch[12],
          is_email_verified: repMatch[13] === 'true',
        });
        continue;
      }

      const blMatch = trimmed.match(blacklistRegex);
      if (blMatch) {
        blacklist.push({
          entity_type: blMatch[1],
          normalized_value: blMatch[2],
          display_label: blMatch[3],
          report_count: Number(blMatch[4]),
          total_loss_idr: Number(blMatch[5]),
          highest_risk_status: blMatch[6],
          last_reported_at: blMatch[7],
        });
      }
    }
  } catch (err) {
    console.error('Failed to parse seed.sql fallback:', err);
  }

  // Map company/phone/bank to primary modus from reports
  const entityModusMap = new Map();
  for (const r of reports) {
    if (r.suspect_contact) entityModusMap.set(r.suspect_contact.toLowerCase(), r.modus_category);
    if (r.suspect_payment_account)
      entityModusMap.set(r.suspect_payment_account.toLowerCase(), r.modus_category);
    if (r.fake_company_name)
      entityModusMap.set(r.fake_company_name.toLowerCase(), r.modus_category);
  }

  for (const b of blacklist) {
    b.modus_category =
      entityModusMap.get(b.display_label.toLowerCase()) ||
      'Tugas Review E-Commerce / Top Up Saldo Fiktif';
  }

  cachedSeed = { reports, blacklist };
  return cachedSeed;
}

export function addRuntimeReport(report) {
  runtimeReports.unshift(report);
  const typeLabel =
    /^\d+$/.test(report.suspect_contact.replace(/[\s+-]/g, ''))
      ? 'phone'
      : report.suspect_payment_account
      ? 'bank_account'
      : 'company_name';

  runtimeBlacklist.unshift({
    entity_type: typeLabel,
    normalized_value: (report.suspect_contact || report.fake_company_name || '').toUpperCase(),
    display_label: report.suspect_contact || report.suspect_payment_account || report.fake_company_name,
    report_count: 1,
    total_loss_idr: Number(report.financial_loss_idr || 0),
    highest_risk_status: report.risk_status || 'High Risk',
    modus_category: report.modus_category,
    last_reported_at: new Date().toISOString(),
  });
}

export function getRuntimeData() {
  return { runtimeReports, runtimeBlacklist };
}

