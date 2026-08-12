"use client";

import { useEffect, useState } from "react";

export function useCheckUpdate(intervalMs = 30_000) {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const checkVersion = async () => {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        const data = await res.text();

        if (res.status === 200 && data !== process.env.VERSION) {
          setUpdateAvailable(true);
        }
      } catch {
        // stil falen
      }
    };

    const interval = setInterval(checkVersion, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { updateAvailable };
}
