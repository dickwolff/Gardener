"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateBloomTime } from "@/actions/plant-actions";
import { monthLabel } from "@/lib/bloom";

interface BloomMonthEditorProps {
  plantId: string;
  plantName: string;
  initialMonths?: number[];
  label?: string;
}

export function BloomMonthEditor({ plantId, plantName, initialMonths = [], label }: BloomMonthEditorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>(initialMonths);
  const [saving, setSaving] = useState(false);

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
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button variant="outline" size="sm" className="rounded-xl border-2 border-input h-7 text-xs">
          {label || "Bloei instellen"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="rounded-2xl border-0 w-72 p-4">
        <p className="text-sm mb-3 font-medium">{plantName}</p>
        <div className="grid grid-cols-4 gap-1 mb-4">
          {Array.from({ length: 12 }).map((_, i) => {
            const m = i + 1;
            const isSelected = selected.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMonth(m)}
                className={`text-xs py-1.5 rounded-lg border transition-colors ${
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
          className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSave}
          disabled={selected.length === 0 || saving}
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
