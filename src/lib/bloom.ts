const MONTH_MAP: Record<string, number> = {
  january: 1, januari: 1, jan: 1,
  february: 2, februari: 2, feb: 2,
  march: 3, maart: 3, mar: 3,
  april: 4, apr: 4,
  may: 5, mei: 5,
  june: 6, juni: 6, jun: 6,
  july: 7, juli: 7, jul: 7,
  august: 8, augustus: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oktober: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

const SEASON_MAP: Record<string, number[]> = {
  "early spring": [3, 4],
  "mid spring": [4, 5],
  "late spring": [5, 6],
  spring: [3, 4, 5],
  "early summer": [6, 7],
  "mid summer": [7, 8],
  "late summer": [8, 9],
  summer: [6, 7, 8],
  "early autumn": [9, 10],
  "mid autumn": [10, 11],
  "late autumn": [11, 12],
  autumn: [9, 10, 11],
  fall: [9, 10, 11],
  "early winter": [12, 1],
  "mid winter": [1, 2],
  "late winter": [2, 3],
  winter: [12, 1, 2],
  "year round": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  "all year": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

const MONTH_NAMES = [
  "jan", "feb", "mrt", "apr", "mei", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

export function safeParseBloom(bloomTime: string | null): number[] {
  try {
    return parseBloomMonths(bloomTime);
  } catch {
    return [];
  }
}

export function parseBloomMonths(bloomTime: string | null): number[] {
  if (!bloomTime) return [];

  const lower = bloomTime.toLowerCase().trim();

  if (!lower || lower === "null") return [];

  const season = SEASON_MAP[lower];
  if (season) return [...season];

  const months: number[] = [];
  const parts = lower.split(/[,;&/\s]+/);

  for (const part of parts) {
    const num = parseInt(part, 10);
    if (num >= 1 && num <= 12) {
      if (!months.includes(num)) months.push(num);
      continue;
    }
    const month = MONTH_MAP[part];
    if (month && !months.includes(month)) {
      months.push(month);
    }
  }

  if (months.length === 0) {
    const match = lower.match(/late|mid|early/);
    if (match) {
      for (const [seasonName, seasonMonths] of Object.entries(SEASON_MAP)) {
        if (lower.includes(seasonName)) {
          return [...seasonMonths];
        }
      }
    }
  }

  return months.sort((a, b) => a - b);
}

export function getGapMonths(bloomingPlants: { bloomMonths: number[] }[]): number[] {
  const covered = new Set<number>();

  for (const plant of bloomingPlants) {
    for (const month of plant.bloomMonths) {
      covered.add(month);
    }
  }

  const gaps: number[] = [];
  for (let m = 1; m <= 12; m++) {
    if (!covered.has(m)) gaps.push(m);
  }
  return gaps;
}

export function getBloomDensity(bloomingPlants: { bloomMonths: number[] }[]): number[] {
  const density = new Array(13).fill(0);

  for (const plant of bloomingPlants) {
    for (const month of plant.bloomMonths) {
      density[month]++;
    }
  }

  return density.slice(1);
}

export function monthLabel(m: number): string {
  return MONTH_NAMES[m - 1];
}
