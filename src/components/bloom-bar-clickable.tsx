"use client";

interface BloomBarClickableProps {
  months: number[];
}

export function BloomBarClickable({ months }: BloomBarClickableProps) {
  const MONTH_LABELS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

  return (
    <div className="flex-1 flex gap-1 cursor-pointer">
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
    </div>
  );
}
