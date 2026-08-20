/**
 * AI Content Generator
 *
 * Picks draft posts from the DB, rewrites them into full editorial articles
 * using Groq (fast, Llama 3) for the main rewrite and Google Gemini as fallback.
 * Publishes posts after generation.
 *
 * Required env: DATABASE_URL, GROQ_API_KEY (+ GEMINI_API_KEY for fallback)
 * Run: pnpm --filter @fluxnews/agents generate
 *      pnpm --filter @fluxnews/agents generate -- --tenant=cripto --limit=5
 */

import { db, posts } from '@fluxnews/db';
import { eq, and, isNull, sql } from 'drizzle-orm';

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const TENANT_PERSONAS: Record<string, string> = {
  cripto:
    'Analista de criptomoedas com foco em dados on-chain e fundamentos de DeFi. Tom técnico mas acessível.',
  saude:
    'Jornalista especializado em saúde e bem-estar. Baseado em evidências científicas, tom acolhedor.',
  tech:
    'Engenheiro de software e escritor de tecnologia. Direto, técnico, sem hype.',
  financas:
    'Analista financeiro. Foco em fundamentos, análise macro e educação financeira.',
  games:
    'Gamer e crítico de jogos. Apaixonado, opinativo, conhece a indústria por dentro.',
  esportes:
    'Jornalista esportivo. Análise tática, números e narrativa humana.',
  streaming:
    'Crítico de entretenimento e streaming. Cultura pop com profundidade editorial.',
  mobilidade:
    'Especialista em mobilidade urbana, carros elétricos e futuro do transporte.',
};

// ─── GROQ API ─────────────────────────────────────────────────────────────────

async function callGroq(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not set');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1800,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq error ${res.status}: ${body}`);
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0].message.content.trim();
}

// ─── GEMINI API (fallback) ────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1800 },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini error ${res.status}: ${body}`);
  }

  const data = await res.json() as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
  };
  return data.candidates[0].content.parts[0].text.trim();
}

async function generate(prompt: string): Promise<string> {
  try {
    return await callGroq(prompt);
  } catch (err) {
    console.warn(`  Groq failed, falling back to Gemini: ${(err as Error).message}`);
    return callGemini(prompt);
  }
}

// ─── PROMPT ───────────────────────────────────────────────────────────────────

function buildPrompt(post: typeof posts.$inferSelect, tenant: string): string {
  const persona = TENANT_PERSONAS[tenant] ?? 'Jornalista editorial independente.';
  return `Você é: ${persona}

Reescreva o artigo abaixo em português brasileiro para o nosso blog editorial.
Regras:
- Título: mantenha ou melhore (sem clickbait)
- 3–5 parágrafos, cada um com 80–120 palavras
- Linguagem fluida, sem usar termos de IA como "mergulho profundo" ou "inteligência artificial"
- Adicione contexto analítico próprio
- Finalize com uma frase de perspectiva editorial
- Formato: retorne SOMENTE o artigo em texto corrido, sem marcações extras

TÍTULO ORIGINAL: ${post.title}
CONTEÚDO ORIGINAL:
${post.content.slice(0, 2000)}

ARTIGO REESCRITO:`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

interface Args {
  tenant?: string;
  limit: number;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const tenantArg = args.find((a) => a.startsWith('--tenant='));
  const limitArg = args.find((a) => a.startsWith('--limit='));
  return {
    tenant: tenantArg ? tenantArg.split('=')[1] : undefined,
    limit: limitArg ? Number.parseInt(limitArg.split('=')[1] ?? '10', 10) : 10,
  };
}

async function main() {
  const { tenant, limit } = parseArgs();
  console.log(`🤖 Content Generator starting (tenant=${tenant ?? 'all'}, limit=${limit})`);

  const conditions = [eq(posts.status, 'draft'), isNull(posts.publishedAt)];
  if (tenant) conditions.push(eq(posts.tenant, tenant));

  const drafts = await db
    .select()
    .from(posts)
    .where(and(...conditions))
    .limit(limit)
    .orderBy(sql`created_at ASC`);

  if (drafts.length === 0) {
    console.log('No draft posts found.');
    return;
  }

  console.log(`Found ${drafts.length} drafts to process.`);
  let processed = 0;
  let failed = 0;

  for (const draft of drafts) {
    console.log(`\n[${draft.tenant}] "${draft.title.slice(0, 60)}…"`);

    try {
      const prompt = buildPrompt(draft, draft.tenant);
      const generatedContent = await generate(prompt);

      await db
        .update(posts)
        .set({
          content: generatedContent,
          status: 'published',
          publishedAt: new Date(),
        })
        .where(eq(posts.id, draft.id));

      console.log(`  ✓ Published (${generatedContent.length} chars)`);
      processed++;
    } catch (err) {
      console.error(`  ✗ Failed: ${(err as Error).message}`);
      failed++;
    }

    // Rate limiting: 500ms between calls
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n✅ Done. ${processed} published, ${failed} failed.`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
