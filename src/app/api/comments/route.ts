import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(
      comments.map((c) => ({
        name: c.name,
        message: c.message,
        date: c.createdAt.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      }))
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const comment = await prisma.comment.create({
      data: {
        name: body.name,
        email: body.email || 'anonymous@visitor.com',
        message: body.message,
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
