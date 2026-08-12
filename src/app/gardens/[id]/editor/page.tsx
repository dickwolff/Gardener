import { getGarden } from "@/lib/data";
import { getDefaultUser } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GardenEditor } from "@/components/garden-editor";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

interface GardenEditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function GardenEditorPage({ params }: GardenEditorPageProps) {
  const { id } = await params;
  let garden;

  try {
    garden = await getGarden(id);
    await getDefaultUser();
  } catch {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col mx-auto max-w-[1280px] w-full px-12 py-8 min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1
              className="text-3xl text-[#2E2E2E]"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              {garden.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {garden.width}m x {garden.height}m
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/gardens/${garden.id}`}>
              <Button variant="outline" size="sm" className="rounded-xl border-2 border-input">
                Tuin-overzicht
              </Button>
            </Link>
            <Link href={`/gardens/${garden.id}/plants`}>
              <Button variant="outline" size="sm" className="rounded-xl border-2 border-input">
                Plantenlijst
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <GardenEditor garden={garden} />
        </div>
      </main>
    </>
  );
}
