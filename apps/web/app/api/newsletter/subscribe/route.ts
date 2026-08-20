import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { subscribeEmail } from '@/lib/queries';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const rawEmail = body?.email;
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

  if (!email || !email.includes('@') || email.length > 254) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;

  const result = await subscribeEmail(tenant, email);
  return NextResponse.json({ ok: true, status: result }, { status: 200 });
}
