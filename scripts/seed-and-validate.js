const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding minimal test data...');

  // Create a gym
  const gym = await prisma.gym.create({ data: { name: 'Seed Gym' } });

  // Create users
  const manager = await prisma.user.create({
    data: { name: 'Seed Manager', email: `seed-manager-${Date.now()}@example.com`, role: 'MANAGER', gymId: gym.id },
  });

  const trainer = await prisma.user.create({
    data: { name: 'Seed Trainer', email: `seed-trainer-${Date.now()}@example.com`, role: 'TRAINER', gymId: gym.id },
  });

  // Create a pipeline stage
  const stage = await prisma.pipelineStage.create({
    data: { name: 'New', color: '#6B7280', order: 0, isDefault: true, gymId: gym.id },
  });

  // Create a tag
  const tag = await prisma.tag.create({ data: { name: 'VIP', color: '#F97316', gymId: gym.id } });

  // Create a member
  const member = await prisma.member.create({
    data: {
      firstName: 'Seed',
      lastName: 'Member',
      email: `seed-member-${Date.now()}@example.com`,
      phone: '5551234567',
      gymId: gym.id,
      createdById: manager.id,
      assignedToId: trainer.id,
      stageId: stage.id,
    },
  });

  // Assign tag
  await prisma.memberTag.create({ data: { memberId: member.id, tagId: tag.id } });

  // Create an outreach log
  await prisma.outreachLog.create({ data: { memberId: member.id, trainerId: trainer.id, notes: 'Seed test note' } });

  // Fetch members as the API would
  const members = await prisma.member.findMany({
    where: { gymId: gym.id },
    include: {
      assignedTo: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
      logs: { orderBy: { createdAt: 'desc' }, take: 1, include: { trainer: { select: { id: true, name: true } } } },
    },
  });

  console.log('Seeded members:');
  console.log(JSON.stringify(members, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
