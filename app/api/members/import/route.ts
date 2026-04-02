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

    // Normalize and validate input
    const cleaned = members
      .filter((m: any) => m.firstName && m.lastName)
      .map((m: any) => ({
        firstName: String(m.firstName).trim(),
        lastName: String(m.lastName).trim(),
        email: m.email ? String(m.email).trim().toLowerCase() : null,
        phone: m.phone ? String(m.phone).replace(/\D/g, '') : null, // digits only
      }));

    // Fetch existing emails and phones for this gym
    const emails = cleaned
      .map((m) => m.email)
      .filter((e): e is string => typeof e === 'string' && e.length > 0);
    const phones = cleaned
      .map((m) => m.phone)
      .filter((p): p is string => typeof p === 'string' && p.length > 0);
    const existingMembers = await prisma.member.findMany({
      where: {
        gymId,
        OR: [
          { email: { in: emails, mode: 'insensitive' } },
          { phone: { in: phones } },
        ],
      },
      select: { email: true, phone: true },
    });
    const existingEmailSet = new Set(
      existingMembers
        .map((m) => m.email?.toLowerCase())
        .filter((e): e is string => typeof e === 'string' && e.length > 0),
    );
    const existingPhoneSet = new Set(
      existingMembers.map((m) => m.phone).filter((p): p is string => typeof p === 'string' && p.length > 0),
    );

    // Track duplicates within the import batch
    const seenEmails = new Set();
    const seenPhones = new Set();

    let imported = 0;
    let skipped = 0;
    let errors = 0;
    const data = [];

    for (const m of cleaned) {
      // Validate phone: must be 10 digits
      if (m.phone && m.phone.length !== 10) {
        skipped++;
        continue;
      }
      // Check for duplicate email (existing or in batch)
      if (m.email) {
        if (existingEmailSet.has(m.email) || seenEmails.has(m.email)) {
          skipped++;
          continue;
        }
        seenEmails.add(m.email);
      }
      // Check for duplicate phone (existing or in batch)
      if (m.phone) {
        if (existingPhoneSet.has(m.phone) || seenPhones.has(m.phone)) {
          skipped++;
          continue;
        }
        seenPhones.add(m.phone);
      }
      data.push({
        ...m,
        gymId,
        createdById: userId,
        assignedToId: role === 'TRAINER' ? userId : null,
      });
    }

    let result = { count: 0 };
    if (data.length > 0) {
      result = await prisma.member.createMany({ data });
      imported = result.count;
    }

    return NextResponse.json({ success: true, imported, skipped, errors });
  } catch (err) {
    return NextResponse.json(
      { error: 'Something went wrong', details: (err as any)?.message },
      { status: 500 },
    );
  }
}
