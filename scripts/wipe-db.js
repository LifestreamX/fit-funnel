// Simple, explicit DB wipe script using Prisma Client
// USAGE: set your DATABASE_URL (or .env), then run:
//   node scripts/wipe-db.js --yes
// This requires the project dependencies to be installed and will PERMANENTLY DELETE DATA.

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function wipe() {
  console.warn('WARNING: This will permanently DELETE data from the database pointed by DATABASE_URL.');
  if (!process.env.DATABASE_URL) {
    console.error('No DATABASE_URL found in environment. Aborting.');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (!args.includes('--yes')) {
    console.log('Dry run. To actually wipe the DB run: node scripts/wipe-db.js --yes');
    process.exit(0);
  }

  try {
    console.log('Deleting MemberTag...');
    await prisma.memberTag.deleteMany();

    console.log('Deleting OutreachLog...');
    await prisma.outreachLog.deleteMany();

    console.log('Deleting Note...');
    await prisma.note.deleteMany();

    console.log('Deleting Activity...');
    await prisma.activity.deleteMany();

    console.log('Deleting Members...');
    await prisma.member.deleteMany();

    console.log('Deleting PipelineStage...');
    await prisma.pipelineStage.deleteMany();

    console.log('Deleting Tag...');
    await prisma.tag.deleteMany();

    console.log('Deleting Users...');
    await prisma.user.deleteMany();

    console.log('Deleting Gyms...');
    await prisma.gym.deleteMany();

    console.log('Database wipe completed.');
  } catch (err) {
    console.error('Error wiping DB:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

wipe();
