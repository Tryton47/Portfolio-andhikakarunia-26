import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
  try {
    const items = await prisma.techStack.findMany({ orderBy: { category: 'asc' } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tech stack' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await prisma.techStack.create({
      data: {
        name: body.name,
        category: body.category,
        icon: body.icon || '',
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create tech stack item' }, { status: 500 });
  }
}
