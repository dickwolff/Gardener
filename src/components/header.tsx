"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SquareDot, LayoutGrid, Plus, LogOut, Menu, Home } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface HeaderProps {
  variant?: "default" | "light";
}

export function Header({ variant = "default" }: HeaderProps) {
  const isLight = variant === "light";
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          href="/"
          className="text-2xl tracking-tight flex items-center gap-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <SquareDot
            className={cn("w-6 h-6", isLight ? "text-secondary" : "text-primary")}
            strokeWidth={1.5}
          />
          Plot
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ fontFamily: "var(--font-sans)" }}>
          {session ? (
            <>
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
              <Separator orientation="vertical" className="h-5" />
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                  <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-white font-bold text-sm">
                  {session.user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => signOut()}
                className={cn(
                  "rounded-full",
                  isLight ? "hover:text-secondary" : "hover:text-primary"
                )}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                "transition-colors",
                isLight ? "hover:text-secondary" : "hover:text-primary"
              )}
            >
              Inloggen
            </Link>
          )}
        </nav>

        {session && (
          <Drawer open={mobileOpen} onOpenChange={setMobileOpen} swipeDirection="right">
            <DrawerTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              }
            />
            <DrawerContent className="rounded-none rounded-l-xl w-72">
              <DrawerHeader>
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="text-xl tracking-tight flex items-center gap-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <SquareDot className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    Plot
                  </Link>
                  <DrawerClose
                    render={
                      <Button variant="ghost" size="icon-sm" aria-label="Sluiten">
                        <span className="sr-only">Sluiten</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </Button>
                    }
                  />
                </div>
                <DrawerTitle className="sr-only">Navigatiemenu</DrawerTitle>
                <DrawerDescription className="sr-only">Hoofdnavigatie</DrawerDescription>
              </DrawerHeader>

              <div className="flex flex-col gap-1 px-4 py-2" style={{ fontFamily: "var(--font-sans)" }}>
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  href="/gardens"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Mijn tuinen
                </Link>
                <Link
                  href="/gardens/new"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <Plus className="w-4 h-4" />
                  Nieuwe tuin
                </Link>
              </div>

              <div className="mt-auto px-4 pb-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3 px-3">
                  <Avatar size="sm">
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                    <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-bold">
                    {session.user.name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    signOut();
                  }}
                  className="w-full justify-start gap-3 px-3"
                >
                  <LogOut className="w-4 h-4" />
                  Uitloggen
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </header>
  );
}
