import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const rawEmail = body?.email;
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';

  if (!email?.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Phase 1: wire to Resend or Brevo once DB is live
  // For now, log and acknowledge so the form works end-to-end
  console.log('[newsletter] subscribe:', email);

  return NextResponse.json({ ok: true }, { status: 200 });
}
