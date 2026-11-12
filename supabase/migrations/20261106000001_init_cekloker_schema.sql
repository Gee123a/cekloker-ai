-- =============================================================================
-- CekLoker.ai — Supabase PostgreSQL + pgvector Schema Migration (Phase 1 MVP)
-- Course: 20261_IMT01306609-A Cloud Computing A (Universitas Ciputra)
-- =============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Profiles Table (References Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'verifier', 'admin')),
    email_alerts_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Scam Scans Table (Multimodal Vision Triage Logs)
CREATE TABLE IF NOT EXISTS public.scam_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    image_storage_path TEXT,
    ocr_extracted_text TEXT,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_status TEXT NOT NULL CHECK (risk_status IN ('Safe', 'Suspicious', 'High Risk', 'Confirmed Fraud')),
    primary_modus TEXT,
    summary_id TEXT,
    extracted_entities JSONB NOT NULL DEFAULT '{}'::jsonb,
    red_flags_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    embedding vector(768),
    verification_token TEXT UNIQUE,
    email_sent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Fraud Reports Table (550 Empirical Victim Reports + Community Reports)
CREATE TABLE IF NOT EXISTS public.fraud_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_code TEXT UNIQUE NOT NULL,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reporter_alias TEXT NOT NULL,
    reporter_city TEXT NOT NULL,
    platform_contact TEXT NOT NULL CHECK (
        platform_contact IN (
            'Instagram DM',
            'Threads',
            'LinkedIn InMail',
            'Telegram',
            'SMS',
            'WhatsApp',
            'Facebook Jobs'
        )
    ),
    fake_company_name TEXT NOT NULL,
    modus_category TEXT NOT NULL CHECK (
        modus_category IN (
            'Tugas Review E-Commerce / Top Up Saldo Fiktif',
            'Loker Luar Negeri / Kamboja Scam Call Center',
            'Kerja Paruh Waktu Undangan File APK Surat Panggilan',
            'Loker BUMN / Pertamina Tiket Travel Bodong',
            'Freelance Like & Subscribe YouTube / TikTok Deposit',
            'Loker Admin Berkedok Pinjol (Minta KTP & Selfie)',
            'Admin Typing / Ketik Dokumen Berbayar Registrasi'
        )
    ),
    financial_loss_idr BIGINT NOT NULL DEFAULT 0,
    suspect_contact TEXT NOT NULL,
    suspect_payment_account TEXT NOT NULL,
    chronology_snippet TEXT NOT NULL,
    risk_status TEXT NOT NULL CHECK (
        risk_status IN ('Investigation', 'High Risk', 'Verified Scam', 'Confirmed Fraud')
    ),
    is_email_verified BOOLEAN NOT NULL DEFAULT true,
    verification_token TEXT UNIQUE,
    chronology_embedding vector(768),
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Police & Media Verified Case Studies Table (15 National Cases 2022-2025)
CREATE TABLE IF NOT EXISTS public.police_case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number INTEGER UNIQUE NOT NULL,
    case_title TEXT NOT NULL,
    incident_period TEXT NOT NULL,
    financial_loss_idr BIGINT NOT NULL DEFAULT 0,
    financial_loss_label TEXT NOT NULL,
    victim_count_label TEXT NOT NULL,
    modus_category TEXT NOT NULL,
    modus_summary TEXT NOT NULL,
    source_url TEXT NOT NULL,
    case_embedding vector(768),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Blacklist Entities Table (Aggregated Phone Numbers, Bank Accounts, Fake Companies)
CREATE TABLE IF NOT EXISTS public.blacklist_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('phone', 'bank_account', 'company_name', 'domain')),
    normalized_value TEXT UNIQUE NOT NULL,
    display_label TEXT NOT NULL,
    report_count INTEGER NOT NULL DEFAULT 1,
    total_loss_idr BIGINT NOT NULL DEFAULT 0,
    highest_risk_status TEXT NOT NULL DEFAULT 'High Risk',
    last_reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. B-Tree & GIN Trigram Indexes (<25ms Instant Radar Lookup)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_fraud_reports_suspect_contact ON public.fraud_reports (suspect_contact);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_payment_account ON public.fraud_reports (suspect_payment_account);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_company_name ON public.fraud_reports (fake_company_name);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_modus ON public.fraud_reports (modus_category);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_platform ON public.fraud_reports (platform_contact);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_risk_status ON public.fraud_reports (risk_status);

