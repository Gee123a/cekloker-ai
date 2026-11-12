<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![Next.js][nextjs-shield]][nextjs-url]
[![Supabase][supabase-shield]][supabase-url]
[![CloudPanel][cloudpanel-shield]][cloudpanel-url]

</div>

<!-- PROJECT LOGO & HEADER -->
<br />
<div align="center">
  

  <h1 align="center">CekLoker.ai</h1>

  <p align="center">
    <strong>Platform Intelijen & Triage Deteksi Penipuan Lowongan Kerja Berbasis Multimodal AI Vision & Crowdsourced Database</strong>
    <br />
    Tugas Besar & Portofolio Proyek Cloud Computing (IMT013) &mdash; Universitas Ciputra Surabaya
    <br />
    <br />
    <a href="https://cekloker.uccca.site"><strong>Kunjungi Aplikasi Live »</strong></a>
    &nbsp;·&nbsp;
    <a href="https://github.com/Gee123a/cekloker-ai/issues">Laporkan Bug</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/Gee123a/cekloker-ai/pulls">Ajukan Fitur</a>
  </p>
</div>

<details>
  <summary><strong>Daftar Isi</strong> (Klik untuk membuka)</summary>
  <ol>
    <li><a href="#tentang-proyek">Tentang Proyek</a></li>
    <li><a href="#fitur-utama">Fitur Utama</a></li>
    <li><a href="#arsitektur--teknologi-cloud">Arsitektur & Teknologi Cloud</a></li>
    <li><a href="#status-fitur--roadmap">Status Fitur & Roadmap (AFL 2 & ALP)</a></li>
    <li><a href="#panduan-instalasi-lokal">Panduan Instalasi Lokal</a></li>
    <li><a href="#skema-database--keamanan">Skema Database & Keamanan</a></li>
    <li><a href="#tim-pengembang">Tim Pengembang</a></li>
    <li><a href="#lisensi--kontak">Lisensi & Kontak</a></li>
  </ol>
</details>

---

## Tentang Proyek

**CekLoker.ai** adalah solusi pertahanan digital berbasis cloud yang dirancang untuk melindungi para pencari kerja (khususnya fresh graduate dan mahasiswa di Indonesia) dari maraknya sindikat lowongan kerja bodong (*fake job scams*), modus penipuan tiket travel interview, kerja paruh waktu rating produk (like/subscribe palsu), hingga sindikat human trafficking (TPPO kamboja/judi online).

Platform ini mengintegrasikan pemindaian gambar bukti chat/poster loker menggunakan model Vision AI canggih, verifikasi entitas real-time terhadap repositori blacklist terpusat, serta radar laporan publik berbasis komunitas yang terdistribusi di infrastruktur cloud bereputasi tinggi.

### Masalah yang Diselesaikan:
- **Kerugian Finansial Pelamar**: Surat panggilan wawancara palsu mencatut BUMN/korporasi ternama yang mewajibkan transfer agen travel tertentu.
- **Pencurian Identitas (KYC Data Harvesting)**: Penipuan form lamaran kerja yang meminta scan KTP, KK, dan selfie buku tabungan.
- **Silo Informasi Penipuan**: Kurangnya database terbuka yang dapat diakses instan oleh publik saat menerima tawaran mencurigakan via WhatsApp/Telegram.

<p align="right">(<a href="#readme-top">kembali ke atas ↑</a>)</p>

---

## Fitur Utama

- 🔍 **AI Multimodal Vision Scanner**: Unggah tangkapan layar chat WhatsApp, Telegram, email panggilan interview, atau poster Instagram. Model AI membedah red flags, legalitas kontak, serta modus transfer uang secara instan.
- 📡 **Radar Laporan Penipuan Terkini**: Papan peringatan real-time yang mengagregasi insiden penipuan terlapor dari masyarakat lengkap dengan modus, instansi yang dicatut, dan tingkat bahaya (*threat level*).
- 🛡️ **Blacklist Database & Pattern Matching**: Pencarian nomor rekening bank, e-wallet, nomor WhatsApp scammer, serta tautan web pancingan (*phishing*) yang terverifikasi.
- 🚨 **Sistem Aduan Publik (Crowdsourced Reporting)**: Fasilitas pelaporan anonim bersertifikat verifikasi email otomatis untuk memperluas basis data pertahanan komunitas.
- ⚡ **Auto-Deploy Continuous Delivery (CI/CD)**: Integrasi GitHub Actions otomatis yang mengaudit kualitas kode, menjalankan linter, build optimasi, dan rilis zero-downtime ke server VPS.

