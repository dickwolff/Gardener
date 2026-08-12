import Link from "next/link";
import { cn } from "@/lib/utils";
import { SquareDot, LayoutGrid, Plus } from "lucide-react";

interface HeaderProps {
  variant?: "default" | "light";
}

export function Header({ variant = "default" }: HeaderProps) {
  const isLight = variant === "light";

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        isLight
          ? "bg-background text-foreground"
          : "bg-secondary text-secondary-foreground"
      )}
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-6 md:py-8 flex items-center justify-between">
        <Link
          href="/gardens"
          className="text-2xl tracking-tight flex items-center gap-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <SquareDot
            className={cn("w-6 h-6", isLight ? "text-secondary" : "text-primary")}
            strokeWidth={1.5}
          />
          Plot
        </Link>
        <nav className="hidden md:flex gap-6 text-sm items-center" style={{ fontFamily: "var(--font-sans)" }}>
          <Link
            href="/gardens"
            className={cn(
              "transition-colors flex items-center gap-1.5",
              isLight ? "hover:text-secondary" : "hover:text-primary"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Mijn tuinen
          </Link>
          <Link
            href="/gardens/new"
            className={cn(
              "transition-colors flex items-center gap-1.5",
              isLight ? "hover:text-secondary" : "hover:text-primary"
            )}
          >
            <Plus className="w-4 h-4" />
            Nieuwe tuin
          </Link>
        </nav>
      </div>
    </header>
  );
}
