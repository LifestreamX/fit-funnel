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
    const stage = await prisma.pipeline_stage.findFirst({
      where: {
        gym_id: gymId,
        name: {
          contains: outcome.replace('_', ' ').toLowerCase(),
          mode: 'insensitive',
        },
      },
    });

    const [log] = await prisma.$transaction([
      prisma.outreach_log.create({
        data: {
          member_id: memberId,
          trainer_id: trainerId,
          stage_id: stage?.id || null,
          notes: notes || null,
        },
      }),
      prisma.member.update({
        where: { id: memberId },
        data: {
          status: outcome,
          stage_id: stage?.id || member.stage_id,
          updated_at: new Date(),
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
