import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'MANAGER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email: rawEmail } = await req.json();

    if (!name || !rawEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 },
      );
    }

    const email = rawEmail.toLowerCase();
    const gymId = (session.user as any).gymId;
    const token = randomUUID();
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 },
      );
    }

    await prisma.user.create({
      data: {
        name,
        email,
        role: 'TRAINER',
        gymId,
        inviteToken: token,
        inviteExpires: expires,
      },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'You have been invited to FitFunnel',
      html: `
        <h2>You've been invited to FitFunnel</h2>
        <p>Your manager has added you to their gym on FitFunnel.</p>
        <p>Click the link below to set your password and get started. This link expires in 48 hours.</p>
        <a href="${process.env.INVITE_BASE_URL}/accept-invite?token=${token}">Accept Invite</a>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
