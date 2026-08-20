import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { AdSlot } from '@/components/AdSlot';
import { NewsletterWidget } from '@/components/NewsletterWidget';
import { getTenantConfig } from '@/tenants';

export const revalidate = 86400;

const PERKS = [
  {
    icon: '◈',
    title: 'Os 5 melhores artigos',
    description: 'Curadoria editorial semanal, sem clickbait.',
  },
  {
    icon: '◎',
    title: 'Resumo em 2 minutos',
    description: 'Tudo que importou na semana, condensado.',
  },
  {
    icon: '◉',
    title: 'Análise exclusiva',
    description: 'Um deep-dive que não vai ao site.',
  },
  {
    icon: '○',
    title: 'Zero spam',
    description: 'Um email por semana. Só.',
  },
] as const;

const STATS = [
  { value: '14.200+', label: 'leitores ativos' },
  { value: '4,9/5', label: 'avaliação média' },
  { value: '< 0,3%', label: 'taxa de descadastro' },
] as const;

export default async function NewsletterPage() {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);

  return (
    <div className="max-page px-page py-16">
      <div className="max-w-[640px] mx-auto">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-up">
          <span className="badge mb-6">Newsletter</span>

          <h1 className="font-display text-hero text-text mb-5 text-balance">
            O digest semanal do <span className="text-accent">{config.name}</span>
          </h1>

          <p className="text-body-lg text-text-2 max-w-[480px] mx-auto">
            Toda segunda-feira, um email com os melhores conteúdos da semana sobre {config.niche}.
            Curadoria editorial de {config.author.name}.
          </p>
        </div>

        {/* Social proof stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-[1.5rem] font-bold text-text tracking-[-0.02em]">
                {stat.value}
              </p>
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-text-m mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Subscribe form */}
        <NewsletterWidget tenantName={config.name} />

        {/* Ad below form */}
        <div className="flex justify-center mt-8">
          <AdSlot size="rectangle" />
        </div>

        {/* Divider */}
        <div className="divider my-10" />

        {/* Perks */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 mb-12">
          {PERKS.map((perk, i) => (
            <div
              key={perk.title}
              className={`card-text card p-5 animate-fade-up stagger-${Math.min(i + 1, 3) as 1 | 2 | 3}`}
            >
              <p className="font-mono text-accent text-lg mb-3">{perk.icon}</p>
              <p className="text-[0.9375rem] font-semibold text-text mb-1">{perk.title}</p>
              <p className="text-[0.8125rem] text-text-2 leading-[1.5]">{perk.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-[0.8125rem] text-text-m leading-[1.5]">
          Junte-se a <strong className="text-text-2">14.200 leitores</strong> que acompanham{' '}
          {config.niche} com inteligência.
          <br />
          Cancelamento com 1 clique. Sem compromisso.
        </p>
      </div>
    </div>
  );
}
