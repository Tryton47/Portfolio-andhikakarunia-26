import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        tech: body.tech,
        link: body.link || null,
        github: body.github || null,
        category: body.category,
        imageUrl: body.imageUrl || null,
      },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
