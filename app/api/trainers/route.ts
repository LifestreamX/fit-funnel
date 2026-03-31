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

  const trainers = await prisma.user.findMany({
    where: { gymId, role: 'TRAINER' },
    select: {
      id: true,
      name: true,
      email: true,
      inviteToken: true,
      inviteExpires: true,
      createdAt: true,
      members: {
        select: { status: true },
      },
    },
  });

  const trainersWithStats = trainers.map((trainer) => {
    const members = trainer.members;
    return {
      id: trainer.id,
      name: trainer.name,
      email: trainer.email,
      isPending: !!trainer.inviteToken,
      createdAt: trainer.createdAt,
      stats: {
        assigned: members.length,
        contacted: members.filter((m) => m.status === 'CONTACTED').length,
        booked: members.filter((m) => m.status === 'ORIENTATION_BOOKED').length,
        converted: members.filter((m) => m.status === 'CONVERTED').length,
      },
    };
  });

  return NextResponse.json(trainersWithStats);
}
