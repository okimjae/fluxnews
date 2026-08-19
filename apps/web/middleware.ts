import { type NextRequest, NextResponse } from 'next/server';
import type { TenantSlug } from '@fluxnews/config';

const DOMAIN_MAP: Record<string, TenantSlug> = {
  'criptosignal.com.br': 'cripto',
  'saudeplena.net.br': 'saude',
  'techpulse.com.br': 'tech',
  'finanzas360.com.br': 'financas',
  'gameverse.com.br': 'games',
  'golasso.com.br': 'esportes',
  'streamhit.com.br': 'streaming',
  'voltaeletrica.com.br': 'mobilidade',
};

// localhost dev: ?tenant=cripto
const DEFAULT_TENANT: TenantSlug = 'cripto';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const hostname = host.split(':')[0];

  const tenant: TenantSlug =
    DOMAIN_MAP[hostname] ??
    (request.nextUrl.searchParams.get('tenant') as TenantSlug | null) ??
    DEFAULT_TENANT;

  const response = NextResponse.next();
  response.headers.set('x-tenant', tenant);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
