import { NextResponse } from 'next/server.js';
import { sendDocketEmail } from '../../../../lib/mail.js';

/**
 * POST /api/mail/send-result
 * Validates recipient email, scanId, score, modus, and red_flags.
 * Dispatches an official HTML forensic docket via Purelymail SMTP.
 * Returns { ok: true, messageId }.
 */
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON body.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Payload body must be a JSON object.' },
        { status: 400 }
      );
    }

    // 1. Validate recipient email
    const rawEmail = body.email || body.recipient || body.to;
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Email penerima tidak valid atau belum diisi.' },
        { status: 400 }
      );
    }

    // 2. Validate scanId
    const rawScanId = body.scanId ?? body.scan_id ?? body.id;
    const scanId =
      rawScanId !== undefined && rawScanId !== null ? String(rawScanId).trim() : '';
    if (!scanId) {
      return NextResponse.json(
        { ok: false, error: 'scanId wajib disertakan.' },
        { status: 400 }
      );
    }

    // 3. Validate score
    const rawScore = body.score ?? body.risk_score;
    const score =
      rawScore !== undefined && rawScore !== null && !isNaN(Number(rawScore))
        ? Number(rawScore)
        : null;
    if (score === null || score < 0 || score > 100) {
      return NextResponse.json(
        { ok: false, error: 'score wajib berupa angka antara 0 dan 100.' },
        { status: 400 }
      );
    }

    // 4. Validate modus
    const rawModus = body.modus || body.modus_category;
    const modus = typeof rawModus === 'string' ? rawModus.trim() : '';
    if (!modus) {
      return NextResponse.json(
        { ok: false, error: 'modus wajib disertakan.' },
        { status: 400 }
      );
    }

    // 5. Validate red_flags
    const redFlags = Array.isArray(body.red_flags)
      ? body.red_flags
      : Array.isArray(body.redFlags)
      ? body.redFlags
      : Array.isArray(body.flags)
      ? body.flags
      : null;

    if (!redFlags) {
      return NextResponse.json(
        { ok: false, error: 'red_flags wajib berupa array.' },
        { status: 400 }
      );
    }

    // Additional optional contextual fields
    const recommendation =
      typeof body.recommendation === 'string' ? body.recommendation.trim() : null;
    const appUrl = typeof body.appUrl === 'string' ? body.appUrl.trim() : null;

    // Send docket email via Nodemailer Purelymail SMTP
    const mailResult = await sendDocketEmail({
      to: email,
      scanId,
      score,
      modus,
      red_flags: redFlags,
      recommendation,
      appUrl,
    });

    return NextResponse.json({
      ok: true,
      messageId: mailResult.messageId,
    });
  } catch (err) {
    console.error('[API /api/mail/send-result] Error sending mail docket:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Gagal mengirim email docket: ' + (err?.message || 'Unknown error'),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method Not Allowed. Gunakan POST untuk mengirim docket email.' },
    { status: 405 }
  );
}
