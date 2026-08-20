import type { TenantSlug } from '@fluxnews/config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminStats } from '@/lib/queries';
import { getTenantConfig } from '@/tenants';

export const dynamic = 'force-dynamic';

interface AdminPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const sp = await searchParams;
  const token = sp.token ?? '';
  const adminSecret = process.env.NEXTJS_REVALIDATE_SECRET ?? 'admin';

  if (token !== adminSecret) {
    redirect('/');
  }

  const hdrs = await headers();
  const tenant = (hdrs.get('x-tenant') ?? 'cripto') as TenantSlug;
  const config = getTenantConfig(tenant);
  const stats = await getAdminStats(tenant);

  return (
    <div className="max-page px-page py-10">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-border flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="badge mb-3">Admin</span>
          <h1 className="font-display text-title text-text">{config.name} — Dashboard</h1>
          <p className="text-[0.8125rem] text-text-m mt-1">
            Dados em tempo real · {new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
          </p>
        </div>
        <div className="font-mono text-[0.6875rem] text-text-m text-right">
          <p>{stats.posts.published + stats.posts.draft} posts no banco</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Artigos publicados', value: stats.posts.published },
          { label: 'Rascunhos', value: stats.posts.draft },
          { label: 'Assinantes ativos', value: stats.subscribers.confirmed.toLocaleString('pt-BR') },
          { label: 'Episódios de rádio', value: stats.episodes },
          { label: 'Shorts', value: stats.shorts },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="font-display text-[1.75rem] font-bold text-text tracking-tight">
              {s.value}
            </p>
            <p className="font-mono text-[0.6875rem] text-text-m uppercase tracking-[0.08em] mt-1 leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
            <h2 className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
              Newsletter
            </h2>
          </div>
          <dl className="space-y-2">
            {[
              [
                'Último envio',
                stats.lastNewsletter.sentAt
                  ? stats.lastNewsletter.sentAt.toLocaleDateString('pt-BR')
                  : '—',
              ],
              [
                'Destinatários',
                stats.lastNewsletter.recipients != null
                  ? stats.lastNewsletter.recipients.toLocaleString('pt-BR')
                  : '—',
              ],
              ['Total de assinantes', stats.subscribers.total.toLocaleString('pt-BR')],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between text-[0.8125rem]">
                <dt className="text-text-m">{k}</dt>
                <dd className="text-text font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Quick actions */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
            <h2 className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
              Ações
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Revalidar cache do site', href: `/api/revalidate?secret=${token}&path=/` },
              { label: 'Ver artigos publicados', href: '/categoria/todos' },
              { label: 'Gerenciar newsletter', href: '/newsletter' },
              { label: 'Rádio', href: '/radio' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] border border-border hover:border-accent hover:bg-surface transition-colors text-[0.8125rem] text-text-2 no-underline"
              >
                {action.label}
                <span className="text-text-m">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center font-mono text-[0.6875rem] text-text-m">
        Acesse via <code className="text-accent">/admin?token=NEXTJS_REVALIDATE_SECRET</code>
      </p>
    </div>
  );
}
