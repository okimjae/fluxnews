import type { TenantSlug } from '@fluxnews/config';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { getTenantConfig } from '@/tenants';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  return {
    title: { default: config.name, template: `%s — ${config.name}` },
    description: `Notícias sobre ${config.niche} com curadoria de IA.`,
    metadataBase: new URL(`https://${config.domain}`),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;

  return (
    <html lang="pt-BR" data-tenant={tenant}>
      <body>
        <Header tenant={tenant} />
        <main>{children}</main>
        <Footer tenant={tenant} />
      </body>
    </html>
  );
}
