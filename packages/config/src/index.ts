export type TenantSlug =
  | 'cripto'
  | 'saude'
  | 'tech'
  | 'financas'
  | 'games'
  | 'esportes'
  | 'streaming'
  | 'mobilidade';

export type Lang = 'pt' | 'en';

export interface TenantConfig {
  slug: TenantSlug;
  name: string;
  domain: string;
  accent: string;
  onAccent: string;
  niche: string;
  voice: string;
  primaryLang: Lang;
  affiliates: string[];
  rssSources: string[];
  newsApiKeywords: string[];
  author: {
    name: string;
    title: string;
    bio: string;
  };
}

export const TENANT_SLUGS: TenantSlug[] = [
  'cripto',
  'saude',
  'tech',
  'financas',
  'games',
  'esportes',
  'streaming',
  'mobilidade',
];

export const LOCALE_HEADER = 'x-tenant' as const;
export const LANG_HEADER = 'x-lang' as const;
