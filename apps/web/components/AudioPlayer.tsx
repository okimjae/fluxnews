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
        <div className="card sticky top-16 z-10 p-4 mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-accent text-on-accent border-0 cursor-pointer flex items-center justify-center shrink-0 text-base transition-opacity duration-200"
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
            className={`ep-btn ${current?.id === ep.id ? 'ep-btn-active' : ''} flex items-center gap-4 p-4 cursor-pointer text-left w-full`}
          >
            <div className="ep-icon w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm text-accent">
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
