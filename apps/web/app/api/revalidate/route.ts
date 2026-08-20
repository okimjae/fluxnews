import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  if (secret !== process.env.NEXTJS_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const path = typeof body?.path === 'string' ? body.path : null;

  if (path) {
    revalidatePath(path, 'page');
    return NextResponse.json({ revalidated: true, path });
  }

  revalidatePath('/', 'page');
  revalidatePath('/artigo/[slug]', 'page');
  revalidatePath('/categoria/[slug]', 'page');
  return NextResponse.json({ revalidated: true, scope: 'all' });
}
