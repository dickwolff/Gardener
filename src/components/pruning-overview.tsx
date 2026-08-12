import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { PruningMonthEditor } from "@/components/pruning-month-editor";
import { PruningBarClickable } from "@/components/pruning-bar-clickable";
import { Scissors } from "lucide-react";
import { safeParseBloom, getMonthDensity, monthLabel } from "@/lib/bloom";

interface PruningPlant {
  id: string;
  name: string;
  commonName: string | null;
  pruningTime: string | null;
}

interface PruningOverviewProps {
  gardenId: string;
  plants: PruningPlant[];
}

export function PruningOverview({ gardenId, plants }: PruningOverviewProps) {
  const plantsWithPruning = plants.map((p) => ({
    id: p.id,
    name: p.name,
    commonName: p.commonName,
    pruningMonths: safeParseBloom(p.pruningTime),
  }));

  const pruningPlants = plantsWithPruning.filter((p) => p.pruningMonths.length > 0);
  const plantsWithoutPruningData = plants.filter(
    (p) => !p.pruningTime || safeParseBloom(p.pruningTime).length === 0
  );

  const density = getMonthDensity(pruningPlants.map((p) => ({ months: p.pruningMonths })));
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

  const prunedMonths = density.flatMap((count, i) => (count > 0 ? [i + 1] : []));

  return (
    <Card className="rounded-2xl border-0">
      <CardHeader>
        <CardTitle
          className="text-xl text-[#2E2E2E] flex items-center gap-2"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
        >
          <Scissors className="w-5 h-5 text-[#024F46]" strokeWidth={1.5} />
          Snoei-overzicht
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <p className="text-sm text-muted-foreground mb-4">Snoei per maand</p>
          <div className="flex gap-2 h-56 mb-3">
            {density.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center min-w-0">
                <div
                  className={`w-full rounded-t-lg flex items-end justify-center pb-1 ${
                    count > 0 ? "bg-[#024F46]" : "bg-muted/50"
                  }`}
                  style={{
                    height: count > 0 ? `${Math.max((count / maxDensity) * 100, 15)}%` : "4%",
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
                  prunedMonths.includes(i + 1)
                    ? "text-[#024F46]"
                    : "text-muted-foreground"
                }`}
              >
                {monthLabel(i + 1)}
              </span>
            ))}
          </div>
        </div>

        {pruningPlants.length > 0 && (
          <div className="flex items-center gap-2 rounded-2xl border-2 border-[#024F46] bg-[#024F46]/10 px-4 py-3">
            <span className="text-[#024F46] font-medium">
              {pruningPlants.length} plant{pruningPlants.length > 1 ? "en" : ""} met snoeidata:
            </span>
            <span className="text-sm text-muted-foreground">
              {prunedMonths.length > 0
                ? `snoeien in ${prunedMonths.map((m) => monthLabel(m)).join(", ")}`
                : "geen snoeimaanden ingesteld"}
            </span>
          </div>
        )}

        <Collapsible title="Planten">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Planten per snoeiperiode</p>
              <div className="space-y-3">
                {pruningPlants.map((plant) => (
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
                    <PruningMonthEditor plantId={plant.id} plantName={plant.name} initialMonths={plant.pruningMonths}>
                      <PruningBarClickable months={plant.pruningMonths} />
                    </PruningMonthEditor>
                  </div>
                ))}
              </div>
            </div>

            {plantsWithoutPruningData.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Planten zonder snoeidata</p>
                <div className="space-y-2">
                  {plantsWithoutPruningData.map((p) => (
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
                      <PruningMonthEditor plantId={p.id} plantName={p.name}>
                        <Button variant="outline" size="sm" className="rounded-xl border-2 border-input h-7 text-xs">
                          Snoei instellen
                        </Button>
                      </PruningMonthEditor>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
