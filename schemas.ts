/**
 * CekLoker.ai — End-to-End Zod Schemas & TypeScript Contracts
 * Shared across Client Forms, Next.js Route Handlers, and Gemini 2.5 Flash responseSchema
 */
import { z } from 'zod';

export const ModusCategoryEnum = z.enum([
  'Tugas Review E-Commerce / Top Up Saldo Fiktif',
  'Loker Luar Negeri / Kamboja Scam Call Center',
  'Kerja Paruh Waktu Undangan File APK Surat Panggilan',
  'Loker BUMN / Pertamina Tiket Travel Bodong',
  'Freelance Like & Subscribe YouTube / TikTok Deposit',
  'Loker Admin Berkedok Pinjol (Minta KTP & Selfie)',
  'Admin Typing / Ketik Dokumen Berbayar Registrasi',
]);

export const PlatformContactEnum = z.enum([
  'Instagram DM',
  'Threads',
  'LinkedIn InMail',
  'Telegram',
  'SMS',
  'WhatsApp',
  'Facebook Jobs',
]);

export const ReportRiskStatusEnum = z.enum([
  'Investigation',
  'High Risk',
  'Verified Scam',
  'Confirmed Fraud',
]);

export const ScanRiskStatusEnum = z.enum([
  'Safe',
  'Suspicious',
  'High Risk',
  'Confirmed Fraud',
]);

export const RedFlagSchema = z.object({
  indicator: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  evidence: z.string(),
  box_2d: z.array(z.number()).length(4).optional(), // [ymin, xmin, ymax, xmax] normalized 0-1000
});

export const ExtractedEntitiesSchema = z.object({
  company_name: z.string().nullable().default(null),
  phone_numbers: z.array(z.string()).default([]),
  payment_accounts: z.array(z.string()).default([]),
  malicious_files: z.array(z.string()).default([]),
});

export const ScamScanResultSchema = z.object({
  risk_score: z.number().int().min(0).max(100),
  risk_status: ScanRiskStatusEnum,
  modus_category: ModusCategoryEnum,
  summary_id: z.string(),
  ocr_text: z.string().default(''),
  psychological_tactics: z.array(z.string()).default([]),
  visual_manipulation_score: z.number().int().min(0).max(100).default(0),
  extracted_entities: ExtractedEntitiesSchema,
  red_flags: z.array(RedFlagSchema),
  recommended_actions: z.array(z.string()),
  scan_id: z.string().optional(),
  image_url: z.string().optional(),
  image_storage_path: z.string().optional(),
});

export const CreateFraudReportSchema = z.object({
  reporter_alias: z.string().min(2).max(50),
  reporter_email: z.string().email(),
  reporter_city: z.string().min(2).max(60),
  platform_contact: PlatformContactEnum,
  fake_company_name: z.string().min(2).max(120),
  modus_category: ModusCategoryEnum,
  financial_loss_idr: z.number().int().min(0).max(100_000_000_000),
  suspect_contact: z.string().min(5).max(50),
  suspect_payment_account: z.string().min(3).max(80),
  chronology_snippet: z.string().min(15).max(1500),
});

export type ModusCategory = z.infer<typeof ModusCategoryEnum>;
export type PlatformContact = z.infer<typeof PlatformContactEnum>;
export type ReportRiskStatus = z.infer<typeof ReportRiskStatusEnum>;
export type ScanRiskStatus = z.infer<typeof ScanRiskStatusEnum>;
export type ScamScanResult = z.infer<typeof ScamScanResultSchema>;
export type CreateFraudReportInput = z.infer<typeof CreateFraudReportSchema>;

export interface FraudReportRecord {
  report_code: string;
  reported_at: string;
  reporter_alias: string;
  reporter_city: string;
  platform_contact: PlatformContact;
  fake_company_name: string;
  modus_category: ModusCategory;
  financial_loss_idr: number;
  suspect_contact: string;
  suspect_payment_account: string;
  chronology_snippet: string;
  risk_status: ReportRiskStatus;
  is_email_verified: boolean;
}

export interface PoliceCaseStudyRecord {
  case_number: number;
  case_title: string;
  incident_period: string;
  financial_loss_idr: number;
  financial_loss_label: string;
  victim_count_label: string;
  modus_category: ModusCategory;
  modus_summary: string;
  source_url: string;
}

export interface BlacklistEntityRecord {
  entity_type: 'phone' | 'bank_account' | 'company_name' | 'domain';
  normalized_value: string;
  display_label: string;
  report_count: number;
  total_loss_idr: number;
  highest_risk_status: ReportRiskStatus;
  last_reported_at: string;
}
