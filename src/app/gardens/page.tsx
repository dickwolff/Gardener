import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { getGardens } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeleteGardenButton } from "@/components/delete-garden-button";

export const metadata: Metadata = {
  title: "Mijn tuinen"
}

export default async function GardensPage() {
  const gardens = await getGardens();

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full p-12">
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1
              className="text-3xl text-[#2E2E2E]"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              Mijn tuinen
            </h1>
            <p className="text-muted-foreground mt-2">
              Ontwerp, teken en beheer je tuinen.
            </p>
          </div>
          <Link href="/gardens/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-2">
              <Plus className="w-4 h-4" />
              Nieuwe tuin
            </Button>
          </Link>
        </div>

        {gardens.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <h2
                className="text-2xl text-[#2E2E2E] mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Nog geen tuinen
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Begin met het aanmaken van je eerste tuin. Teken de omtrek, voeg zones toe en plaats je planten.
              </p>
              <Link href="/gardens/new">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-2">
                  <Plus className="w-4 h-4" />
                  Maak je eerste tuin
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gardens.map((garden) => (
              <Card key={garden.id} className="rounded-2xl h-full transition-shadow hover:shadow-md border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/gardens/${garden.id}`} className="flex-1 min-w-0">
                      <CardTitle
                        className="text-xl text-[#2E2E2E]"
                        style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
                      >
                        {garden.name}
                      </CardTitle>
                    </Link>
                    <DeleteGardenButton gardenId={garden.id} variant="icon" />
                  </div>
                </CardHeader>
                <Link href={`/gardens/${garden.id}`} className="block">
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="rounded-xl">
                        {garden.zones.length} zones
                      </Badge>
                      <Badge variant="secondary" className="rounded-xl">
                        {garden.plants.length} planten
                      </Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
