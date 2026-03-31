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
    const { members } = await req.json();

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: 'No members to import' },
        { status: 400 },
      );
    }

    const gymId = (session.user as any).gymId;
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const data = members
      .filter((m: any) => m.firstName && m.lastName)
      .map((m: any) => ({
        firstName: String(m.firstName).trim(),
        lastName: String(m.lastName).trim(),
        email: m.email ? String(m.email).trim() : null,
        phone: m.phone ? String(m.phone).trim() : null,
        gymId,
        createdById: userId,
        assignedToId: role === 'TRAINER' ? userId : null, // Auto-assign to trainer if they import
      }));

    const result = await prisma.member.createMany({ data });

    return NextResponse.json({ success: true, count: result.count });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
