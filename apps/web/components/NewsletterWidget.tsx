'use client';

import { useState } from 'react';

interface NewsletterWidgetProps {
  tenantName: string;
  compact?: boolean;
}

export function NewsletterWidget({ tenantName, compact = false }: NewsletterWidgetProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        className={`${compact ? 'p-4' : 'p-6'} rounded-card text-center border`}
        style={{
          background: 'color-mix(in srgb, var(--color-accent) 10%, var(--color-surface))',
          borderColor: 'color-mix(in srgb, var(--color-accent) 30%, var(--color-border))',
        }}
      >
        <p className="text-[0.9375rem] text-text font-semibold">Inscrição confirmada!</p>
        <p className="text-[0.8125rem] text-text-2 mt-1">
          Você receberá o digest semanal do {tenantName}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${compact ? 'p-4' : 'p-6'} bg-surface border border-border rounded-card`}
    >
      {!compact && (
        <p className="text-[0.9375rem] font-semibold text-text mb-1.5">Newsletter {tenantName}</p>
      )}
      <p className={`text-[0.8125rem] text-text-2 leading-[1.5] ${compact ? 'mb-3.5' : 'mb-3.5'}`}>
        {compact
          ? 'Receba o digest semanal no seu email.'
          : 'Os 5 melhores artigos da semana, toda segunda-feira. Sem spam.'}
      </p>

      <div className="flex gap-2 flex-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className="flex-1 min-w-[180px] text-sm border border-border rounded-sm bg-bg text-text"
          style={{ padding: '0.5rem 0.75rem', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-primary whitespace-nowrap"
        >
          {status === 'loading' ? 'Enviando…' : 'Inscrever'}
        </button>
      </div>

      {status === 'error' && (
        <p className="text-xs text-error mt-2">Erro ao inscrever. Tente novamente.</p>
      )}
    </form>
  );
}
