#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `production-backup-${timestamp}.json`);

  console.log('Starting production backup (sensitive values will not be printed).');
  const data = {};
  try {
    data.Gym = await prisma.gym.findMany();
    data.User = await prisma.user.findMany();
    data.Member = await prisma.member.findMany();
    data.PipelineStage = await prisma.pipelineStage.findMany();
    data.Note = await prisma.note.findMany();
    data.Tag = await prisma.tag.findMany();
    data.MemberTag = await prisma.memberTag.findMany();
    data.Activity = await prisma.activity.findMany();
    data.OutreachLog = await prisma.outreachLog.findMany();

    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
    console.log('Backup saved to', backupPath);
  } catch (err) {
    console.error('Backup failed:', err.message || err);
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log('Proceeding to delete all records from production database.');
  try {
    // Delete in child->parent order to respect foreign keys
    await prisma.memberTag.deleteMany();
    await prisma.outreachLog.deleteMany();
    await prisma.note.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.member.deleteMany();
    await prisma.pipelineStage.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    await prisma.gym.deleteMany();

    const counts = {
      Gym: await prisma.gym.count(),
      User: await prisma.user.count(),
      Member: await prisma.member.count(),
      PipelineStage: await prisma.pipelineStage.count(),
      Note: await prisma.note.count(),
      Tag: await prisma.tag.count(),
      MemberTag: await prisma.memberTag.count(),
      Activity: await prisma.activity.count(),
      OutreachLog: await prisma.outreachLog.count(),
    };

    const resultPath = path.join(backupDir, `production-wipe-result-${timestamp}.json`);
    fs.writeFileSync(resultPath, JSON.stringify(counts, null, 2), { encoding: 'utf-8' });
    console.log('Wipe complete. Post-wipe counts written to', resultPath);
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Wipe failed:', err.message || err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
