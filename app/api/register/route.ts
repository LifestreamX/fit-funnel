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

    const gym = await prisma.gym.create({ data: { name: gymName } });

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: 'MANAGER',
        gymId: gym.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
