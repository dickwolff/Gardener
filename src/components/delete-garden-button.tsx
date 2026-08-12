"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteGarden } from "@/actions/garden-actions";
import { Trash2 } from "lucide-react";

interface DeleteGardenButtonProps {
  gardenId: string;
  variant?: "default" | "icon";
}

export function DeleteGardenButton({ gardenId, variant = "default" }: DeleteGardenButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteGarden(gardenId);
    setOpen(false);
    router.push("/gardens");
  }

  const triggerButton =
    variant === "icon" ? (
      <Button
        size="icon-sm"
        variant="outline"
        className="rounded-full border-border text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10"
        aria-label="Tuin verwijderen"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    ) : (
      <Button variant="destructive" className="rounded-2xl gap-2">
        <Trash2 className="w-4 h-4" />
        Verwijderen
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerButton} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tuin verwijderen</DialogTitle>
          <DialogDescription>
            Weet je zeker dat je deze tuin wilt verwijderen? Alle zones en planten worden ook verwijderd.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" className="rounded-xl">
                Annuleren
              </Button>
            }
          />
          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Bezig..." : "Verwijderen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
