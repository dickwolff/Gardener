import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Plot",
    default: `Plot - Tuinontwerp & beheer`,
  },
  description: "Ontwerp je tuin, plaats planten of bomen, en houd bij wat waar groeit",
  icons: {
    icon: "/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${inter.variable}`}
      style={{
        "--font-heading": "Georgia, 'Times New Roman', serif",
      } as React.CSSProperties}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
