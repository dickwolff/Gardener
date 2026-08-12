import { getPrisma } from "@/lib/prisma";

export async function getDefaultUser() {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { email: "tuinier@plot.app" },
  });
  if (!user) throw new Error("Default user not found");
  return user;
}

export async function getGardens() {
  const prisma = getPrisma();
  const user = await getDefaultUser();
  return prisma.garden.findMany({
    where: { userId: user.id },
    include: { zones: true, plants: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getGarden(id: string) {
  const prisma = getPrisma();
  const garden = await prisma.garden.findUnique({
    where: { id },
    include: { zones: { orderBy: { order: "asc" } }, plants: true },
  });
  if (!garden) throw new Error("Garden not found");
  return garden;
}
