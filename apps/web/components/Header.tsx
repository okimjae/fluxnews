import type { TenantSlug } from '@fluxnews/config';
import { getTenantConfig } from '@/tenants';
import { MobileNav } from './MobileNav';

interface HeaderProps {
  tenant: TenantSlug;
}

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/categoria/editorial', label: 'Editorial' },
  { href: '/categoria/analise', label: 'Análise' },
  { href: '/categoria/tendencias', label: 'Tendências' },
  { href: '/radio', label: 'Rádio' },
  { href: '/newsletter', label: 'Newsletter', accent: true },
];

export function Header({ tenant }: HeaderProps) {
  const config = getTenantConfig(tenant);

  const now = new Date();
  const dateLabel = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="glass border-b border-border sticky top-0 z-50">
      {/* Accent bar */}
      <div className="accent-bar w-full" />

      {/* Pre-header — date + quick links */}
      <div className="pre-header">
        <span className="capitalize hidden sm:block">{dateLabel}</span>
        <a
          href="/radio"
          className="flex items-center gap-1.5 no-underline hover:text-text-2 transition-colors"
          aria-label="Rádio ao vivo"
        >
          <span
            className="block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
            aria-hidden="true"
          />
          Rádio ao vivo
        </a>
        <span className="hidden sm:block text-border-2">·</span>
        <span className="hidden sm:block">{config.niche}</span>
        <a href="/newsletter" className="ml-auto no-underline hover:text-text-2 transition-colors">
          Receber digest →
        </a>
      </div>

      {/* Main header row */}
      <div className="max-page px-page flex items-center gap-6 h-[3.25rem] sm:h-[3.75rem]">
        {/* Logo */}
        <a
          href="/"
          className="no-underline shrink-0 flex items-baseline gap-[1px]"
          aria-label={config.name}
        >
          <span className="font-display text-text text-[1.1875rem] tracking-[-0.02em]">
            {config.name.slice(0, Math.ceil(config.name.length * 0.55))}
          </span>
          <span className="font-display text-accent text-[1.1875rem] tracking-[-0.02em]">
            {config.name.slice(Math.ceil(config.name.length * 0.55))}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 ml-8" aria-label="Navegação principal">
          {NAV_LINKS.slice(0, -1).map((link) => (
            <a key={link.href} href={link.href} className="nav-link text-[0.8125rem]">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search */}
          <button
            type="button"
            aria-label="Buscar"
            className="hidden sm:flex items-center text-text-m hover:text-text transition-colors duration-150 cursor-pointer bg-transparent border-0 p-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M11.5 11.5L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Subscribe CTA — desktop only */}
          <a
            href="/newsletter"
            className="btn btn-primary hidden lg:inline-flex text-[0.75rem] px-4 py-[0.4375rem]"
          >
            Assinar grátis
          </a>

          {/* Mobile hamburger */}
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
