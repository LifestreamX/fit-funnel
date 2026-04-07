import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface SessionUser {
  id: string;
  role: string;
  gymId: string;
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!session || user?.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const gymId = user.gymId;

    // Verify the trainer belongs to this gym
    const trainer = await prisma.user.findFirst({
      where: { id, gymId, role: 'TRAINER' },
      include: {
        assignedMembers: true,
      },
    });

    if (!trainer) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    // Unassign all members from this trainer before deleting
    if (trainer.assignedMembers.length > 0) {
      await prisma.member.updateMany({
        where: { assignedToId: id },
        data: { assignedToId: null },
      });
    }

    // Delete all outreach logs by this trainer
    await prisma.outreachLog.deleteMany({
      where: { trainerId: id },
    });

    // Delete the trainer
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
