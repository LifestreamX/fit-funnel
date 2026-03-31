import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all pipeline stages for the gym
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { gymId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const stages = await prisma.pipelineStage.findMany({
      where: { gymId: user.gymId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(stages);
  } catch (error) {
    console.error('Error fetching pipeline stages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pipeline stages' },
      { status: 500 },
    );
  }
}

// POST create new pipeline stage
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { gymId: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only managers can create stages
    if (user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, color, order, isDefault } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.pipelineStage.updateMany({
        where: { gymId: user.gymId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const stage = await prisma.pipelineStage.create({
      data: {
        name,
        color: color || '#6B7280',
        order: order ?? 0,
        isDefault: isDefault || false,
        gymId: user.gymId,
      },
    });

    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error creating pipeline stage:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create pipeline stage',
      },
      { status: 500 },
    );
  }
}

// PUT update pipeline stages (reorder or update)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { gymId: true, role: true },
    });

    if (!user || user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { stages } = await req.json();

    // Update all stages in a transaction
    await prisma.$transaction(
      stages.map(
        (stage: {
          id: string;
          name: string;
          color: string;
          order: number;
          isDefault: boolean;
        }) =>
          prisma.pipelineStage.update({
            where: { id: stage.id },
            data: {
              name: stage.name,
              color: stage.color,
              order: stage.order,
              isDefault: stage.isDefault,
            },
          }),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating pipeline stages:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update pipeline stages',
      },
      { status: 500 },
    );
  }
}

// DELETE pipeline stage
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { gymId: true, role: true },
    });

    if (!user || user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const stageId = searchParams.get('id');

    if (!stageId) {
      return NextResponse.json({ error: 'Stage ID required' }, { status: 400 });
    }

    // Check if any members are in this stage
    const membersInStage = await prisma.member.count({
      where: { stageId },
    });

    if (membersInStage > 0) {
      return NextResponse.json(
        { error: 'Cannot delete stage with assigned prospects' },
        { status: 400 },
      );
    }

    await prisma.pipelineStage.delete({
      where: { id: stageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pipeline stage:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete pipeline stage',
      },
      { status: 500 },
    );
  }
}
