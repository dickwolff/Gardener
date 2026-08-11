"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sun, CloudSun, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateSunlight } from "@/actions/plant-actions";

const SUNLIGHT_OPTIONS = [
  { value: "full_sun", label: "Volle zon", icon: Sun },
  { value: "partial_shade", label: "Half schaduw", icon: CloudSun },
  { value: "full_shade", label: "Schaduw", icon: Cloud },
];

interface SunlightEditorProps {
  plantId: string;
  plantName: string;
  currentSunlight: string | null;
  children: ReactNode;
}

export function SunlightEditor({ plantId, plantName, currentSunlight, children }: SunlightEditorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSelect(value: string) {
    setSaving(true);
    await updateSunlight(plantId, value);
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
        <div className="space-y-2">
          {SUNLIGHT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={saving}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                currentSunlight === option.value
                  ? "border-[#4A7C59] bg-[#4A7C59]/10"
                  : "border-border hover:border-[#4A7C59]/50"
              }`}
            >
              <option.icon className={`w-5 h-5 ${currentSunlight === option.value ? "text-[#4A7C59]" : "text-muted-foreground"}`} />
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
