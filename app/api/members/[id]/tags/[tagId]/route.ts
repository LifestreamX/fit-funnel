import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; tagId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gymId = (session.user as any).gymId;
  const { id, tagId } = await params;

  try {
    // validate member and tag
    const [member, tag] = await Promise.all([
      prisma.member.findFirst({ where: { id, gymId } }),
      prisma.tag.findFirst({ where: { id: tagId, gymId } }),
    ]);

    if (!member)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    if (!tag)
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });

    await prisma.memberTag.delete({
      where: { memberId_tagId: { memberId: id, tagId } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing tag from member:', error);
    return NextResponse.json(
      { error: 'Failed to remove tag' },
      { status: 500 },
    );
  }
}
