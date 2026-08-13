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
import { Trash2, X, Loader2 } from "lucide-react";

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
        variant="destructive"
        className="rounded-full"
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
              <Button variant="outline" size="icon-sm" className="rounded-full" aria-label="Annuleren">
                <X className="w-4 h-4" />
              </Button>
            }
          />
          <Button
            variant="destructive"
            size="icon-sm"
            className="rounded-full"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Verwijderen"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
