require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const email = `test+${Date.now()}@example.com`;
  const password = 'Password123!';
  const body = { gymName: 'Local Test Gym', name: 'Local Tester', email, password };

  console.log('Registering user:', email);
  const reg = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const regJson = await reg.json().catch(() => null);
  console.log('Register response:', reg.status, regJson);

  // wait a moment for DB write
  await wait(1000);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found in DB');
    process.exit(1);
  }
  console.log('User found. emailVerified:', user.emailVerified, 'token present:', !!user.emailVerificationToken);

  if (!user.emailVerificationToken) {
    console.error('No verification token present.');
    process.exit(1);
  }

  console.log('Calling verify endpoint...');
  const verify = await fetch(`http://localhost:3000/api/verify-email?token=${user.emailVerificationToken}`, {
    method: 'GET',
    redirect: 'manual',
  });
  console.log('Verify response status:', verify.status, 'location:', verify.headers.get('location'));

  await wait(500);
  const verified = await prisma.user.findUnique({ where: { email } });
  console.log('After verify - emailVerified:', verified.emailVerified, 'token:', verified.emailVerificationToken);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Test script error:', err);
  prisma.$disconnect().finally(() => process.exit(1));
});
