require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return console.error('no user');
  const gymId = user.gymId;
  const emails = ['test.one@example.com'];
  const phones = ['5551234567'];

  let existingMembers = [];
  try {
    existingMembers = await prisma.member.findMany({
      where: {
        gymId,
        OR: [
          { email: { in: emails, mode: 'insensitive' } },
          { phone: { in: phones } },
        ],
      },
      select: { email: true, phone: true },
    });
    console.log('found using mode:', existingMembers.length);
  } catch (e) {
    console.log('mode not supported, falling back');
    const seen = {};
    if (emails.length > 0) {
      const byEmail = await prisma.member.findMany({
        where: { gymId, email: { in: emails } },
        select: { email: true, phone: true },
      });
      for (const r of byEmail) seen[`${r.email ?? ''}|${r.phone ?? ''}`] = r;
    }
    if (phones.length > 0) {
      const byPhone = await prisma.member.findMany({
        where: { gymId, phone: { in: phones } },
        select: { email: true, phone: true },
      });
      for (const r of byPhone) seen[`${r.email ?? ''}|${r.phone ?? ''}`] = r;
    }
    existingMembers = Object.values(seen);
    console.log('found by fallback:', existingMembers.length);
  }

  console.log(existingMembers);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
});
