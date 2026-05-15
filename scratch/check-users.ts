
import { prisma } from '../lib/prisma';

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in database:', users.length);
    users.forEach(u => console.log(`- ${u.email}`));
  } catch (err) {
    console.error('Error checking users:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
