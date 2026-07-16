import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
  try {
    const certs = await prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(certs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cert = await prisma.certificate.create({
      data: {
        title: body.title,
        issuer: body.issuer,
        date: body.date,
        link: body.link || null,
      },
    });
    return NextResponse.json(cert, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}
