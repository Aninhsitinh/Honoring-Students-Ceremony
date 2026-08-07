const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating Semesters to HCM...');
  const updatedSemesters = await prisma.semester.updateMany({
    data: {
      campus: 'HCM'
    }
  });
  console.log(`Updated ${updatedSemesters.count} semesters.`);

  console.log('Updating Posts to HCM...');
  const updatedPosts = await prisma.post.updateMany({
    data: {
      campus: 'HCM'
    }
  });
  console.log(`Updated ${updatedPosts.count} posts.`);

  // If there are existing old users, maybe update their campus too? But we created specific users admin_hcm, admin_hn, etc.
  // We should make sure the original "admin" user is assigned to HCM to avoid breaking old workflow if they still use it.
  const oldAdmin = await prisma.user.findFirst({
    where: { username: 'admin' }
  });
  
  if (oldAdmin) {
    await prisma.user.update({
      where: { id: oldAdmin.id },
      data: { campus: 'HCM' }
    });
    console.log('Updated old "admin" user campus to HCM.');
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