CREATE INDEX IF NOT EXISTS idx_fraud_reports_company_trgm ON public.fraud_reports USING GIN (fake_company_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_payment_trgm ON public.fraud_reports USING GIN (suspect_payment_account gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_blacklist_normalized_trgm ON public.blacklist_entities USING GIN (normalized_value gin_trgm_ops);

-- HNSW Vector Indexes for <10ms Semantic Modus Clustering (pgvector)
CREATE INDEX IF NOT EXISTS idx_fraud_reports_embedding_hnsw ON public.fraud_reports USING hnsw (chronology_embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_scam_scans_embedding_hnsw ON public.scam_scans USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_police_cases_embedding_hnsw ON public.police_case_studies USING hnsw (case_embedding vector_cosine_ops);

-- Database Trigger: Automatically maintain Blacklist Entities when a report is verified
CREATE OR REPLACE FUNCTION public.sync_verified_report_to_blacklist()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.is_email_verified = true AND (TG_OP = 'INSERT' OR OLD.is_email_verified = false) THEN
        -- 1. Upsert Phone Entity
        INSERT INTO public.blacklist_entities (entity_type, normalized_value, display_label, report_count, total_loss_idr, highest_risk_status, last_reported_at)
        VALUES ('phone', regexp_replace(NEW.suspect_contact, '[^0-9+]', '', 'g'), NEW.suspect_contact, 1, NEW.financial_loss_idr, NEW.risk_status, NEW.reported_at)
        ON CONFLICT (normalized_value) DO UPDATE SET
            report_count = public.blacklist_entities.report_count + 1,
            total_loss_idr = public.blacklist_entities.total_loss_idr + EXCLUDED.total_loss_idr,
            last_reported_at = GREATEST(public.blacklist_entities.last_reported_at, EXCLUDED.last_reported_at);

        -- 2. Upsert Bank/E-Wallet Entity
        INSERT INTO public.blacklist_entities (entity_type, normalized_value, display_label, report_count, total_loss_idr, highest_risk_status, last_reported_at)
        VALUES ('bank_account', upper(regexp_replace(NEW.suspect_payment_account, '\s+', '', 'g')), NEW.suspect_payment_account, 1, NEW.financial_loss_idr, NEW.risk_status, NEW.reported_at)
        ON CONFLICT (normalized_value) DO UPDATE SET
            report_count = public.blacklist_entities.report_count + 1,
            total_loss_idr = public.blacklist_entities.total_loss_idr + EXCLUDED.total_loss_idr,
            last_reported_at = GREATEST(public.blacklist_entities.last_reported_at, EXCLUDED.last_reported_at);
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_verified_report_blacklist ON public.fraud_reports;
CREATE TRIGGER trg_sync_verified_report_blacklist
    AFTER INSERT OR UPDATE OF is_email_verified ON public.fraud_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_verified_report_to_blacklist();

-- =============================================================================
-- 8. Semantic Modus Clustering RPC (pgvector Cosine Similarity Search)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.match_similar_fraud_reports(
    query_embedding vector(768),
    match_threshold FLOAT DEFAULT 0.65,
    match_count INT DEFAULT 3
)
RETURNS TABLE (
    id UUID,
    report_code TEXT,
    fake_company_name TEXT,
    modus_category TEXT,
    financial_loss_idr BIGINT,
    chronology_snippet TEXT,
    risk_status TEXT,
    similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
    SELECT
        fr.id,
        fr.report_code,
        fr.fake_company_name,
        fr.modus_category,
        fr.financial_loss_idr,
        fr.chronology_snippet,
        fr.risk_status,
        1 - (fr.chronology_embedding <=> query_embedding) AS similarity
    FROM public.fraud_reports fr
    WHERE fr.chronology_embedding IS NOT NULL
      AND 1 - (fr.chronology_embedding <=> query_embedding) > match_threshold
    ORDER BY fr.chronology_embedding <=> query_embedding
    LIMIT match_count;
$$;

-- =============================================================================
-- 9. Row Level Security (RLS) Policies & Realtime Publication
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.police_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blacklist_entities ENABLE ROW LEVEL SECURITY;

-- Public read access for intelligence radar, case studies, and blacklists
CREATE POLICY "Public can read verified fraud reports"
    ON public.fraud_reports FOR SELECT
    USING (is_email_verified = true);

-- Prevent unverified spam from bypassing email verification on client insert
CREATE POLICY "Public can submit unverified fraud reports only"
    ON public.fraud_reports FOR INSERT
    WITH CHECK (is_email_verified = false);

CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Public can read police case studies"
    ON public.police_case_studies FOR SELECT
    USING (true);

CREATE POLICY "Public can read blacklist entities"
    ON public.blacklist_entities FOR SELECT
    USING (true);

-- Scam Scans: Guests can view via shareable docket ID, or users view their own scans
CREATE POLICY "Public can read scam scans"
    ON public.scam_scans FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Public can insert scam scans"
    ON public.scam_scans FOR INSERT
    WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Enable Supabase Realtime for live radar broadcasts
ALTER PUBLICATION supabase_realtime ADD TABLE public.fraud_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blacklist_entities;
