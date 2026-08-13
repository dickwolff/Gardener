import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Not authenticated");
  return session.user;
}

export async function getGardens() {
  const user = await getCurrentUser();
  return prisma.garden.findMany({
    where: { userId: user.id },
    include: { zones: true, plants: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getGardensPaginated(cursor?: string, limit = 6) {
  const user = await getCurrentUser();
  const gardens = await prisma.garden.findMany({
    where: { userId: user.id },
    include: { zones: true, plants: true },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  const hasMore = gardens.length > limit;
  const items = hasMore ? gardens.slice(0, limit) : gardens;
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null };
}

export async function getGarden(id: string) {
  const user = await getCurrentUser();
  const garden = await prisma.garden.findUnique({
    where: { id },
    include: { zones: { orderBy: { order: "asc" } }, plants: true },
  });
  if (!garden) throw new Error("Garden not found");
  if (garden.userId !== user.id) throw new Error("Not authorized");
  return garden;
}
