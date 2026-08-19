import type { TenantSlug } from '@fluxnews/config';
import { getTenantConfig } from '@/tenants';

interface FooterProps {
  tenant: TenantSlug;
}

export function Footer({ tenant }: FooterProps) {
  const config = getTenantConfig(tenant);

  return (
    <footer className="border-t border-border bg-surface mt-16 py-10">
      <div className="max-w-[1280px] mx-auto px-page flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="text-sm font-bold text-text mb-1">{config.name}</p>
          <p className="text-xs text-text-m">
            Notícias sobre {config.niche} com curadoria de IA · {config.domain}
          </p>
        </div>

        <div className="flex gap-5 flex-wrap">
          <a href="/about" className="text-[0.8125rem] text-text-2 no-underline">
            Sobre
          </a>
          <a href="/editorial-policy" className="text-[0.8125rem] text-text-2 no-underline">
            Política Editorial
          </a>
          <a href="/contact" className="text-[0.8125rem] text-text-2 no-underline">
            Contato
          </a>
          <a
            href={`/podcast/${tenant}/feed.xml`}
            className="text-[0.8125rem] text-text-2 no-underline"
          >
            Podcast RSS
          </a>
        </div>

        <p className="text-xs text-text-m w-full mt-2">
          © {new Date().getFullYear()} {config.name} · Conteúdo gerado com assistência de IA e
          curadoria editorial
        </p>
      </div>
    </footer>
  );
}
