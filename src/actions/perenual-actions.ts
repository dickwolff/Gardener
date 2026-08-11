"use server";

export async function searchPlantsPerenual(query: string) {
  if (!query || query.length < 2) return { data: [] };

  const apiKey = process.env.PERENUAL_API_KEY;
  if (!apiKey) return { error: "Perenual API key niet geconfigureerd." };

  try {
    const res = await fetch(
      `https://perenual.com/api/species-list?key=${apiKey}&q=${encodeURIComponent(query)}`
    );

    if (!res.ok) return { error: `Perenual API fout: ${res.status}` };

    const json = await res.json();
    return { data: json.data || [] };
  } catch {
    return { error: "Kon geen verbinding maken met Perenual." };
  }
}

export async function getPlantDetailPerenual(perenualId: number) {
  const apiKey = process.env.PERENUAL_API_KEY;
  if (!apiKey) return { error: "Perenual API key niet geconfigureerd." };

  try {
    const res = await fetch(
      `https://perenual.com/api/species/details/${perenualId}?key=${apiKey}`
    );

    if (!res.ok) return { error: `Perenual API fout: ${res.status}` };

    const json = await res.json();
    return { data: json };
  } catch {
    return { error: "Kon geen plantgegevens ophalen." };
  }
}
