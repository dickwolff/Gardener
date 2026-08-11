"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addPlant(
  gardenId: string,
  zoneId: string | null,
  data: {
    x: number;
    y: number;
    name: string;
    commonName?: string;
    scientificName?: string;
    imageUrl?: string;
    watering?: string;
    sunlight?: string;
    bloomTime?: string;
    trefleId?: number;
  }
) {
  const plant = await prisma.plant.create({
    data: {
      gardenId,
      zoneId,
      x: data.x,
      y: data.y,
      name: data.name,
      commonName: data.commonName,
      scientificName: data.scientificName,
      imageUrl: data.imageUrl,
      watering: data.watering,
      sunlight: data.sunlight,
      bloomTime: data.bloomTime,
      trefleId: data.trefleId,
    },
  });

  revalidatePath(`/gardens/${gardenId}`);
  return { success: true, data: plant };
}

export async function movePlant(id: string, x: number, y: number) {
  const plant = await prisma.plant.update({ where: { id }, data: { x, y } });
  revalidatePath(`/gardens/${plant.gardenId}`);
  return { success: true, data: plant };
}

export async function updatePlant(
  id: string,
  data: { name?: string; notes?: string; zoneId?: string | null }
) {
  const plant = await prisma.plant.update({ where: { id }, data });
  revalidatePath(`/gardens/${plant.gardenId}`);
  return { success: true, data: plant };
}

export async function updateBloomTime(plantId: string, bloomMonths: number[]) {
  const bloomTime = bloomMonths.join(",");

  const plant = await prisma.plant.update({
    where: { id: plantId },
    data: { bloomTime },
  });

  revalidatePath(`/gardens/${plant.gardenId}/bloom`);
  return { success: true };
}

export async function updateSunlight(plantId: string, sunlight: string) {
  const plant = await prisma.plant.update({
    where: { id: plantId },
    data: { sunlight },
  });

  revalidatePath(`/gardens/${plant.gardenId}/bloom`);
  revalidatePath(`/gardens/${plant.gardenId}/plants`);
  return { success: true };
}

export async function removePlant(id: string) {
  const plant = await prisma.plant.findUnique({ where: { id } });
  if (!plant) return { error: "Plant niet gevonden." };

  await prisma.plant.delete({ where: { id } });
  revalidatePath(`/gardens/${plant.gardenId}`);
  return { success: true };
}

export async function searchPlants(query: string) {
  if (!query || query.length < 2) return { data: [] };

  const trefleToken = process.env.TREFLE_API_TOKEN;
  if (!trefleToken) return { error: "TREFLE API token niet geconfigureerd." };

  try {
    const res = await fetch(
      `https://trefle.io/api/v1/plants/search?q=${encodeURIComponent(query)}&token=${trefleToken}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return { error: `TREFLE API fout: ${res.status}` };
    }

    const json = await res.json();
    return { data: json.data || json };
  } catch {
    return { error: "Kon geen verbinding maken met de plantenzoekopdracht." };
  }
}

export async function getPlantDetail(trefleId: number) {
  const trefleToken = process.env.TREFLE_API_TOKEN;
  if (!trefleToken) return { error: "TREFLE API token niet geconfigureerd." };

  try {
    const res = await fetch(
      `https://trefle.io/api/v1/plants/${trefleId}?token=${trefleToken}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return { error: `TREFLE API fout: ${res.status}` };
    }

    const json = await res.json();
    return { data: json.data || json };
  } catch {
    return { error: "Kon geen plantgegevens ophalen." };
  }
}
