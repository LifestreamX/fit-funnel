import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET tags assigned to a member, and POST to assign a tag
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gymId = (session.user as any).gymId;
  const { id } = await params;

  try {
    const member = await prisma.member.findFirst({ where: { id, gymId } });
    if (!member)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    const memberTags = await prisma.memberTag.findMany({
      where: { memberId: id },
      include: { tag: true },
    });

    return NextResponse.json(memberTags.map((mt) => mt.tag));
  } catch (error) {
    console.error('Error fetching member tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gymId = (session.user as any).gymId;
  const { id } = await params;

  try {
    const body = await req.json();
    const { tagId } = body;
    if (!tagId)
      return NextResponse.json({ error: 'tagId is required' }, { status: 400 });

    // validate member and tag belong to same gym
    const [member, tag] = await Promise.all([
      prisma.member.findFirst({ where: { id, gymId } }),
      prisma.tag.findFirst({ where: { id: tagId, gymId } }),
    ]);

    if (!member)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    if (!tag)
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });

    // create relation (id is composite)
    await prisma.memberTag.create({ data: { memberId: id, tagId } });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error assigning tag to member:', error);
    return NextResponse.json(
      { error: 'Failed to assign tag' },
      { status: 500 },
    );
  }
}
