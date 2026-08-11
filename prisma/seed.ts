import { prisma } from "../src/lib/prisma";

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "tuinier@plot.app" },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: "Tuinier",
        email: "tuinier@plot.app",
      },
    });
    console.log("Default user created.");
  } else {
    console.log("Default user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
