"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function refreshBloomData(formData: FormData) {
  const gardenId = formData.get("gardenId") as string;

  const plants = await prisma.plant.findMany({
    where: { gardenId, trefleId: { not: null } },
  });

  let updated = 0;
  const trefleToken = process.env.TREFLE_API_TOKEN;

  for (const plant of plants) {
    if (!plant.trefleId || !trefleToken) continue;

    try {
      const res = await fetch(
        `https://trefle.io/api/v1/plants/${plant.trefleId}?token=${trefleToken}`
      );

      if (!res.ok) continue;

      const json = await res.json();
      const detail = json.data as Record<string, unknown>;
      const growth = (detail.main_species as Record<string, unknown>)?.growth || detail.growth;
      const rawBloom = (growth as Record<string, unknown>)?.bloom_months;
      if (!rawBloom) continue;

      const rawText = Array.isArray(rawBloom) ? rawBloom.join(", ") : (typeof rawBloom === "string" ? rawBloom : "");
      if (!rawText) continue;

      const { parseBloomMonths } = await import("@/lib/bloom");
      const bloom = parseBloomMonths(rawText).join(",");

      if (!bloom || bloom === plant.bloomTime) continue;

      await prisma.plant.update({
        where: { id: plant.id },
        data: { bloomTime: bloom },
      });
      updated++;
    } catch {
      continue;
    }
  }

  revalidatePath(`/gardens/${gardenId}/bloom`);
  revalidatePath(`/gardens/${gardenId}`);
}
