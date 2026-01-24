import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeSuperAdmin(email: string) {
  try {
    // Find the user by email
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    if (user.isSuperAdmin) {
      console.log(`✅ User ${email} is already a superadmin`);
      process.exit(0);
    }

    // Update the user to be superadmin
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isSuperAdmin: true
      }
    });

    console.log(`✅ Successfully made ${email} a superadmin`);
    console.log(`User ID: ${updatedUser.id}`);
    console.log(`Name: ${updatedUser.name || 'N/A'}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument or use default
const email = process.argv[2] || 'benami.omri@gmail.com';
makeSuperAdmin(email);
