import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { getTenantConfig } from '@/tenants';

export const revalidate = 86400;

export default async function ContatoPage() {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  return (
    <div className="max-page px-page py-16">
      <div className="max-w-[640px]">
        <span className="badge mb-6 inline-flex">Contato</span>

        <h1 className="font-display text-[clamp(1.875rem,5vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-text mb-4 text-balance">
          Fale com a gente
        </h1>

        <p className="text-body-lg text-text-2 mb-12">
          Para sugestões de pauta, correções, parcerias editoriais ou dúvidas sobre {config.niche}.
        </p>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-text-m mb-2">
              Redação
            </h2>
            <p className="text-[0.9375rem] text-text-2">
              {config.author.name} —{' '}
              <a
                href={`mailto:redacao@${config.domain}`}
                className="text-accent no-underline hover:opacity-70 transition-opacity"
              >
                redacao@{config.domain}
              </a>
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-text-m mb-2">
              Publicidade
            </h2>
            <p className="text-[0.9375rem] text-text-2">
              Para anunciar no {config.name}:{' '}
              <a
                href={`mailto:ads@${config.domain}`}
                className="text-accent no-underline hover:opacity-70 transition-opacity"
              >
                ads@{config.domain}
              </a>
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-text-m mb-2">
              Newsletter
            </h2>
            <p className="text-[0.8125rem] text-text-2 mb-4">
              Para questões sobre o digest semanal ou cancelamento de inscrição.
            </p>
            <a href="/newsletter" className="btn btn-primary">
              Gerenciar inscrição
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
