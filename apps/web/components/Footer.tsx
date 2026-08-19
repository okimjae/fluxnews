import type { TenantSlug } from '@fluxnews/config';
import { getTenantConfig } from '@/tenants';

interface FooterProps {
  tenant: TenantSlug;
}

export function Footer({ tenant }: FooterProps) {
  const config = getTenantConfig(tenant);

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        marginTop: '4rem',
        paddingBlock: '2.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          marginInline: 'auto',
          paddingInline: 'clamp(1rem, 5vw, 2rem)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '0.25rem',
            }}
          >
            {config.name}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-m)' }}>
            Notícias sobre {config.niche} com curadoria de IA · {config.domain}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <a
            href="/about"
            style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', textDecoration: 'none' }}
          >
            Sobre
          </a>
          <a
            href="/editorial-policy"
            style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', textDecoration: 'none' }}
          >
            Política Editorial
          </a>
          <a
            href="/contact"
            style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', textDecoration: 'none' }}
          >
            Contato
          </a>
          <a
            href={`/podcast/${tenant}/feed.xml`}
            style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', textDecoration: 'none' }}
          >
            Podcast RSS
          </a>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-m)',
            width: '100%',
            marginTop: '0.5rem',
          }}
        >
          © {new Date().getFullYear()} {config.name} · Conteúdo gerado com assistência de IA e
          curadoria editorial
        </p>
      </div>
    </footer>
  );
}
