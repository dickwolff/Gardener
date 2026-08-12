import { SquareDot } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl w-full px-6 md:px-12 py-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <SquareDot className="w-5 h-5 text-secondary" strokeWidth={1.5} />
          <span className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>
            Plot
          </span>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Tuinontwerp & beheer
        </p>
        <hr className="w-16 border-border my-2" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Plot
        </p>
      </div>
    </footer>
  );
}
