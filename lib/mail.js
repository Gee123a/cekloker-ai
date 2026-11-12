import fs from 'fs';
import path from 'path';

function getSmtpCredentials() {
  let user = process.env.SMTP_USER;
  let pass = process.env.SMTP_PASS;

  if (!pass) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const userMatch = content.match(/SMTP_USER=["\']?([^"\'\r\n]+)["\']?/);
        const passMatch = content.match(/SMTP_PASS=["\']?([^"\'\r\n]+)["\']?/);
        if (userMatch && userMatch[1]) user = userMatch[1].trim();
        if (passMatch && passMatch[1]) pass = passMatch[1].trim();
      }
    } catch {}
  }
  return {
    user: user || 'cekloker@uccca.site',
    pass: pass || 'passwordceklokerini@@'
  };
}
import nodemailer from 'nodemailer';

/**
 * Returns a configured Nodemailer transporter using Purelymail SMTP.
 * Default host: mailserver.purelymail.com
 * Default port: 587 (STARTTLS)
 * Default user: cekloker@uccca.site
 */
export function getMailTransporter(options = {}) {
  const host = process.env.SMTP_HOST || 'mailserver.purelymail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const creds = getSmtpCredentials();
  const user = creds.user;
  const pass = creds.pass;

  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    ...options,
  });
}

/**
 * Normalizes and formats red flag items into structured objects.
 * Supports:
 * - Arrays: [indicator, evidence]
 * - Objects: { indicator, evidence } or { title, description }
 * - Strings: "Suspicious indicator"
 */
export function formatRedFlags(flags) {
  if (!Array.isArray(flags)) return [];
  return flags.map((item) => {
    if (Array.isArray(item)) {
      return {
        indicator: String(item[0] || 'Tanda Bahaya'),
        evidence: String(item[1] || ''),
      };
    }
    if (item && typeof item === 'object') {
      return {
        indicator: String(item.indicator || item.title || item.name || 'Tanda Bahaya'),
        evidence: String(item.evidence || item.description || item.detail || ''),
      };
    }
    return {
      indicator: String(item || 'Tanda Bahaya'),
      evidence: '',
    };
  });
}

/**
 * Returns color tokens and status labels for a given risk score (0-100).
 */
export function getScoreMetadata(score) {
  const numScore = Math.max(0, Math.min(100, Number(score) || 0));
  if (numScore >= 85) {
    return {
      status: 'Confirmed Fraud',
      stamp: 'Kemungkinan Besar Penipuan',
      color: '#ef4444',
      bgColor: '#450a0a',
      borderColor: '#dc2626',
    };
  }
  if (numScore >= 60) {
    return {
      status: 'High Risk',
      stamp: 'Risiko Tinggi — Waspada',
      color: '#f59e0b',
      bgColor: '#451a03',
      borderColor: '#d97706',
    };
  }
  if (numScore >= 30) {
    return {
      status: 'Suspicious',
      stamp: 'Mencurigakan — Butuh Verifikasi',
      color: '#eab308',
      bgColor: '#422006',
      borderColor: '#ca8a04',
    };
  }
  return {
    status: 'Safe',
    stamp: 'Terindikasi Aman',
    color: '#10b981',
    bgColor: '#064e3b',
    borderColor: '#059669',
  };
}

/**
 * Generates responsive, high-contrast, light/dark-resilient HTML email docket.
 */
