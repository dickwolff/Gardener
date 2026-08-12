import { notFound } from "next/navigation";
import Link from "next/link";
import { getGarden } from "@/lib/data";
import { Header } from "@/components/header";
import { parseBloomMonths, monthLabel } from "@/lib/bloom";
import { SunlightEditor } from "@/components/sunlight-editor";
import { Sun, CloudSun, Cloud, CircleHelp, ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PlantsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlantsPage({ params }: PlantsPageProps) {
  const { id } = await params;
  let garden;

  try {
    garden = await getGarden(id);
  } catch {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-[1280px] w-full px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/gardens/${garden.id}`}
              className="text-muted-foreground text-sm hover:text-foreground inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Terug naar {garden.name}
            </Link>
            <h1
              className="text-4xl text-[#2E2E2E] mt-1"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              Planten in {garden.name}
            </h1>
          </div>
          <Link href={`/gardens/${garden.id}/editor`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl">
              Naar tuineditor
            </Button>
          </Link>
        </div>

        {garden.plants.length === 0 ? (
          <Card className="rounded-2xl border-0">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground mb-4">
                Nog geen planten geplaatst in deze tuin.
              </p>
              <Link href={`/gardens/${garden.id}/editor`}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl">
                  Planten plaatsen
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {garden.plants.map((plant) => (
              <Card key={plant.id} className="rounded-2xl border-0">
                {plant.imageUrl && (
                  <div className="w-full h-40 overflow-hidden rounded-t-2xl">
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle
                    className="text-lg text-[#2E2E2E]"
                    style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
                  >
                    {plant.name}
                  </CardTitle>
                  {plant.scientificName && (
                    <CardDescription className="italic">{plant.scientificName}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 items-center">
                    <SunlightEditor plantId={plant.id} plantName={plant.name} currentSunlight={plant.sunlight}>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 rounded-xl">
                        {plant.sunlight === "full_sun" ? <Sun className="w-4 h-4" /> : plant.sunlight === "partial_shade" ? <CloudSun className="w-4 h-4" /> : plant.sunlight === "full_shade" ? <Cloud className="w-4 h-4" /> : <CircleHelp className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-muted-foreground">{plant.sunlight === "full_sun" ? "Volle zon" : plant.sunlight === "partial_shade" ? "Half schaduw" : plant.sunlight === "full_shade" ? "Schaduw" : "Onbekend"}</span>
                      </Button>
                    </SunlightEditor>
                    {plant.watering && (
                      <Badge variant="secondary" className="rounded-xl">
                        {plant.watering}
                      </Badge>
                    )}
                    {plant.bloomTime && (() => {
                      const months = parseBloomMonths(plant.bloomTime);
                      if (months.length === 0) return null;
                      return (
                        <Badge variant="secondary" className="rounded-xl">
                          {months.map((m) => monthLabel(m)).join(", ")}
                        </Badge>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
