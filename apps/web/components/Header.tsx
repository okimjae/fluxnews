import type { TenantSlug } from '@fluxnews/config';
import { getTenantConfig } from '@/tenants';

interface HeaderProps {
  tenant: TenantSlug;
}

export function Header({ tenant }: HeaderProps) {
  const config = getTenantConfig(tenant);

  return (
    <header className="glass border-b border-border sticky top-0 z-50">
      <div className="accent-bar w-full" />

      <div className="max-page px-page flex items-center gap-6 py-[0.875rem]">
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

        {/* Nav */}
        <nav className="flex items-center gap-6 ml-auto">
          <a href="/" className="nav-link hidden sm:block">
            Início
          </a>
          <a href="/radio" className="nav-link hidden sm:block">
            Rádio
          </a>
          <a href="/newsletter" className="nav-link nav-link-accent hidden sm:block">
            Newsletter
          </a>

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
        </nav>
      </div>
    </header>
  );
}
