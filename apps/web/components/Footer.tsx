import type { TenantSlug } from '@fluxnews/config';
import { getTenantConfig } from '@/tenants';

interface FooterProps {
  tenant: TenantSlug;
}

const NAV = [
  { href: '/about', label: 'Sobre' },
  { href: '/editorial-policy', label: 'Política Editorial' },
  { href: '/contact', label: 'Contato' },
] as const;

export function Footer({ tenant }: FooterProps) {
  const config = getTenantConfig(tenant);

  return (
    <footer className="mt-16 border-t border-border">
      <div className="max-page px-page py-10">
        <div className="flex flex-wrap items-start justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <p
              className="font-display text-text mb-1"
              style={{ fontSize: '1.0625rem', letterSpacing: '-0.015em' }}
            >
              {config.name}
            </p>
            <p className="text-[0.75rem] text-text-m leading-[1.5]">
              {config.niche} · curadoria de IA
              <br />
              <span
                className="font-mono text-[0.6875rem]"
                style={{ color: 'var(--color-accent)', opacity: 0.7 }}
              >
                {config.domain}
              </span>
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-5 flex-wrap items-center">
            {NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.8125rem] text-text-m no-underline hover:text-text-2 transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`/radio/feed.xml`}
              className="text-[0.8125rem] text-text-m no-underline hover:text-text-2 transition-colors duration-150"
            >
              RSS
            </a>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border">
          <p className="text-[0.6875rem] font-mono text-text-m">
            © {new Date().getFullYear()} {config.name}
          </p>
          <p className="text-[0.6875rem] font-mono text-text-m">
            Conteúdo gerado com assistência de IA · curadoria editorial
          </p>
        </div>
      </div>
    </footer>
  );
}
