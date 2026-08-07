const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admins = [
    { username: 'admin_hn', email: 'admin_hn@vinhdanh.edu.vn', campus: 'HN', role: 'admin' },
    { username: 'admin_dn', email: 'admin_dn@vinhdanh.edu.vn', campus: 'DN', role: 'admin' },
    { username: 'admin_hcm', email: 'admin_hcm@vinhdanh.edu.vn', campus: 'HCM', role: 'admin' },
    { username: 'admin_ct', email: 'admin_ct@vinhdanh.edu.vn', campus: 'CT', role: 'admin' },
  ];

  for (const admin of admins) {
    await prisma.user.upsert({
      where: { username: admin.username },
      update: {},
      create: {
        username: admin.username,
        email: admin.email,
        password_hash: passwordHash,
        role: admin.role,
        campus: admin.campus
      }
    });
    console.log(`Ensured user exists: ${admin.username} for campus ${admin.campus}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
