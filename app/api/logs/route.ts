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
    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
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

    // Try to find the corresponding pipeline stage for the gym
    const targetName = outcome.replace('_', ' ').toLowerCase();
    let stage: any = null;
    try {
      stage = await prisma.pipelineStage.findFirst({
        where: {
          gymId,
          name: {
            contains: targetName,
            mode: 'insensitive' as any,
          },
        },
      });
    } catch (e) {
      // Some providers (sqlite) don't support `mode: 'insensitive'`. Fall back to fetching
      // the stages for the gym and match case-insensitively in JS.
      if (String((e as any)?.message || '').includes('Unknown argument `mode`')) {
        const stages = await prisma.pipelineStage.findMany({
          where: { gymId },
          select: { id: true, name: true },
        });
        stage = stages.find((s) => (s.name || '').toLowerCase().includes(targetName)) || null;
      } else {
        throw e;
      }
    }

    const [log] = await prisma.$transaction([
      prisma.outreachLog.create({
        data: {
          memberId,
          trainerId,
          stageId: stage?.id || null,
          notes: notes || null,
        },
      }),
      prisma.member.update({
        where: { id: memberId },
        data: {
          status: outcome,
          stageId: stage?.id || member.stageId,
          updatedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json(log);
  } catch (error: any) {
    console.error('[OUTREACH_LOG_ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'Something went wrong' },
      { status: 500 },
    );
  }
}
