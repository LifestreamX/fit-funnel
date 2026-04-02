require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No user found');
    process.exit(1);
  }

  const emails = ['test.one@example.com'];
  const phones = ['5551234567'];

  try {
    const existing = await prisma.member.findMany({
      where: {
        gymId: user.gymId,
        OR: [
          { email: { in: emails, mode: 'insensitive' } },
          { phone: { in: phones } },
        ],
      },
      select: { email: true, phone: true },
    });
    console.log('findMany result:', existing);
  } catch (err) {
    console.error('findMany error:', err && err.message ? err.message : err);
    if (err && err.meta) console.error('meta:', err.meta);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