<p align="right">(<a href="#readme-top">kembali ke atas ↑</a>)</p>

---

## Arsitektur & Teknologi Cloud

Sistem dibangun dengan mematuhi prinsip arsitektur Cloud Computing modern yang memisahkan lapisan presentation, compute engine, database, dan security perimeter:

### 1. Frontend & Client Layer
* [![Next.js][nextjs-badge]][nextjs-url] **Next.js 16 (App Router)** &mdash; Fullstack React Framework dengan Server Components dan Turbopack bundler.
* [![TailwindCSS][tailwind-badge]][tailwind-url] **Tailwind CSS v4** &mdash; Sistem utilitas styling modern, responsive, dan high-performance micro-interactions.
* [![Lucide][lucide-badge]][lucide-url] **Lucide React** &mdash; Library ikon antarmuka yang clean dan konsisten.

### 2. Compute & Platform as a Service (PaaS)
* [![CloudPanel][cloudpanel-badge]][cloudpanel-url] **CloudPanel Control Panel (Debian VPS)** &mdash; Manajemen isolasi PHP/Node engine, user privilege privilege, dan monitoring resource.
* [![Nginx][nginx-badge]][nginx-url] **Nginx Reverse Proxy & HTTP/2** &mdash; Reverse proxy load routing, static caching, dan proteksi header SSL/TLS.
* [![PM2][pm2-badge]][pm2-url] **PM2 Process Manager** &mdash; Manajemen worker process cluster, auto-restart on failure, dan log streaming.
* [![LetsEncrypt][letsencrypt-badge]][letsencrypt-url] **Let's Encrypt Free SSL** &mdash; Sertifikat enkripsi TLS/SSL otomatis via Certbot ACME.

### 3. Backend as a Service (BaaS) & Intelligence Layer
* [![Supabase][supabase-badge]][supabase-url] **Supabase Cloud (PostgreSQL 15)** &mdash; Enterprise database engine dengan extension `pgvector` dan `pg_trgm` untuk fuzzy text matching.
* [![Gemini][gemini-badge]][gemini-url] **Google Gemini 3.1 Multimodal Vision API** &mdash; Engine analisis gambar dokumen cerdas untuk identifikasi pola manipulasi teks lowongan.
* [![Purelymail][smtp-badge]][smtp-url] **Purelymail SMTP Gateway (`@uccca.site`)** &mdash; Layanan transactional email delivery untuk notifikasi laporan fraud terverifikasi.

<p align="right">(<a href="#readme-top">kembali ke atas ↑</a>)</p>

---

## Status Fitur & Roadmap

Sesuai dengan matriks capaian asesmen perkuliahan **AFL 2 (Pertemuan 10)** dan target rilis **ALP (Pertemuan 14)**:

| Modul / Fitur | Deskripsi Teknis | Status | Target Milestone |
| :--- | :--- | :---: | :---: |
| **Arsitektur Cloud & Domain** | Setup DNS Subdomain `cekloker.uccca.site`, VPS Nginx Proxy, Let's Encrypt SSL | <span style="color:#22c55e">**✅ Selesai**</span> | AFL 2 |
| **Database & Security Schema** | Migrasi PostgreSQL Supabase, RLS policies, indexing tabel audit penipuan | <span style="color:#22c55e">**✅ Selesai**</span> | AFL 2 |
| **Automated CI/CD Pipeline** | GitHub Actions build verification, Turbopack bundle check, auto-deploy SSH | <span style="color:#22c55e">**✅ Selesai**</span> | AFL 2 |
| **Portal & Antarmuka Responsif** | Halaman Beranda, Halaman Scanner, Navigasi App Router, Komponen UploadBox | <span style="color:#22c55e">**✅ Selesai**</span> | AFL 2 |
| **Papan Pantau Radar Publik** | Feed live laporan penipuan, filter kategori, badge tingkat keparahan risiko | <span style="color:#f59e0b">**🚧 Sebagian**</span> | AFL 2 / Sprint 2 |
| **Vision Scanner Gemini API** | Integrasi multimodal endpoint ekstraksi payload gambar bukti loker | <span style="color:#f59e0b">**🚧 Sebagian**</span> | Sprint 2 |
| **Pusat Laporan Mandiri** | Form pelaporan penipuan publik lengkap dengan validasi bukti transaksi | <span style="color:#f59e0b">**🚧 Sebagian**</span> | Sprint 2 |
| **Email Verifikasi Notifikasi** | Gateway SMTP otomatis `@uccca.site` ke pelapor saat aduan tervalidasi | <span style="color:#94a3b8">**⏳ Roadmap**</span> | ALP (Minggu 14) |
| **Vector Similarity Matching** | Pencocokan semantik modus penipuan berulang menggunakan `pgvector` | <span style="color:#94a3b8">**⏳ Roadmap**</span> | ALP (Minggu 14) |

