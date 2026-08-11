import Link from "next/link";

export function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground rounded-b-[80px]">
      <div className="mx-auto max-w-[1280px] px-8 py-8 flex items-center justify-between">
        <Link href="/" className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Plot
        </Link>
        <nav className="flex gap-6 text-sm" style={{ fontFamily: "var(--font-sans)" }}>
          <Link href="/" className="hover:text-primary transition-colors">
            Mijn tuinen
          </Link>
          <Link href="/gardens/new" className="hover:text-primary transition-colors">
            Nieuwe tuin
          </Link>
        </nav>
      </div>
    </header>
  );
}
