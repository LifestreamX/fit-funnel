// Simple, explicit DB wipe script using Prisma Client
// USAGE: set your DATABASE_URL (or .env), then run:
//   node scripts/wipe-db.js --yes
// This requires the project dependencies to be installed and will PERMANENTLY DELETE DATA.

// Load .env.local first if present for safe local testing, then fall back to .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function wipe() {
  console.warn(
    'WARNING: This will permanently DELETE data from the database pointed by DATABASE_URL.',
  );
  if (!process.env.DATABASE_URL) {
    console.error('No DATABASE_URL found in environment. Aborting.');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (!args.includes('--yes')) {
    console.log(
      'Dry run. To actually wipe the DB run: node scripts/wipe-db.js --yes',
    );
    process.exit(0);
  }

  try {
    const steps = [
      { key: 'memberTag', table: '"MemberTag"' },
      { key: 'outreachLog', table: '"OutreachLog"' },
      { key: 'note', table: '"Note"' },
      { key: 'activity', table: '"Activity"' },
      { key: 'member', table: '"Member"' },
      { key: 'pipelineStage', table: '"PipelineStage"' },
      { key: 'tag', table: '"Tag"' },
      { key: 'user', table: '"User"' },
      { key: 'gym', table: '"Gym"' },
    ];

    for (const step of steps) {
      console.log(`Deleting ${step.key}...`);
      try {
        // If Prisma client has the model, try deleteMany
        if (
          prisma[step.key] &&
          typeof prisma[step.key].deleteMany === 'function'
        ) {
          await prisma[step.key].deleteMany();
          continue;
        }
        // Fallback to raw SQL
        console.log(
          `Prisma model ${step.key} not found on client, trying raw SQL delete for ${step.table}...`,
        );
        await prisma.$executeRawUnsafe(`DELETE FROM ${step.table}`);
      } catch (err) {
        console.warn(
          `Prisma delete failed for ${step.key}:`,
          err && err.message ? err.message : err,
        );
        try {
          console.log(`Attempting raw SQL delete for ${step.table}...`);
          await prisma.$executeRawUnsafe(`DELETE FROM ${step.table}`);
        } catch (rawErr) {
          console.error(
            `Raw SQL delete also failed for ${step.table}:`,
            rawErr && rawErr.message ? rawErr.message : rawErr,
          );
        }
      }
    }

    console.log('Database wipe completed.');
  } catch (err) {
    console.error('Error wiping DB:', err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

wipe();
