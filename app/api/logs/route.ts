import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { memberId, outcome, notes } = await req.json();

    if (!memberId || !outcome) {
      return NextResponse.json(
        { error: 'Member ID and outcome are required' },
        { status: 400 },
      );
    }

    const gymId = (session.user as any).gymId;
    const trainerId = (session.user as any).id;

    const member = await prisma.member.findFirst({
      where: { id: memberId, gymId },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const [log] = await prisma.$transaction([
      prisma.outreachLog.create({
        data: {
          memberId,
          trainerId,
          outcome,
          notes: notes || null,
        },
      }),
      prisma.member.update({
        where: { id: memberId },
        data: { status: outcome },
      }),
    ]);

    return NextResponse.json(log);
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
