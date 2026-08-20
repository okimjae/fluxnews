import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { getTenantConfig } from '@/tenants';

export const revalidate = 86400;

export default async function SobrePage() {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  return (
    <div className="max-page px-page py-16">
      <div className="max-w-[740px]">
        <span className="badge mb-6 inline-flex">Sobre</span>

        <h1 className="font-display text-[clamp(1.875rem,5vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-text mb-6 text-balance">
          {config.name} — jornalismo independente sobre {config.niche}
        </h1>

        <div className="prose">
          <p>
            O <strong>{config.name}</strong> é um portal editorial focado em{' '}
            <strong>{config.niche}</strong>, com curadoria independente e análises aprofundadas
            assinadas por {config.author.name}.
          </p>

          <h2>Como funciona</h2>
          <p>
            Nossa equipe monitora as fontes mais relevantes de {config.niche} ao redor do mundo.
            Cada artigo passa por verificação editorial rigorosa antes de ser publicado.
          </p>

          <h2>Nossa promessa editorial</h2>
          <p>
            Nenhum clickbait. Nenhuma especulação sem embasamento. Todo conteúdo é apurado e
            revisado com critério jornalístico. O rigor editorial é inegociável.
          </p>

          <h2>A equipe</h2>
          <p>
            <strong>{config.author.name}</strong> — {config.author.title}
          </p>
          <p>{config.author.bio}</p>
        </div>
      </div>
    </div>
  );
}
