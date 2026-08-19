import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { AudioPlayer } from '@/components/AudioPlayer';
import { getTenantConfig } from '@/tenants';

export const revalidate = 3600;

// Mock episodes until the pipeline generates real audio (Phase 3)
function getMockEpisodes(tenant: TenantSlug) {
  const config = getTenantConfig(tenant);
  const topics = [
    `Retrospectiva da semana em ${config.niche}`,
    `Análise aprofundada: tendências de agosto`,
    `Entrevista com especialista: o que vem por aí`,
    `Os 3 fatos que moldaram o mercado esta semana`,
    `Perguntas da audiência: especial ${config.niche}`,
  ];
  return topics.map((title, i) => ({
    id: `ep-${i + 1}`,
    title,
    duration: `${28 + i * 7}:${(i * 13) % 60 < 10 ? '0' : ''}${(i * 13) % 60}`,
    publishedAt: new Date(2026, 7, 18 - i * 7).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    // Placeholder audio — replaced by real CDN URLs in Phase 3
    audioUrl: '',
  }));
}

export default async function RadioPage() {
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);
  const episodes = getMockEpisodes(tenant);

  return (
    <div className="max-page px-page py-10">
      <div className="max-w-[800px]">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <span className="badge mb-4">Rádio</span>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-title text-text mb-2">{config.name} Radio</h1>
              <p className="text-[0.9375rem] text-text-2 leading-[1.5]">
                Episódios semanais sobre {config.niche} — por {config.author.name}
              </p>
            </div>

            {/* RSS link */}
            <a
              href="/radio/feed.xml"
              className="btn-rss inline-flex items-center gap-1.5 px-[0.875rem] py-2 text-[0.8125rem] font-medium text-accent rounded-sm no-underline shrink-0"
            >
              <span className="text-sm">◉</span> RSS
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-6" />

        {/* Episode count */}
        <p className="text-[0.8125rem] text-text-m font-mono mb-5 tracking-[0.02em]">
          {episodes.length} episódios disponíveis
        </p>

        {/* Player */}
        <AudioPlayer episodes={episodes} />

        {/* Footer note */}
        <p className="mt-10 text-xs text-text-m leading-[1.5] text-center">
          Episódios gerados por IA com narração de {config.author.name} ·{' '}
          <a
            href="/newsletter"
            className="text-accent no-underline hover:opacity-70 transition-opacity"
          >
            Assinar newsletter
          </a>
        </p>
      </div>
    </div>
  );
}
