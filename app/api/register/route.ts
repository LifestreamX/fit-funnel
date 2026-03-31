import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { gymName, name, email, password } = await req.json();

    if (!gymName || !name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    // Create gym and user in a transaction
    const { gym, user } = await prisma.$transaction(async (tx) => {
      const gym = await tx.gym.create({ data: { name: gymName } });
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashed,
          role: 'MANAGER',
          gymId: gym.id,
        },
      });
      return { gym, user };
    });

    // Create default pipeline stages (outside transaction)
    const defaultStages = [
      { name: 'New Lead', color: '#6B7280', order: 0, isDefault: true },
      { name: 'Contacted', color: '#3B82F6', order: 1, isDefault: false },
      { name: 'Trial', color: '#F59E0B', order: 2, isDefault: false },
      { name: 'Converted', color: '#10B981', order: 3, isDefault: false },
      {
        name: 'Not Interested',
        color: '#EF4444',
        order: 4,
        isDefault: false,
      },
    ];
    await prisma.pipelineStage.createMany({
      data: defaultStages.map((s) => ({
        ...s,
        gymId: gym.id,
      })),
    });

    // Create default tags (outside transaction)
    const defaultTags = [
      { name: 'High Priority', color: '#EF4444' },
      { name: 'Student', color: '#3B82F6' },
      { name: 'Corporate', color: '#8B5CF6' },
      { name: 'Morning', color: '#F59E0B' },
      { name: 'Evening', color: '#EC4899' },
    ];
    await prisma.tag.createMany({
      data: defaultTags.map((t) => ({
        ...t,
        gymId: gym.id,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 },
    );
  }
}
