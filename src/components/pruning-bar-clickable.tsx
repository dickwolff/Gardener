"use client";

interface PruningBarClickableProps {
  months: number[];
}

export function PruningBarClickable({ months }: PruningBarClickableProps) {
  const MONTH_LABELS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

  return (
    <button
      type="button"
      className="flex-1 flex gap-1 cursor-pointer border-0 p-0 bg-transparent"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const m = i + 1;
        return (
          <div
            key={m}
            className={`flex-1 h-6 rounded-sm flex items-center justify-center text-[10px] leading-none ${
              months.includes(m)
                ? "bg-[#024F46] text-white font-medium"
                : "bg-[#ECBA82]/20 text-muted-foreground"
            }`}
            title={months.includes(m) ? `${MONTH_LABELS[i]}: snoeien` : `${MONTH_LABELS[i]}: niet snoeien`}
          >
            {MONTH_LABELS[i]}
          </div>
        );
      })}
    </button>
  );
}
