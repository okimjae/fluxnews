import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return drizzle(postgres(url), { schema });
}

let _db: ReturnType<typeof createDb> | undefined;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

// Convenience: direct export for modules that always have DATABASE_URL at runtime
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof createDb>];
  },
});
