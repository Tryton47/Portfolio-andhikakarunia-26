import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
