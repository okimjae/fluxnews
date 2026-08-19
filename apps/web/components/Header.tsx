import type { TenantSlug } from '@fluxnews/config';
import { getTenantConfig } from '@/tenants';

interface HeaderProps {
  tenant: TenantSlug;
}

export function Header({ tenant }: HeaderProps) {
  const config = getTenantConfig(tenant);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '2px solid var(--color-accent)',
        background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'border-color 250ms ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          marginInline: 'auto',
          paddingInline: 'clamp(1rem, 5vw, 2rem)',
          paddingBlock: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            color: 'var(--color-text)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {config.name.slice(0, -config.niche.split(' ')[0].length) || config.name}
          <span style={{ color: 'var(--color-accent)', transition: 'color 250ms' }}>
            {config.name.includes(' ')
              ? config.name.split(' ').slice(-1)[0]
              : config.name.slice(-Math.ceil(config.name.length / 2))}
          </span>
        </a>

        <nav
          style={{
            display: 'flex',
            gap: '1.5rem',
            marginLeft: 'auto',
          }}
        >
          <a
            href="/"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-2)',
              textDecoration: 'none',
            }}
          >
            Início
          </a>
          <a
            href="/radio"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-2)',
              textDecoration: 'none',
            }}
          >
            Rádio
          </a>
          <a
            href="/shorts"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-2)',
              textDecoration: 'none',
            }}
          >
            Shorts
          </a>
          <a
            href="/newsletter"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-accent)',
              textDecoration: 'none',
              transition: 'color 250ms',
            }}
          >
            Newsletter
          </a>
        </nav>
      </div>
    </header>
  );
}
