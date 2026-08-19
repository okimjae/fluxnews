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
    <div className="max-w-[1280px] mx-auto px-page py-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex gap-2 text-[0.8125rem] text-text-m mb-8 items-center"
      >
        <a href="/" className="text-text-m no-underline">
          Início
        </a>
        <span aria-hidden>›</span>
        <span className="text-text-2">{label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <span className="badge mb-3">Categoria</span>
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.2] text-text mb-2">
          {label}
        </h1>
        <p className="text-[0.9375rem] text-text-2">
          {articles.length} artigos · {config.name}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-8" />

      {/* Article grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} post={article} variant="card" />
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-12 flex justify-center gap-2">
        <button
          type="button"
          disabled
          className="px-4 py-2 text-sm border border-border rounded-sm bg-surface text-text-m cursor-not-allowed opacity-50"
        >
          ← Anterior
        </button>
        <button
          type="button"
          disabled
          className="px-4 py-2 text-sm border border-border rounded-sm bg-surface text-text-m cursor-not-allowed opacity-50"
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
