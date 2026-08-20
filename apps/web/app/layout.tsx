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
    description: `As melhores notícias e análises sobre ${config.niche}, com curadoria editorial semanal.`,
    metadataBase: new URL(`https://${config.domain}`),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;

  return (
    <html lang="pt-BR" data-tenant={tenant}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:font-mono focus:text-xs focus:rounded-sm focus:no-underline"
        >
          Pular para conteúdo
        </a>
        <Header tenant={tenant} />
        <main id="main-content">{children}</main>
        <Footer tenant={tenant} />
      </body>
    </html>
  );
}
