require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No user found in DB to use for sample import');
    process.exit(1);
  }

  const gymId = user.gymId;
  const userId = user.id;

  const data = [
    {
      firstName: 'Test',
      lastName: 'One',
      email: 'test.one@example.com',
      phone: '5551234567',
      gymId,
      createdById: userId,
      assignedToId: userId,
    },
    {
      firstName: 'Test',
      lastName: 'Two',
      email: 'test.two@example.com',
      phone: '5559876543',
      gymId,
      createdById: userId,
      assignedToId: null,
    },
  ];

  try {
    const res = await prisma.member.createMany({ data });
    console.log('createMany result:', res);
  } catch (err) {
    console.error('createMany error:', err && err.message ? err.message : err);
    if (err && err.meta) console.error('meta:', err.meta);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
