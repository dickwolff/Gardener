import Link from "next/link";
import { SquareDot, LayoutGrid, Plus } from "lucide-react";

export function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground sticky top-0 z-50">
      <div className="mx-auto max-w-[1280px] px-8 py-8 flex items-center justify-between">
        <Link href="/" className="text-2xl tracking-tight flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
          <SquareDot className="w-6 h-6 text-primary" strokeWidth={1.5} />
          Plot
        </Link>
        <nav className="flex gap-6 text-sm items-center" style={{ fontFamily: "var(--font-sans)" }}>
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4" />
            Mijn tuinen
          </Link>
          <Link href="/gardens/new" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Nieuwe tuin
          </Link>
        </nav>
      </div>
    </header>
  );
}
