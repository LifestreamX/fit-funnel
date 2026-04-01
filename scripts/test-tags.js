const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creating test gym/user/tag/member...');
  const gym = await prisma.gym.create({ data: { name: 'Dev Gym' } });
  const user = await prisma.user.create({
    data: {
      name: 'Dev User',
      email: `dev+${Date.now()}@example.com`,
      role: 'MANAGER',
      gymId: gym.id,
    },
  });

  const tag = await prisma.tag.create({ data: { name: `Tag-${Date.now()}`, gymId: gym.id } });

  const member = await prisma.member.create({
    data: {
      firstName: 'Test',
      lastName: 'Member',
      email: `member+${Date.now()}@example.com`,
      gymId: gym.id,
    },
  });

  await prisma.memberTag.create({ data: { memberId: member.id, tagId: tag.id } });

  const loaded = await prisma.member.findUnique({
    where: { id: member.id },
    include: { tags: { include: { tag: true } } },
  });

  console.log('Member with tags:', JSON.stringify(loaded, null, 2));

  // cleanup: delete created data
  await prisma.memberTag.deleteMany({ where: { memberId: member.id } });
  await prisma.member.delete({ where: { id: member.id } });
  await prisma.tag.delete({ where: { id: tag.id } });
  await prisma.user.delete({ where: { id: user.id } });
  await prisma.gym.delete({ where: { id: gym.id } });

  console.log('Test completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
