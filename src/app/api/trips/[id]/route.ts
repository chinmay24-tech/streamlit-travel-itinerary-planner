import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { trips } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Please sign in.' }, { status: 401 });
    }

    const { id } = await context.params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return NextResponse.json({ success: false, error: 'Invalid trip ID' }, { status: 400 });
    }

    await db.delete(trips).where(and(eq(trips.id, numId), eq(trips.userId, user.id)));
    return NextResponse.json({ success: true, deletedId: numId });
  } catch (error: any) {
    console.error('Delete trip error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
