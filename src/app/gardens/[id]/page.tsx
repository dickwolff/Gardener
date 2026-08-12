import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGarden } from "@/lib/data";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { BloomOverview } from "@/components/bloom-overview";
import { PruningOverview } from "@/components/pruning-overview";
import { ChevronLeft, Sprout, PencilRuler } from "lucide-react";

interface OverviewPageProps {
  readonly params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Tuin-overzicht"
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
        <div className="mb-8">
          <Link
            href="/gardens"
            className="text-muted-foreground text-sm hover:text-foreground inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Terug naar mijn tuinen
          </Link>
          <div className="flex items-center justify-between mt-1">
            <h1
              className="text-4xl text-[#2E2E2E]"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              Tuin-overzicht ({garden.name})
            </h1>
            <div className="flex gap-2">
              <Link href={`/gardens/${garden.id}/plants`}>
                <Button variant="outline" className="rounded-2xl border-2 border-input gap-2">
                  <Sprout className="w-4 h-4" />
                  Plantenlijst
                </Button>
              </Link>
              <Link href={`/gardens/${garden.id}/editor`}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-2">
                  <PencilRuler className="w-4 h-4" />
                  Tuineditor
                </Button>
              </Link>
            </div>
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
