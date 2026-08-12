import type { Metadata } from "next";
import { Header } from "@/components/header";
import { NewGardenForm } from "@/components/new-garden-form";

export const metadata: Metadata = {
  title: "Nieuwe tuin"
}

export default function NewGardenPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full p-12">
        <h1
          className="text-3xl text-[#2E2E2E] mb-8"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
        >
          Nieuwe tuin
        </h1>

        <NewGardenForm />
      </main>
    </>
  );
}