export function generateDocketHtml({ scanId, score, modus, red_flags, recommendation, appUrl }) {
  const scoreMeta = getScoreMetadata(score);
  const formattedFlags = formatRedFlags(red_flags);
  const baseAppUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://cekloker.uccca.site';
  const smtpUser = process.env.SMTP_USER || 'cekloker@uccca.site';

  const recText =
    recommendation ||
    'Jangan transfer uang, jangan instal file .apk, dan jangan kirimkan foto KTP atau selfie identitas. Hentikan percakapan dan laporkan kasus ini agar pelamar lain terlindungi.';

  const redFlagsHtml = formattedFlags
    .map(
      (f, idx) => `
        <tr>
          <td style="padding: 8px 0; vertical-align: top;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1e293b; border-radius: 6px; padding: 12px 14px;">
              <tr>
                <td width="28" valign="top" style="font-size: 14px; font-weight: 800; color: #ef4444; line-height: 1.4;">
                  #${idx + 1}
                </td>
                <td valign="top">
                  <div style="font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 2px;">
                    ${f.indicator}
                  </div>
                  ${
                    f.evidence
                      ? `<div style="font-size: 12px; color: #94a3b8; line-height: 1.4;">${f.evidence}</div>`
                      : ''
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CekLoker.ai Security Docket ${scanId}</title>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0b0f19;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 24px 28px; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-bottom: 1px solid #312e81;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 10px; background-color: #4338ca; color: #e0e7ff; font-size: 11px; font-weight: 700; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">CekLoker.ai Security Docket</span>
                    <h1 style="margin: 8px 0 2px 0; font-size: 22px; font-weight: 800; color: #ffffff;">Laporan Hasil Forensik Scam Loker</h1>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">Ref: ${scanId} &bull; Universitas Ciputra &bull; Cloud Computing A</p>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-size: 28px;">🛡️</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Score & Stamp Banner -->
          <tr>
            <td style="padding: 24px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${scoreMeta.bgColor}; border: 1px solid ${scoreMeta.borderColor}; border-radius: 8px; padding: 20px;">
                <tr>
                  <td width="35%" align="center" style="border-right: 1px solid rgba(255,255,255,0.1); padding-right: 16px;">
                    <div style="font-size: 11px; font-weight: 600; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">SKOR RISIKO</div>
                    <div style="font-size: 42px; font-weight: 900; color: ${scoreMeta.color}; line-height: 1.1; margin: 4px 0;">${score}%</div>
                    <div style="font-size: 11px; color: #94a3b8;">${scoreMeta.status}</div>
                  </td>
                  <td width="65%" style="padding-left: 20px;">
                    <div style="font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Status Klasifikasi</div>
                    <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 4px 0 8px 0;">${scoreMeta.stamp}</div>
                    <div style="font-size: 13px; color: #e2e8f0;"><strong style="color: #94a3b8;">Modus Terindikasi:</strong><br>${modus}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Red Flags Section -->
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <h2 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px;">
                ⚠️ Tanda Bahaya Terdeteksi (${formattedFlags.length})
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${redFlagsHtml || '<tr><td style="color: #94a3b8; font-size: 13px;">Tidak ada tanda bahaya kritis yang terdeteksi.</td></tr>'}
              </table>
            </td>
          </tr>

          <!-- Recommendation Section -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: #1e293b; border-left: 4px solid #3b82f6; border-radius: 6px; padding: 16px 18px;">
                <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #60a5fa;">💡 Saran Keamanan Langsung</h3>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #cbd5e1;">${recText}</p>
              </div>
            </td>
          </tr>

          <!-- Action Buttons / Links -->
          <tr>
            <td style="padding: 0 28px 28px 28px;" align="center">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 0 6px;">
                    <a href="${baseAppUrl}/radar" style="display: inline-block; padding: 10px 18px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 6px;">Cek Database Radar</a>
                  </td>
                  <td style="padding: 0 6px;">
                    <a href="https://patrolisiber.id" style="display: inline-block; padding: 10px 18px; background-color: #1e293b; border: 1px solid #475569; color: #f8fafc; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 6px;">Lapor ke Patroli Siber</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; background-color: #0d131f; border-top: 1px solid #1f2937; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">
                Diterbitkan secara otomatis oleh Purelymail SMTP Gateway (<code style="color: #94a3b8;">${smtpUser}</code>)
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                &copy; 2026 CekLoker.ai &bull; Cloud Infrastructure &amp; AI Security System &bull; Universitas Ciputra Surabaya
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates clean plain text fallback for email clients without HTML support.
 */
export function generateDocketPlainText({ scanId, score, modus, red_flags, recommendation, appUrl }) {
  const scoreMeta = getScoreMetadata(score);
  const formattedFlags = formatRedFlags(red_flags);
  const baseAppUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://cekloker.uccca.site';
  const smtpUser = process.env.SMTP_USER || 'cekloker@uccca.site';

  const recText =
    recommendation ||
    'Jangan transfer uang, jangan instal file .apk, dan jangan kirimkan foto KTP atau selfie identitas. Hentikan percakapan dan laporkan kasus ini agar pelamar lain terlindungi.';

  const flagsList = formattedFlags
    .map((f, i) => `${i + 1}. ${f.indicator}${f.evidence ? ` - ${f.evidence}` : ''}`)
    .join('\n');

  return `================================================================================
CEKLOKER.AI — SECURITY DOCKET (${scanId})
================================================================================
Skor Risiko : ${score}% (${scoreMeta.status})
Status      : ${scoreMeta.stamp}
Modus       : ${modus}
Waktu       : ${new Date().toISOString()}

TANDA BAHAYA TERDETEKSI (${formattedFlags.length}):
${flagsList || 'Tidak ada tanda bahaya kritis.'}

SARAN KEAMANAN:
${recText}

Akses Radar Blacklist: ${baseAppUrl}/radar
Laporkan ke Patroli Siber: https://patrolisiber.id
Laporkan Rekening ke: https://cekrekening.id

--------------------------------------------------------------------------------
Diterbitkan otomatis oleh CekLoker.ai via Purelymail SMTP (${smtpUser})
Universitas Ciputra Surabaya - Cloud Computing A
================================================================================`;
}

/**
 * Dispatches an HTML email docket via Purelymail SMTP.
 * Returns { ok: true, messageId }.
 */
export async function sendDocketEmail(
  { to, scanId, score, modus, red_flags, recommendation, appUrl },
  customTransporter = null
) {
  const creds = getSmtpCredentials();
  const user = creds.user;
  const pass = creds.pass;

  const html = generateDocketHtml({ scanId, score, modus, red_flags, recommendation, appUrl });
  const text = generateDocketPlainText({ scanId, score, modus, red_flags, recommendation, appUrl });

  const mailOptions = {
    from: process.env.SMTP_FROM || `CekLoker.ai Security Docket <${user}>`,
    to,
    subject: `[CekLoker.ai] Hasil Analisis Forensik Loker ${scanId} (Skor Risiko: ${score}%)`,
    text,
    html,
  };

  // If no SMTP_PASS is configured and no custom transporter is provided (dev/CI/test environment):
  if (!customTransporter && (!pass || pass.includes('placeholder') || pass.includes('your-'))) {
    console.warn('[Purelymail SMTP] SMTP_PASS is missing or placeholder. Simulating email dispatch for development/test.');
    return {
      ok: true,
      messageId: `<simulated-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@uccca.site>`,
      simulated: true,
    };
  }

  const transporter = customTransporter || getMailTransporter();
  const info = await transporter.sendMail(mailOptions);

  return {
    ok: true,
    messageId: info.messageId,
  };
}
