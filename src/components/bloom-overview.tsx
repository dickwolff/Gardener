import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BloomMonthEditor } from "@/components/bloom-month-editor";
import { BloomBarClickable } from "@/components/bloom-bar-clickable";
import { SunlightEditor } from "@/components/sunlight-editor";
import { refreshBloomData } from "@/actions/bloom-actions";
import { Sun, CloudSun, Cloud, CircleHelp } from "lucide-react";
import {
  safeParseBloom,
  getGapMonths,
  getBloomDensity,
  monthLabel,
} from "@/lib/bloom";

interface BloomPlant {
  id: string;
  name: string;
  commonName: string | null;
  sunlight: string | null;
  bloomTime: string | null;
}

interface BloomOverviewProps {
  gardenId: string;
  plants: BloomPlant[];
}

export function BloomOverview({ gardenId, plants }: BloomOverviewProps) {
  const plantsWithBloom = plants.map((p) => ({
    id: p.id,
    name: p.name,
    commonName: p.commonName,
    sunlight: p.sunlight,
    bloomMonths: safeParseBloom(p.bloomTime),
  }));

  const bloomingPlants = plantsWithBloom.filter((p) => p.bloomMonths.length > 0);
  const plantsWithoutBloomData = plants.filter(
    (p) => !p.bloomTime || safeParseBloom(p.bloomTime).length === 0
  );

  const density = getBloomDensity(bloomingPlants);
  const gapMonths = getGapMonths(bloomingPlants);
  const maxDensity = Math.max(...density, 1);

  if (plants.length === 0) {
    return (
      <Card className="rounded-2xl border-0">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground mb-4">Nog geen planten in deze tuin.</p>
          <Link href={`/gardens/${gardenId}/editor`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl">
              Planten plaatsen
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle
          className="text-xl text-[#2E2E2E]"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
        >
          Bloei-overzicht
        </CardTitle>
        <form action={refreshBloomData}>
          <input type="hidden" name="gardenId" value={gardenId} />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="rounded-xl border-2 border-input"
          >
            Herlaad bloeidata
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">Bloeidichtheid per maand</p>
              <div className="flex gap-2 h-56 mb-3">
                {density.map((count, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center min-w-0">
                    <div
                      className={`w-full rounded-t-lg flex items-end justify-center pb-1 ${
                        count === 0 && gapMonths.includes(i + 1)
                          ? "bg-[#ECBA82]/30 border-2 border-[#ECBA82]"
                          : count > 0
                            ? "bg-[#4A7C59]"
                            : "bg-muted/50"
                      }`}
                      style={{
                        height:
                          count > 0
                            ? `${Math.max((count / maxDensity) * 100, 15)}%`
                            : gapMonths.includes(i + 1)
                              ? "8%"
                              : "4%",
                      }}
                    >
                      {count > 0 && (
                        <span className="text-xs font-semibold text-white">{count}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {density.map((_, i) => (
                  <span
                    key={i}
                    className={`flex-1 text-center text-xs font-medium min-w-0 ${
                      gapMonths.includes(i + 1)
                        ? "text-[#B8860B]"
                        : "text-muted-foreground"
                    }`}
                  >
                    {monthLabel(i + 1)}
                  </span>
                ))}
              </div>
            </div>

            {gapMonths.length > 0 && (
              <div className="flex items-center gap-2 rounded-2xl border-2 border-[#ECBA82] bg-[#ECBA82]/10 px-4 py-3">
                <span className="text-[#8B6914] font-medium">Bloei-gaten gevonden:</span>
                <span className="text-sm text-muted-foreground">
                  In {gapMonths.length} maand{gapMonths.length > 1 ? "en" : ""} bloeit er niets
                  ({gapMonths.map((m) => monthLabel(m)).join(", ")})
                </span>
              </div>
            )}

            {gapMonths.length === 0 && bloomingPlants.length > 0 && (
              <div className="flex items-center gap-2 rounded-2xl border-2 border-[#4A7C59] bg-[#4A7C59]/10 px-4 py-3">
                <p className="text-[#4A7C59] font-medium">
                  Geen bloei-gaten! Het hele jaar door bloei in je tuin.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Planten per bloeiperiode</p>
              <div className="space-y-3">
                {bloomingPlants.map((plant) => (
                  <div
                    key={plant.id}
                    className="flex items-center gap-4 py-2 border-b border-border last:border-0"
                  >
                    <div className="w-36 shrink-0">
                      <p className="text-sm font-medium truncate">{plant.name}</p>
                      {plant.commonName && (
                        <p className="text-xs text-muted-foreground truncate italic">
                          {plant.commonName}
                        </p>
                      )}
                    </div>
                    <BloomMonthEditor
                      plantId={plant.id}
                      plantName={plant.name}
                      initialMonths={plant.bloomMonths}
                    >
                      <BloomBarClickable months={plant.bloomMonths} />
                    </BloomMonthEditor>
                    <SunlightEditor
                      plantId={plant.id}
                      plantName={plant.name}
                      currentSunlight={plant.sunlight}
                    >
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {plant.sunlight === "full_sun" ? (
                          <Sun className="w-3.5 h-3.5" />
                        ) : plant.sunlight === "partial_shade" ? (
                          <CloudSun className="w-3.5 h-3.5" />
                        ) : plant.sunlight === "full_shade" ? (
                          <Cloud className="w-3.5 h-3.5" />
                        ) : (
                          <CircleHelp className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </SunlightEditor>
                  </div>
                ))}
              </div>
            </div>

            {plantsWithoutBloomData.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Planten zonder bloeidata</p>
                <div className="space-y-2">
                  {plantsWithoutBloomData.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        {p.commonName && (
                          <p className="text-xs text-muted-foreground italic">{p.commonName}</p>
                        )}
                      </div>
                      <BloomMonthEditor plantId={p.id} plantName={p.name}>
                        <Button variant="outline" size="sm" className="rounded-xl border-2 border-input h-7 text-xs">
                          Bloei instellen
                        </Button>
                      </BloomMonthEditor>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
