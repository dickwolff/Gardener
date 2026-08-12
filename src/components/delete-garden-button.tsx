"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteGarden } from "@/actions/garden-actions";
import { Trash2 } from "lucide-react";

interface DeleteGardenButtonProps {
  gardenId: string;
  variant?: "default" | "icon";
}

export function DeleteGardenButton({ gardenId, variant = "default" }: DeleteGardenButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Weet je zeker dat je deze tuin wilt verwijderen? Alle zones en planten worden ook verwijderd.")) {
      return;
    }

    setIsDeleting(true);
    await deleteGarden(gardenId);
    router.push("/gardens");
  }

  if (variant === "icon") {
    return (
      <Button
        size="icon-sm"
        variant="outline"
        className="rounded-full border-border text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Tuin verwijderen"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="destructive"
      className="rounded-2xl gap-2"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? "Bezig..." : "Verwijderen"}
    </Button>
  );
}
