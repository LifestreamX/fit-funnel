import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'MANAGER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gymId = (session.user as any).gymId;

  const members = await prisma.member.findMany({
    where: { gymId },
    select: { status: true },
  });

  const total = members.length;
  const contacted = members.filter((m) => m.status === 'CONTACTED').length;
  const noAnswer = members.filter((m) => m.status === 'NO_ANSWER').length;
  const notInterested = members.filter(
    (m) => m.status === 'NOT_INTERESTED',
  ).length;
  const booked = members.filter(
    (m) => m.status === 'ORIENTATION_BOOKED',
  ).length;
  const converted = members.filter((m) => m.status === 'CONVERTED').length;
  const notContacted = members.filter(
    (m) => m.status === 'NOT_CONTACTED',
  ).length;

  return NextResponse.json({
    total,
    contacted,
    noAnswer,
    notInterested,
    booked,
    converted,
    notContacted,
  });
}
