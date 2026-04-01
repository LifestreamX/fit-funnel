import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gymId = (session.user as any).gymId;
  const { id } = await params;

  const member = await prisma.member.findFirst({
    where: { id, gymId },
  });

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (body.status) data.status = body.status;
    if (body.assignedToId !== undefined)
      data.assignedToId = body.assignedToId || null;

    const updated = await prisma.member.update({
      where: { id },
      data,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating member:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gymId = (session.user as any).gymId;
  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const { id } = await params;

  const member = await prisma.member.findFirst({
    where: { id, gymId },
    select: { id: true, assignedToId: true, createdById: true },
  });

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  // Permission: managers can delete any member; trainers can delete if assigned to them or created by them
  if (role === 'TRAINER') {
    if (member.assignedToId !== userId && member.createdById !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // Delete outreach logs associated with this member first (no cascade defined)
    await prisma.outreachLog.deleteMany({ where: { memberId: id } });

    // Delete the member
    await prisma.member.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
