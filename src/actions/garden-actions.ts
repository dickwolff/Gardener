"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/data";

export async function createGarden(formData: FormData) {
  const user = await getCurrentUser();
  const name = formData.get("name") as string;
  const width = parseFloat(formData.get("width") as string);
  const height = parseFloat(formData.get("height") as string);

  if (!name || !width || !height) {
    return { error: "Vul alle velden in." };
  }

  const garden = await prisma.garden.create({
    data: { name, width, height, userId: user.id },
  });

  revalidatePath("/gardens");
  return { success: true, data: garden };
}

export async function updateGarden(id: string, data: { name?: string }) {
  const garden = await prisma.garden.update({
    where: { id },
    data,
  });
  revalidatePath(`/gardens/${id}`);
  return { success: true, data: garden };
}

export async function deleteGarden(id: string) {
  await prisma.garden.delete({ where: { id } });
  revalidatePath("/gardens");
  return { success: true };
}

export async function createZone(
  gardenId: string,
  data: { type: string; name?: string; points: { x: number; y: number }[]; color?: string }
) {
  const garden = await prisma.garden.findUnique({ where: { id: gardenId }, include: { zones: true } });
  if (!garden) return { error: "Tuin niet gevonden." };

  const zone = await prisma.zone.create({
    data: {
      gardenId,
      type: data.type,
      name: data.name,
      color: data.color,
      points: JSON.stringify(data.points),
      order: garden.zones.length,
    },
  });

  revalidatePath(`/gardens/${gardenId}`);
  return { success: true, data: zone };
}

export async function updateZone(
  id: string,
  data: { points?: { x: number; y: number }[]; name?: string; color?: string }
) {
  const updateData: Record<string, unknown> = {};
  if (data.points) updateData.points = JSON.stringify(data.points);
  if (data.name) updateData.name = data.name;
  if (data.color) updateData.color = data.color;

  const zone = await prisma.zone.update({ where: { id }, data: updateData as never });
  revalidatePath(`/gardens/${zone.gardenId}`);
  return { success: true, data: zone };
}

export async function deleteZone(id: string) {
  const zone = await prisma.zone.findUnique({ where: { id } });
  if (!zone) return { error: "Zone niet gevonden." };

  await prisma.zone.delete({ where: { id } });
  revalidatePath(`/gardens/${zone.gardenId}`);
  return { success: true };
}
