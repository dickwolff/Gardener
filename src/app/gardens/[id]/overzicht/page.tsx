import { notFound } from "next/navigation";
import Link from "next/link";
import { getGarden } from "@/lib/data";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { BloomOverview } from "@/components/bloom-overview";
import { PruningOverview } from "@/components/pruning-overview";

interface OverviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function OverviewPage({ params }: OverviewPageProps) {
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
              className="text-muted-foreground text-sm hover:text-foreground"
            >
              Terug naar {garden.name}
            </Link>
            <h1
              className="text-4xl text-[#2E2E2E] mt-1"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              Tuin-overzicht
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/gardens/${garden.id}/bloom`}>
              <Button variant="outline" className="rounded-2xl border-2 border-input">
                Bloei-overzicht
              </Button>
            </Link>
            <Link href={`/gardens/${garden.id}`}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl">
                Naar tuineditor
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <BloomOverview gardenId={garden.id} plants={garden.plants} />
          <PruningOverview gardenId={garden.id} plants={garden.plants} />
        </div>
      </main>
    </>
  );
}
