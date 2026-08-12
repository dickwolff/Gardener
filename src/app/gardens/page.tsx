import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { getGardens } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Mijn tuinen"
}

export default async function GardensPage() {
  const gardens = await getGardens();

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full p-12">
        <div className="flex items-center justify-between mb-8">
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
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl">
                  Maak je eerste tuin
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gardens.map((garden) => (
              <Link key={garden.id} href={`/gardens/${garden.id}`} className="group">
                <Card className="rounded-2xl h-full transition-shadow hover:shadow-md border-0">
                  <CardHeader>
                    <CardTitle
                      className="text-xl text-[#2E2E2E]"
                      style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
                    >
                      {garden.name}
                    </CardTitle>
                    <CardDescription>
                      {garden.width}m x {garden.height}m
                    </CardDescription>
                  </CardHeader>
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
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
