import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gymId = (session.user as any).gymId;
  const role = (session.user as any).role;

  const where: any = { gymId };
  if (role === 'TRAINER') {
    where.assignedToId = (session.user as any).id;
  }

  const members = await prisma.member.findMany({
    where,
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      // createdBy is not a valid include property for MemberInclude<DefaultArgs>
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { firstName, lastName, email, phone } = await req.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 },
      );
    }

    const gymId = (session.user as any).gymId;
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    // Trainers can add prospects, and they're auto-assigned to them
    const member = await prisma.member.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        gymId,
        assignedToId: role === 'TRAINER' ? userId : null,
        createdById: userId,
      },
    });

    return NextResponse.json(member);
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
