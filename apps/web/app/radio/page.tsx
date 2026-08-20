import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { AdSlot } from '@/components/AdSlot';
import { AudioPlayer } from '@/components/AudioPlayer';
import { getTenantConfig } from '@/tenants';

export const revalidate = 3600;

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
      <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-start">
        {/* Main content */}
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

              <a
                href="/radio/feed.xml"
                className="btn-rss inline-flex items-center gap-1.5 px-[0.875rem] py-2 text-[0.8125rem] font-medium text-accent rounded-sm no-underline shrink-0"
              >
                <span className="text-sm">◉</span> RSS
              </a>
            </div>
          </div>

          <div className="divider mb-6" />

          <p className="text-[0.8125rem] text-text-m font-mono mb-5 tracking-[0.02em]">
            {episodes.length} episódios disponíveis
          </p>

          <AudioPlayer episodes={episodes} />

          {/* Mid-content leaderboard */}
          <div className="flex justify-center my-8">
            <AdSlot size="leaderboard" />
          </div>

          {/* Bottom leaderboard */}
          <div className="flex justify-center mt-2">
            <AdSlot size="leaderboard" />
          </div>

          <p className="mt-8 text-xs text-text-m leading-[1.5] text-center">
            Produzido pela equipe {config.name} ·{' '}
            <a
              href="/newsletter"
              className="text-accent no-underline hover:opacity-70 transition-opacity"
            >
              Assinar newsletter
            </a>
          </p>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-[var(--header-h)]">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
              <h2 className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
                Sobre o Podcast
              </h2>
            </div>
            <p className="text-[0.8125rem] text-text-2 leading-[1.6] mb-4">
              Cobertura editorial semanal sobre {config.niche} — análises, entrevistas e resumos dos
              fatos que importam.
            </p>
            <a href="/newsletter" className="btn btn-primary w-full text-center">
              Receber por email
            </a>
          </div>

          <div className="hidden lg:block">
            <AdSlot size="rectangle" />
          </div>
        </aside>
      </div>
    </div>
  );
}
