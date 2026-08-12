"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BloomBarClickableProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  months: number[];
}

export const BloomBarClickable = forwardRef<HTMLButtonElement, BloomBarClickableProps>(
  function BloomBarClickable({ months, className, ...props }, ref) {
    const MONTH_LABELS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

    return (
      <button
        ref={ref}
        type="button"
        className={cn("flex-1 flex gap-1 cursor-pointer border-0 p-0 bg-transparent", className)}
        {...props}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const m = i + 1;
          return (
            <div
              key={m}
              className={`flex-1 h-6 rounded-sm flex items-center justify-center text-[10px] leading-none ${
                months.includes(m)
                  ? "bg-[#4A7C59] text-white font-medium"
                  : "bg-[#ECBA82]/20 text-muted-foreground"
              }`}
              title={months.includes(m) ? `${MONTH_LABELS[i]}: bloei` : `${MONTH_LABELS[i]}: geen bloei`}
            >
              {MONTH_LABELS[i]}
            </div>
          );
        })}
      </button>
    );
  }
);
