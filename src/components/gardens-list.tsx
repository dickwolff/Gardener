"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { getGardensPage } from "@/actions/garden-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteGardenButton } from "@/components/delete-garden-button";
import { Loader2 } from "lucide-react";

type GardenItem = Awaited<ReturnType<typeof getGardensPage>>["items"][number] & {
  zones: { id: string }[];
  plants: { id: string }[];
};

interface GardensListProps {
  initialItems: GardenItem[];
  initialNextCursor: string | null;
}

export function GardensList({ initialItems, initialNextCursor }: GardensListProps) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const result = await getGardensPage(nextCursor ?? undefined);
      setItems((prev) => [...prev, ...result.items]);
      setNextCursor(result.nextCursor);
    });
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((garden) => (
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

      {nextCursor && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isPending}
            className="rounded-2xl"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Laden...
              </>
            ) : (
              "Laad meer"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
