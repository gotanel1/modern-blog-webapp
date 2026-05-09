const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // 1. Delete other users except test@example.com
  const deleteResult = await prisma.user.deleteMany({
    where: {
      NOT: {
        email: 'test@example.com'
      }
    }
  });
  console.log(`Deleted ${deleteResult.count} users.`);

  // 2. Reset password for test@example.com to 'password123'
  const hashedPassword = await bcrypt.hash('password123', 10);
  const updatedUser = await prisma.user.update({
    where: { email: 'test@example.com' },
    data: { password: hashedPassword }
  });
  
  console.log('--- DATABASE CLEANUP COMPLETE ---');
  console.log(`Remaining User: ${updatedUser.email}`);
  console.log('Password set to: password123');
  console.log('---------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
