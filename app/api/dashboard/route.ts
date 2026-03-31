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

  const members = await prisma.member.findMany({ where: { gymId }, select: { stageId: true } });

  // You may want to map stageId to human-readable status here, or count by stageId
  const total = members.length;
  // Example: group by stageId (status)
  const stageCounts: Record<string, number> = {};
  for (const m of members) {
    const sid = m.stageId;
    if (sid) {
      stageCounts[sid] = (stageCounts[sid] || 0) + 1;
    }
  }

  return NextResponse.json({
    total,
    stageCounts,
  });
}
