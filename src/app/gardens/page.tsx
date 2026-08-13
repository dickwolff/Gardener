import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { getGardensPage } from "@/actions/garden-actions";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GardensList } from "@/components/gardens-list";

export const metadata: Metadata = {
  title: "Mijn tuinen"
}

export default async function GardensPage() {
  const { items: gardens, nextCursor } = await getGardensPage();

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full p-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-4">
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
          {gardens.length > 0 && (
            <Link href="/gardens/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-2">
                <Plus className="w-4 h-4" />
                Nieuwe tuin
              </Button>
            </Link>
          )}
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
                Begin met het aanmaken van je eerste tuin. Teken de omtrek, voeg zones toe en plaats je planten of bomen.
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
          <GardensList initialItems={gardens} initialNextCursor={nextCursor} />
        )}
      </main>
    </>
  );
}
