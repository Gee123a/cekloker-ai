# Product Requirements Document (PRD) — CekLoker.ai

| Document Metadata | Details |
| :--- | :--- |
| **Product Name** | **CekLoker.ai** — Multimodal Job Scam Triage Scanner & Crowdsourced Fraud Intelligence Radar |
| **Course & Class** | `20261_IMT01306609-A` — Cloud Computing A (Universitas Ciputra) |
| **Lecturers** | Elizabeth Nathania Witanto, S.Kom., M.Sc., Ph.D. & Haning Galih Rani Kumbara |
| **Team Members** | 1. **Stevanus Ivan Santoso** (`0706012410029`)<br>2. **Nicholas Gerwin Mawardji** (`0706012410015`)<br>3. **Jason Christopher** (`0706012410074`) |
| **GitHub Repository** | [`https://github.com/Gee123a/cekloker-ai`](https://github.com/Gee123a/cekloker-ai) *(Initialized blank per request)* |
| **Production Target** | `https://cekloker.uccca.site` (CloudPanel VPS `103.103.138.174` + Supabase BaaS + Purelymail SMTP) |
| **Upcoming Milestone** | **AFL 2 — Progress ALP (MVP)**: Due **Thursday, 12 November 2026, 18:00 WIB** |

---

## 1. Executive Summary & Problem Statement

Job seekers and university graduates in Indonesia face an unprecedented wave of digitally orchestrated recruitment fraud. Between 2022 and 2025, job scams evolved from static fake job postings on websites into **Private Social Engineering Task Scams** (WhatsApp/Telegram commission traps), **Malicious APK Interview Invitations** (`Surat_Panggilan_Interview.apk`), **BUMN/Pertamina Travel Ticket Reimbursement Scams**, and **Identity Harvesting for Illegal Peer-to-Peer Lending (Pinjol)**.

**CekLoker.ai** solves this problem by combining:
1. **Multimodal Vision AI Triage (Gemini 2.5 Flash)**: Instant analysis of uploaded chat screenshots or job flyers to detect psychological manipulation, fee demands, and malicious file extensions.
2. **Crowdsourced Fraud Intelligence Radar (Supabase PostgreSQL + Realtime)**: Instant cross-checking of phone numbers, bank/e-wallet accounts, and company names against verified victim reports.
3. **Semantic Modus Clustering (`pgvector`)**: Vector similarity matching that links novel scam wording to known historical syndicates.
4. **URI Verification & Web Mailer Alerts (Purelymail SMTP `uccca.site`)**: Email-verified report submission and sharable security docket links.

---

## 2. Empirical Data Foundation & Mathematical Rationalization

> [!NOTE]
> **Data Integrity & Source Traceability**
> Every quantitative metric below is empirically computed from two verified project datasets:
> 1. **Crowdsourced Victim Reports Dataset** ([`src_1792117531508_loker_tab4.txt`](file:///Users/mynamegee/.gemini/agy_sources/src_1792117531508_loker_tab4.txt)): **$N = 550$ empirical report records** (`REP-0001` through `REP-0550`, total 551 lines including CSV header).
> 2. **Police & Media Verified Case Studies** ([`ALP_Cloud_Computing_Loker.pdf`](file:///Users/mynamegee/.gemini/antigravity-cli/brain/9dd518b1-a1ce-4c63-a708-3f063ec571d9/ALP_Cloud_Computing_Loker.pdf)): **$N = 15$ documented multi-victim cases** from Bareskrim Polri, Polda Metro Jaya, Polres Metro Bekasi, Detikcom, Kompas, Media Konsumen, and Reddit `r/indonesia` (2022–2025).

### 2.1. Empirical Breakdown of Crowdsourced Dataset ($N = 550$ Reports)
- **Total Recorded Financial Loss ($N = 550$)**: **$\text{Rp } 2,971,950,000$** (Rp 2.97 Billion across 550 individual reports, averaging $\text{Rp } 5,403,545.45$ per report).
- **Direct Financial Loss Incidence**:
  - Reports with monetary loss $> \text{Rp } 0$: **$506 \div 550 = 92.00\%$**
  - Reports with $\text{Rp } 0$ direct transfer (early detection or KTP/identity harvesting prior to disbursement): **$44 \div 550 = 8.00\%$**

#### Table A: Modus Operandi Distribution ($N = 550$)
| Rank | Modus Category (`modus_category`) | Empirical Count ($A$) | Total Scope ($B$) | Percentage ($A \div B = C\%$) |
| :---: | :--- | :---: | :---: | :---: |
| **1** | Tugas Review E-Commerce / Top Up Saldo Fiktif | 97 | 550 | **17.64%** |
| **2** | Loker Luar Negeri / Kamboja Scam Call Center | 81 | 550 | **14.73%** |
| **3** | Kerja Paruh Waktu Undangan File APK Surat Panggilan | 81 | 550 | **14.73%** |
| **4** | Loker BUMN / Pertamina Tiket Travel Bodong | 78 | 550 | **14.18%** |
| **5** | Freelance Like & Subscribe YouTube / TikTok Deposit | 76 | 550 | **13.82%** |
| **6** | Loker Admin Berkedok Pinjol (Minta KTP & Selfie) | 69 | 550 | **12.55%** |
| **7** | Admin Typing / Ketik Dokumen Berbayar Registrasi | 68 | 550 | **12.36%** |
| **Total** | **All Modus Categories** | **550** | **550** | **100.00%** |

#### Table B: Contact Platform Distribution ($N = 550$)
| Platform (`platform_contact`) | Empirical Count ($A$) | Percentage ($A \div 550$) |
| :--- | :---: | :---: |
| **Instagram DM** | 90 | **16.36%** |
| **Threads** | 86 | **15.64%** |
| **LinkedIn InMail** | 85 | **15.45%** |
| **Telegram** | 80 | **14.55%** |
| **SMS** | 75 | **13.64%** |
| **WhatsApp** | 71 | **12.91%** |
| **Facebook Jobs** | 63 | **11.45%** |
| **Total** | **550** | **100.00%** |

#### Table C: Verification & Risk Status Distribution ($N = 550$)
| Risk Status (`risk_status`) | Empirical Count ($A$) | Percentage ($A \div 550$) |
| :--- | :---: | :---: |
| **Investigation** | 156 | **28.36%** |
| **Verified Scam** | 142 | **25.82%** |
| **High Risk** | 132 | **24.00%** |
| **Confirmed Fraud** | 120 | **21.82%** |
| **Total** | **550** | **100.00%** |

### 2.2. Macro Police & Media Case Studies ($N = 15$ Major Cases)
Across the 15 verified national cases documented in the proposal (`ALP_Cloud_Computing_Loker.pdf`), the 12 cases with explicit monetary figures account for **$\text{Rp } 62,199,845,000$** ($\approx \text{Rp } 62.20\text{ Billion}$) in documented losses, led by Case #3 (*Sindikat Transnasional Scam Paruh Waktu & TPPO*, Juli 2024: $\text{Rp } 59,000,000,000$ across 823 WNI victims) and Case #1 (*Kasus Loker Konter HP PGC Cililitan*, Juli 2024: $\text{Rp } 1,170,000,000$ across 27 victims).

---

## 3. Core Product Features & Functional Requirements

### Feature 1: Multimodal Scam Triage Scanner (`/scan`)
- **User Story**: As a job applicant, I want to upload a screenshot of a WhatsApp/Telegram chat, email, or job poster so I can immediately know if it is a scam before sending money or KTP photos.
- **Functional Requirements**:
  - **FR-1.1**: Accept image uploads (`PNG`, `JPG`, `WEBP` up to 5 MB) via drag-and-drop or clipboard paste, or raw text paste.
  - **FR-1.2**: Upload image to **Supabase Storage** (`scam-evidence` bucket) and pass image buffer to **Google Gemini 2.5 Flash**.
  - **FR-1.3**: Extract phone numbers, bank/e-wallet account numbers, and company names from the image via OCR and automatically cross-query the `blacklist_entities` and `fraud_reports` tables in **Supabase PostgreSQL**.
  - **FR-1.4**: Combine AI evaluation + database blacklist hits to compute a final **Scam Probability Score (`0%` to `100%`)** and risk tier (`Safe [0-24%]`, `Suspicious [25-59%]`, `High Risk [60-84%]`, `Confirmed Fraud [85-100%]`).
  - **FR-1.5**: Display a structured breakdown of **Triggered Red Flags** (e.g., *"Requests upfront registration/travel fee"*, *"Contains `.apk` file attachment"*, *"Bank account `BRI - 109088086` matched in 1+ victim reports"*).

### Feature 2: Crowdsourced Intelligence Radar (`/radar`)
- **User Story**: As a job seeker, I want to search a phone number, bank account number, or company name to see if other applicants have reported it as fraudulent.
- **Functional Requirements**:
  - **FR-2.1**: Instant search bar querying across `suspect_contact`, `suspect_payment_account`, and `fake_company_name` across all **550 seeded reports** + newly verified community reports.
  - **FR-2.2**: Filterable directory by **Modus Category** (7 categories), **Platform** (7 platforms), **City**, and **Risk Status**.
  - **FR-2.3**: **Live Realtime Feed** powered by **Supabase Realtime** (`postgres_changes`) that pushes a live toast and prepends newly verified reports without refreshing the page.

### Feature 3: Semantic Modus Clustering (`/clusters`)
- **User Story**: As a user facing a new scam script where the scammer changed their phone number and company name, I still want the system to recognize the underlying scam pattern.
- **Functional Requirements**:
  - **FR-3.1**: Generate a 768-dimensional embedding (`text-embedding-004`) of the scanned text/chronology.
  - **FR-3.2**: Execute a `pgvector` cosine similarity search (`1 - (chronology_embedding <=> query_embedding)`) against the 550 empirical reports and 15 police case studies.
  - **FR-3.3**: Display the **Top 3 Most Similar Historical Cases** with their similarity percentage, modus category, average financial loss, and official news/police reference links.

### Feature 4: URI Link Verification & Web Mailer Docket (`/verify/[token]` & Purelymail SMTP)
- **User Story**: As a victim submitting a fraud report or saving a scan result, I want to verify my report via email link so the radar stays spam-free, and receive an official HTML security docket in my inbox.
- **Functional Requirements**:
  - **FR-4.1**: When submitting a new scam report (`/report`), generate a unique cryptographic `verification_token` and send a verification email via **Purelymail SMTP (`mailserver.purelymail.com:587`, sender `ivan@uccca.site`)**.
  - **FR-4.2**: Clicking the **URI Link** (`https://cekloker.uccca.site/api/verify?token=[token]`) marks the report as `Verified Scam`, updates the public blacklist, and redirects the user to their published report card.
  - **FR-4.3**: Users can email any Scan Result Docket to themselves or a friend using a light/dark-mode-resilient HTML email template.

---

## 4. AI Output Contract (Strict JSON Schema)

Every call to `/api/scan` enforces the following deterministic JSON schema from **Gemini 2.5 Flash**:

```json
{
  "risk_score": 94,
  "risk_status": "Confirmed Fraud",
  "modus_category": "Kerja Paruh Waktu Undangan File APK Surat Panggilan",
  "summary_id": "Terdeteksi modus pengiriman file aplikasi berbahaya (.apk) berkedok surat panggilan interview yang bertujuan membobol m-banking.",
  "extracted_entities": {
    "company_name": "PT Samudera Logistik Indo",
    "phone_numbers": ["08211758183"],
    "payment_accounts": ["Mandiri - 883056365"],
    "malicious_files": ["Surat_Panggilan_Interview.apk"]
  },
  "red_flags": [
    {
      "indicator": "Malicious APK Attachment",
      "severity": "CRITICAL",
      "evidence": "File bernama 'Surat_Panggilan_Interview.apk' dikirim melalui chat WhatsApp."
    },
    {
      "indicator": "Blacklisted Bank Account Match",
      "severity": "HIGH",
      "evidence": "Rekening Mandiri - 883056365 tercatat pada laporan REP-0044 dengan kerugian Rp 7.500.000."
    }
  ],
  "recommended_actions": [
    "JANGAN unduh atau instal file berakhiran .apk dari chat WhatsApp/Telegram.",
    "Blokir nomor pengirim 08211758183 secara langsung.",
    "Laporkan nomor rekening Mandiri 883056365 melalui portal CekRekening Kominfo."
  ]
}
```

---

## 5. Phased Implementation Roadmap (Toward AFL 2 & ALP)

| Phase | Target Date | Deliverables | Course Rubric Alignment |
| :--- | :--- | :--- | :--- |
| **Phase 0: Repo, PRD & Architecture** | **6 Nov 2026 (Done)** | Blank GitHub repo [`Gee123a/cekloker-ai`](https://github.com/Gee123a/cekloker-ai), Tech Stack Spec, and empirical PRD. | Project Planning & Scope Synchronization |
| **Phase 1: MVP Core & README (AFL 2)** | **By 12 Nov 2026, 18:00 WIB** | 1. Next.js 15 scaffold + Supabase schema migration.<br>2. Seed all **550 empirical reports** + **15 police case studies**.<br>3. Working `/scan` (Gemini Vision) + `/radar` lookup.<br>4. Comprehensive `README.md` with architecture & feature progress pushed to GitHub. | **AFL 2 — Progress ALP MVP Submission** (Module 2 & 3) |
| **Phase 2: URI Link, SMTP & Realtime** | **Weeks 9–12** | 1. Purelymail SMTP docket & URI link verification (`/api/verify`).<br>2. Supabase Auth + RLS + Storage bucket + Realtime live radar.<br>3. Deploy live to CloudPanel (`https://cekloker.uccca.site`) with GitHub Actions CI/CD. | **Module 2 (IaaS/PaaS) & Module 3 (Supabase BaaS)** |
| **Phase 3: Final Polish & ALP Demo** | **Weeks 15–16** | End-to-end stress testing, `pgvector` semantic modus clustering UI, final report & live presentation. | **Module 4 — ALP (25% Final Grade)** |
