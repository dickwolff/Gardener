"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckUpdate } from "@/hooks/use-check-update";

export default function VersionUpdateChecker() {
  const { updateAvailable } = useCheckUpdate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  if (!updateAvailable) return null;

  return (
    <div
      className="fixed bottom-6 inset-x-6 md:inset-x-auto md:right-6 z-50 flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-lg"
      style={{ maxWidth: "calc(100vw - 3rem)" }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          Nieuwe versie beschikbaar
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ververs de pagina om de laatste updates te laden.
        </p>
      </div>
      <Button
        disabled={isRefreshing}
        size="sm"
        onClick={() => {
          setIsRefreshing(true);
          window.location.reload();
        }}
      >
        <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
        Verversen
      </Button>
    </div>
  );
}
