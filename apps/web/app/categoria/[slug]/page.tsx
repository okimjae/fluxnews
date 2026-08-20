import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { ArticleCard } from '@/components/ArticleCard';
import { getTenantConfig } from '@/tenants';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

function slugToLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Mock article factory — replaced by DB query in Phase 1
function getMockArticles(category: string, tenant: TenantSlug) {
  const config = getTenantConfig(tenant);
  const label = slugToLabel(category);

  return Array.from({ length: 8 }, (_, i) => ({
    title: `${label}: Artigo ${i + 1} — Análise e perspectivas para ${config.niche}`,
    excerpt: `Conteúdo editorial gerado por IA com curadoria de ${config.author.name}. Esta é uma prévia do tipo de artigo que será publicado nesta categoria.`,
    category: label,
    author: config.author.name,
    publishedAt: new Date(2026, 7, 18 - i),
    slug: `${category}-artigo-${i + 1}`,
  }));
}

export async function generateStaticParams() {
  return [
    { slug: 'mercado' },
    { slug: 'analise' },
    { slug: 'editorial' },
    { slug: 'pesquisa' },
    { slug: 'review' },
    { slug: 'tendencias' },
  ];
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);
  const label = slugToLabel(slug);
  const articles = getMockArticles(slug, tenant);

  return (
    <div className="max-page px-page py-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex gap-2 text-[0.8125rem] text-text-m mb-10 items-center"
      >
        <a href="/" className="text-text-m no-underline hover:text-text-2 transition-colors">
          Início
        </a>
        <span aria-hidden>›</span>
        <span className="text-text-2">{label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border flex items-end justify-between gap-6 flex-wrap">
        <div>
          <span className="badge mb-4">{config.niche}</span>
          <h1 className="font-display text-title text-text text-balance">{label}</h1>
        </div>
        <p className="font-mono text-[0.75rem] text-text-m">{articles.length} artigos</p>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <ArticleCard key={article.slug} post={article} variant="card" />
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-14 flex justify-center gap-2">
        <button type="button" disabled className="btn btn-secondary opacity-40 cursor-not-allowed">
          ← Anterior
        </button>
        <button type="button" disabled className="btn btn-secondary opacity-40 cursor-not-allowed">
          Próxima →
        </button>
      </div>
    </div>
  );
}
