"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateBloomTime } from "@/actions/plant-actions";
import { monthLabel } from "@/lib/bloom";

interface BloomMonthEditorProps {
  plantId: string;
  plantName: string;
  initialMonths?: number[];
  children: ReactNode;
}

export function BloomMonthEditor({ plantId, plantName, initialMonths = [], children }: BloomMonthEditorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (open && !prevOpen.current) {
      setSelected([...initialMonths]);
    }
    prevOpen.current = open;
  }, [open, initialMonths]);

  function toggleMonth(m: number) {
    setSelected((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m].sort((a, b) => a - b)
    );
  }

  async function handleSave() {
    if (selected.length === 0) return;
    setSaving(true);
    await updateBloomTime(plantId, selected);
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex">
        {children}
      </button>
      <DialogContent className="rounded-2xl border-0 sm:max-w-xs">
        <DialogHeader>
          <DialogTitle
            className="text-base text-[#2E2E2E]"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
          >
            {plantName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 12 }).map((_, i) => {
            const m = i + 1;
            const isSelected = selected.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMonth(m)}
                className={`text-xs py-2 rounded-lg border transition-colors ${
                  isSelected
                    ? "bg-[#4A7C59] text-white border-[#4A7C59]"
                    : "bg-background text-muted-foreground border-border hover:border-[#4A7C59]"
                }`}
              >
                {monthLabel(m)}
              </button>
            );
          })}
        </div>
        <Button
          size="sm"
          className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
          onClick={handleSave}
          disabled={selected.length === 0 || saving}
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
