import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gymId = (session.user as any).gymId;
    if (!gymId) {
      return NextResponse.json(
        { error: 'No gym associated with user' },
        { status: 400 },
      );
    }

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

    // Add the manager (current user) to the trainers list for assignment
    const manager = {
      id: (session.user as any).id,
      name: (session.user as any).name || 'You (Manager)',
      email: (session.user as any).email,
      inviteToken: null,
      inviteExpires: null,
      createdAt: null,
      assignedMembers: [],
    };

    const trainersWithStats = [manager, ...trainers].map((trainer) => {
      const members = trainer.assignedMembers || [];
      return {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        isPending: !!trainer.inviteToken,
        createdAt: trainer.createdAt,
        stats: {
          assigned: Array.isArray(members) ? members.length : 0,
        },
      };
    });

    return NextResponse.json(trainersWithStats);
  } catch (err: any) {
    // Log server-side for debugging, but always return JSON
    console.error('Error in /api/trainers GET:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