<p align="right">(<a href="#readme-top">kembali ke atas ↑</a>)</p>

---

## Panduan Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan CekLoker.ai di lingkungan komputer lokal Anda:

### Prasyarat
- **Node.js**: Versi `20.x` LTS atau lebih baru
- **NPM**: Versi `10.x` atau yarn/pnpm
- **Git**: Terpasang di terminal

### Langkah Instalasi
1. **Clone repositori:**
   ```bash
   git clone https://github.com/Gee123a/cekloker-ai.git
   cd cekloker-ai
   ```

2. **Pasang seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Salin berkas contoh konfigurasi:
   ```bash
   cp .env.example .env.local
   ```
   Lengkapi variabel environment berikut di `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://dlecyxmslcsdcxkdcjlj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_publishable_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Google AI Studio / Gemini Multimodal API
   GEMINI_API_KEY=your_gemini_api_key

   # SMTP Transactional Mailer
   SMTP_HOST=mailserver.purelymail.com
   SMTP_PORT=587
   SMTP_USER=no-reply@uccca.site
   SMTP_PASS=your_purelymail_password
   ```

4. **Jalankan server pengembangan lokal:**
   ```bash
   npm run dev
   ```
   Buka peramban dan akses alamat: `http://localhost:3000`

<p align="right">(<a href="#readme-top">kembali ke atas ↑</a>)</p>

---

## Skema Database & Keamanan

Data disimpan dalam PostgreSQL cluster terkelola pada **Supabase** dengan enkripsi *data-at-rest* dan proteksi *Row Level Security (RLS)*:

- `scam_scans`: Menyimpan log analisis AI, probabilitas penipuan (0-100%), ringkasan indikator bahaya, dan metadata gambar.
- `fraud_reports`: Menyimpan arsip laporan yang dikirimkan oleh publik beserta status verifikasi kurator.
- `blacklist_entities`: Tabel lookup terindeks yang menampung ribuan nomor rekening, e-wallet, domain scam, dan nomor telepon penipu berulang.
- `police_case_studies`: Basis pengetahuan kasus penipuan riil dari putusan hukum dan kepolisian untuk perbandingan analisis pola.

<p align="right">(<a href="#readme-top">kembali ke atas ↑</a>)</p>

---

## Tim Pengembang

Proyek ini dikembangkan oleh tim mahasiswa **Universitas Ciputra Surabaya** pada mata kuliah **Cloud Computing A (IMT013)** di bawah bimbingan dosen koordinator:
**Elizabeth Nathania Witanto, S.Kom., M.Sc., Ph.D.**

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <a href="https://github.com/Gee123a">
          <img src="https://github.com/Gee123a.png" width="100px;" alt="Stevanus Ivan Santoso" style="border-radius:50%;"/><br />
          <sub><b>Stevanus Ivan Santoso</b></sub>
        </a>
        <br />
        <sub>NIM: 0706012410029</sub>
        <br />
        <sub><b>Lead AI & Vision Pipeline Engineer</b></sub>
        <br />
        <small>Gemini Vision Prompt Engineering, Multimodal Pipeline, Architecture Coordination</small>
      </td>
      <td align="center" width="33%">
        <a href="https://github.com/nikigitdev">
          <img src="https://github.com/nikigitdev.png" width="100px;" alt="Nicholas Gerwin Mawardji" style="border-radius:50%;" onerror="this.src='https://github.com/nikiwoi.png'"/><br />
          <sub><b>Nicholas Gerwin Mawardji</b></sub>
        </a>
        <br />
        <sub>NIM: 0706012410015</sub>
        <br />
        <sub><b>Cloud Infrastructure & Database Architect</b></sub>
        <br />
        <small>CloudPanel VPS Deployment, Nginx SSL, Supabase Schema, CI/CD Pipeline</small>
      </td>
      <td align="center" width="33%">
        <a href="https://github.com/JesCe303">
          <img src="https://github.com/JesCe303.png" width="100px;" alt="Jason Christopher" style="border-radius:50%;"/><br />
          <sub><b>Jason Christopher</b></sub>
        </a>
        <br />
        <sub>NIM: 0706012410074</sub>
        <br />
        <sub><b>Frontend Engineer & UX Designer</b></sub>
        <br />
        <small>Next.js App Router, Tailwind UI Components, Responsive Layout, Quality Assurance</small>
      </td>
    </tr>
  </table>
