import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { NewsletterWidget } from '@/components/NewsletterWidget';
import { getTenantConfig } from '@/tenants';

export const revalidate = 86400;

const PERKS = [
  {
    icon: '📰',
    title: 'Os 5 melhores artigos',
    description: 'Curadoria editorial semanal, sem clickbait.',
  },
  {
    icon: '⚡',
    title: 'Resumo em 2 minutos',
    description: 'Tudo que importou na semana, condensado.',
  },
  {
    icon: '🔍',
    title: 'Análise exclusiva',
    description: 'Um deep-dive que não vai ao site.',
  },
  {
    icon: '🚫',
    title: 'Zero spam',
    description: 'Um email por semana. Só.',
  },
];

export default async function NewsletterPage() {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  return (
    <div className="max-w-[640px] mx-auto px-page py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <span className="badge mb-4">Newsletter</span>

        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.15] text-text mb-4 text-balance">
          O digest semanal do <span className="text-accent">{config.name}</span>
        </h1>

        <p className="text-[1.0625rem] leading-[1.65] text-text-2 max-w-[480px] mx-auto">
          Toda segunda-feira, um email com os melhores conteúdos da semana sobre {config.niche}.
          Curado por IA, revisado por {config.author.name}.
        </p>
      </div>

      {/* Subscribe form */}
      <NewsletterWidget tenantName={config.name} />

      {/* Divider */}
      <div className="h-px bg-border my-10" />

      {/* Perks */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 mb-12">
        {PERKS.map((perk) => (
          <div key={perk.title} className="p-5 bg-surface border border-border rounded-card">
            <div className="text-2xl mb-2">{perk.icon}</div>
            <p className="text-[0.9375rem] font-semibold text-text mb-1">{perk.title}</p>
            <p className="text-[0.8125rem] text-text-2 leading-[1.5]">{perk.description}</p>
          </div>
        ))}
      </div>

      {/* Social proof placeholder */}
      <p className="text-center text-[0.8125rem] text-text-m leading-[1.5]">
        Junte-se a leitores que acompanham {config.niche} com inteligência.
        <br />
        Cancelamento com 1 clique. Sem compromisso.
      </p>
    </div>
  );
}
