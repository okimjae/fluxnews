interface Post {
  title: string;
  category: string;
  slug?: string;
}

interface SidebarMostReadProps {
  posts: Post[];
  label?: string;
  tenant?: string;
}

export function SidebarMostRead({ posts, label = 'Mais Lidos', tenant }: SidebarMostReadProps) {
  const tenantQuery = tenant ? `?tenant=${tenant}` : '';
  return (
    <aside>
      <div className="section-label">
        <div className="flex items-center gap-3">
          <div className="w-[2px] h-[1.1rem] bg-accent rounded-full" />
          <h2 className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-2">
            {label}
          </h2>
        </div>
      </div>

      <ol className="list-none p-0 m-0">
        {posts.slice(0, 5).map((post, i) => (
          <li key={post.slug ?? post.title} className="most-read-item">
            <span className="font-mono text-[1.375rem] font-bold text-border-2 leading-none shrink-0 w-8 text-right select-none">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <a
                href={post.slug ? `/artigo/${post.slug}${tenantQuery}` : '#'}
                className="block text-[0.875rem] font-medium text-text-2 no-underline hover:text-text line-clamp-2 transition-colors leading-[1.4] mb-1"
              >
                {post.title}
              </a>
              <span className="font-mono text-[0.625rem] text-text-m uppercase tracking-[0.08em]">
                {post.category}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