</div>

<p align="right">(<a href="#readme-top">kembali ke atas ↑</a>)</p>

---

## Lisensi & Kontak

Proyek ini didistribusikan di bawah lisensi terbuka **MIT License**. Lihat berkas `LICENSE` untuk informasi selengkapnya.

* **Domain Aplikasi**: [https://cekloker.uccca.site](https://cekloker.uccca.site)
* **Repositori GitHub**: [https://github.com/Gee123a/cekloker-ai](https://github.com/Gee123a/cekloker-ai)
* **Kritik & Masukan**: [Buka Issue Baru](https://github.com/Gee123a/cekloker-ai/issues/new)

<p align="right">(<a href="#readme-top">kembali ke atas ↑</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/Gee123a/cekloker-ai.svg?style=for-the-badge&color=blue
[contributors-url]: https://github.com/Gee123a/cekloker-ai/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Gee123a/cekloker-ai.svg?style=for-the-badge&color=blue
[forks-url]: https://github.com/Gee123a/cekloker-ai/network/members
[stars-shield]: https://img.shields.io/github/stars/Gee123a/cekloker-ai.svg?style=for-the-badge&color=gold
[stars-url]: https://github.com/Gee123a/cekloker-ai/stargazers
[issues-shield]: https://img.shields.io/github/issues/Gee123a/cekloker-ai.svg?style=for-the-badge&color=red
[issues-url]: https://github.com/Gee123a/cekloker-ai/issues
[license-shield]: https://img.shields.io/github/license/Gee123a/cekloker-ai.svg?style=for-the-badge&color=green
[license-url]: https://github.com/Gee123a/cekloker-ai/blob/main/LICENSE

[nextjs-shield]: https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js
[nextjs-url]: https://nextjs.org/
[supabase-shield]: https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase
[supabase-url]: https://supabase.com/
[cloudpanel-shield]: https://img.shields.io/badge/CloudPanel-VPS-2563EB?style=for-the-badge&logo=linux
[cloudpanel-url]: https://www.cloudpanel.io/

[nextjs-badge]: https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white
[tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com/
[lucide-badge]: https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square&logo=feather&logoColor=white
[lucide-url]: https://lucide.dev/
[cloudpanel-badge]: https://img.shields.io/badge/CloudPanel_Host-2563EB?style=flat-square&logo=serverfault&logoColor=white
[nginx-badge]: https://img.shields.io/badge/Nginx_Proxy-009639?style=flat-square&logo=nginx&logoColor=white
[nginx-url]: https://nginx.org/
[pm2-badge]: https://img.shields.io/badge/PM2_Cluster-2B037A?style=flat-square&logo=pm2&logoColor=white
[pm2-url]: https://pm2.keymetrics.io/
[letsencrypt-badge]: https://img.shields.io/badge/Let's_Encrypt-003A70?style=flat-square&logo=letsencrypt&logoColor=white
[letsencrypt-url]: https://letsencrypt.org/
[supabase-badge]: https://img.shields.io/badge/Supabase_Cloud-3ECF8E?style=flat-square&logo=supabase&logoColor=white
[gemini-badge]: https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white
[gemini-url]: https://ai.google.dev/
[smtp-badge]: https://img.shields.io/badge/Purelymail_SMTP-EA4335?style=flat-square&logo=gmail&logoColor=white
[smtp-url]: https://purelymail.com/
