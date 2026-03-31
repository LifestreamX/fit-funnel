import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { inviteToken: token } });

  if (!user || !user.inviteExpires || user.inviteExpires < new Date()) {
    return NextResponse.json(
      { error: 'Invalid or expired invite link' },
      { status: 400 },
    );
  }

  return NextResponse.json({ valid: true, name: user.name, email: user.email });
}

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { inviteToken: token },
    });

    if (!user || !user.inviteExpires || user.inviteExpires < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired invite link' },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        inviteToken: null,
        inviteExpires: null,
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
