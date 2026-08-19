interface MetaRowProps {
  author: string;
  publishedAt: Date;
  readTimeMinutes?: number;
  light?: boolean;
}

export function MetaRow({ author, publishedAt, readTimeMinutes = 4, light = false }: MetaRowProps) {
  const date = publishedAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const textCls = light ? 'text-white/60' : 'text-text-m';
  const authorCls = light ? 'text-white/80' : 'text-text-2';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div
        className="w-5 h-5 rounded-full shrink-0"
        style={{
          background:
            'linear-gradient(135deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 50%, #000))',
        }}
      />
      <span className={`text-[0.8125rem] font-medium ${authorCls}`}>{author}</span>
      <span className={`text-[0.65rem] ${textCls}`}>·</span>
      <span className={`font-mono text-[0.75rem] ${textCls}`}>{date}</span>
      <span className={`text-[0.65rem] ${textCls}`}>·</span>
      <span className={`font-mono text-[0.75rem] ${textCls}`}>{readTimeMinutes} min</span>
    </div>
  );
}
