import type { TenantSlug } from '@fluxnews/config';
import { getTenantConfig } from '@/tenants';
import { AdSlot } from './AdSlot';

interface FooterProps {
  tenant: TenantSlug;
}

const NAV = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/politica-editorial', label: 'Política Editorial' },
  { href: '/contato', label: 'Contato' },
] as const;

export function Footer({ tenant }: FooterProps) {
  const config = getTenantConfig(tenant);

  return (
    <footer className="mt-10 border-t border-border">
      {/* Pre-footer leaderboard ad */}
      <div className="flex justify-center py-6 border-b border-border bg-surface">
        <AdSlot size="leaderboard" />
      </div>

      <div className="max-page px-page py-10">
        <div className="flex flex-wrap items-start justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-display text-text text-[1.0625rem] tracking-[-0.015em] mb-1">
              {config.name}
            </p>
            <p className="text-[0.75rem] text-text-m leading-[1.5]">
              {config.niche} · curadoria editorial
              <br />
              <span className="font-mono text-[0.6875rem] text-accent opacity-70">
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
              href="/newsletter"
              className="text-[0.8125rem] text-text-m no-underline hover:text-text-2 transition-colors duration-150"
            >
              Newsletter
            </a>
            <a
              href="/radio/feed.xml"
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
            Curadoria editorial independente · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
