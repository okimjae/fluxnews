interface MetaRowProps {
  author: string;
  publishedAt: Date;
  readTimeMinutes?: number;
  light?: boolean;
}

export function MetaRow({ author, publishedAt, readTimeMinutes = 4, light = false }: MetaRowProps) {
  const date = publishedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const textColor = light ? 'rgba(255,255,255,0.65)' : 'var(--color-text-m)';
  const dotColor = light ? 'rgba(255,255,255,0.3)' : 'var(--color-border)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          flexShrink: 0,
          background: 'linear-gradient(135deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 50%, #000))',
          transition: 'background 250ms',
        }}
      />
      <span style={{ fontSize: '0.8125rem', color: light ? 'rgba(255,255,255,0.85)' : 'var(--color-text-2)', fontWeight: 500 }}>
        {author}
      </span>
      <span style={{ color: dotColor, fontSize: '0.75rem' }}>·</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: textColor }}>{date}</span>
      <span style={{ color: dotColor, fontSize: '0.75rem' }}>·</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: textColor }}>{readTimeMinutes} min</span>
    </div>
  );
}
