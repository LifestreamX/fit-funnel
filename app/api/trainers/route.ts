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
        assignedMembers: {
          select: { id: true },
        },
      },
    });

    const trainersWithStats = trainers.map((trainer) => {
      const members = trainer.assignedMembers;
      return {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        isPending: !!trainer.inviteToken,
        createdAt: trainer.createdAt,
        stats: {
          assigned: members.length,
          // contacted/booked counts require more info, not available here
        },
      };
    });

    return NextResponse.json(trainersWithStats);
}
