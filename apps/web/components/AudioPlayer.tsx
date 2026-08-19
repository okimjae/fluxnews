'use client';

import { useRef, useState } from 'react';

interface Episode {
  id: string;
  title: string;
  duration: string;
  publishedAt: string;
  audioUrl: string;
}

interface AudioPlayerProps {
  episodes: Episode[];
}

export function AudioPlayer({ episodes }: AudioPlayerProps) {
  const [current, setCurrent] = useState<Episode | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function play(ep: Episode) {
    setCurrent(ep);
    setPlaying(true);
    setTimeout(() => audioRef.current?.play().catch(() => setPlaying(false)), 50);
  }

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }

  return (
    <div>
      {/* Sticky player */}
      {current && (
        <div className="sticky top-16 z-10 bg-surface border border-border rounded-card p-4 mb-6 flex items-center gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            onClick={toggle}
            className="w-[40px] h-[40px] rounded-full bg-accent border-0 cursor-pointer flex items-center justify-center shrink-0 text-on-accent text-base"
            style={{ transition: 'opacity 200ms' }}
            aria-label={playing ? 'Pausar' : 'Tocar'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">{current.title}</p>
            <p className="font-mono text-xs text-text-m">{current.duration}</p>
          </div>
          <audio ref={audioRef} src={current.audioUrl} onEnded={() => setPlaying(false)}>
            <track kind="captions" />
          </audio>
        </div>
      )}

      {/* Episode list */}
      <div className="flex flex-col gap-3">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            type="button"
            onClick={() => play(ep)}
            className="flex items-center gap-4 p-4 rounded-card cursor-pointer text-left w-full"
            style={{
              background:
                current?.id === ep.id
                  ? 'color-mix(in srgb, var(--color-accent) 8%, var(--color-surface))'
                  : 'var(--color-surface)',
              border: `1px solid ${
                current?.id === ep.id
                  ? 'color-mix(in srgb, var(--color-accent) 40%, var(--color-border))'
                  : 'var(--color-border)'
              }`,
              transition: 'border-color 200ms, background 200ms',
            }}
          >
            <div
              className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 text-sm text-accent"
              style={{
                background: 'color-mix(in srgb, var(--color-accent) 15%, var(--color-surface))',
              }}
            >
              {current?.id === ep.id && playing ? '⏸' : '▶'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.9375rem] font-semibold text-text truncate">{ep.title}</p>
              <p className="font-mono text-xs text-text-m mt-0.5">
                {ep.duration} · {ep.publishedAt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
