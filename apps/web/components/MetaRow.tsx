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
  const textColor = light ? 'rgba(255,255,255,0.65)' : 'var(--color-text-m)';
  const dotColor = light ? 'rgba(255,255,255,0.3)' : 'var(--color-border)';
  const authorColor = light ? 'rgba(255,255,255,0.85)' : 'var(--color-text-2)';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div
        className="w-[22px] h-[22px] rounded-full shrink-0"
        style={{
          background:
            'linear-gradient(135deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 50%, #000))',
          transition: 'background 250ms',
        }}
      />
      <span className="text-[0.8125rem] font-medium" style={{ color: authorColor }}>
        {author}
      </span>
      <span className="text-xs" style={{ color: dotColor }}>
        ·
      </span>
      <span className="font-mono text-xs" style={{ color: textColor }}>
        {date}
      </span>
      <span className="text-xs" style={{ color: dotColor }}>
        ·
      </span>
      <span className="font-mono text-xs" style={{ color: textColor }}>
        {readTimeMinutes} min
      </span>
    </div>
  );
}
