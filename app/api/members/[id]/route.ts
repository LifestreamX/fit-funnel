import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const gymId = (session.user as any).gymId
  const { id } = await params

  const member = await prisma.member.findFirst({
    where: { id, gymId },
  })

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const data: any = {}

    if (body.status) data.status = body.status
    if (body.assignedToId !== undefined) data.assignedToId = body.assignedToId || null

    const updated = await prisma.member.update({
      where: { id },
      data,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
