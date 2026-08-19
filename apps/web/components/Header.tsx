import type { TenantSlug } from '@fluxnews/config';
import { getTenantConfig } from '@/tenants';

interface HeaderProps {
  tenant: TenantSlug;
}

export function Header({ tenant }: HeaderProps) {
  const config = getTenantConfig(tenant);

  return (
    <header
      className="sticky top-0 z-50 border-b-2 border-accent"
      style={{
        background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'border-color 250ms ease',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-page py-[0.875rem] flex items-center gap-6">
        <a
          href="/"
          className="font-display text-xl text-text no-underline whitespace-nowrap shrink-0"
        >
          {config.name.slice(0, -config.niche.split(' ')[0].length) || config.name}
          <span className="text-accent" style={{ transition: 'color 250ms' }}>
            {config.name.includes(' ')
              ? config.name.split(' ').slice(-1)[0]
              : config.name.slice(-Math.ceil(config.name.length / 2))}
          </span>
        </a>

        <nav className="flex gap-6 ml-auto">
          <a href="/" className="text-sm font-semibold text-text-2 no-underline">
            Início
          </a>
          <a href="/radio" className="text-sm font-semibold text-text-2 no-underline">
            Rádio
          </a>
          <a href="/shorts" className="text-sm font-semibold text-text-2 no-underline">
            Shorts
          </a>
          <a
            href="/newsletter"
            className="text-sm font-semibold text-accent no-underline"
            style={{ transition: 'color 250ms' }}
          >
            Newsletter
          </a>
        </nav>
      </div>
    </header>
  );
}
