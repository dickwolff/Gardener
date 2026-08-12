import Link from "next/link";
import { SquareDot } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <SquareDot className="w-5 h-5 text-secondary" strokeWidth={1.5} />
          <span className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>
            Plot
          </span>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Ontwerp, teken en beheer je tuinen.
        </p>
        <nav className="flex gap-6 text-sm" style={{ fontFamily: "var(--font-sans)" }}>
          <Link
            href="/gardens"
            className="text-muted-foreground hover:text-secondary transition-colors"
          >
            Mijn tuinen
          </Link>
          <Link
            href="/gardens/new"
            className="text-muted-foreground hover:text-secondary transition-colors"
          >
            Nieuwe tuin
          </Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-12 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Plot
        </div>
      </div>
    </footer>
  );
}
