"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createGarden } from "@/actions/garden-actions";

export default function NewGardenPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await createGarden(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success && result.data) {
      router.push(`/gardens/${result.data.id}`);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-[1280px] w-full px-12 py-16">
        <h1
          className="text-4xl text-[#2E2E2E] mb-8"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
        >
          Nieuwe tuin
        </h1>

        <Card className="rounded-2xl max-w-lg border-0">
          <CardHeader>
            <CardTitle
              className="text-xl text-[#2E2E2E]"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              Tuin gegevens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Naam</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Bijv. Achtertuin"
                  required
                  className="rounded-xl border-input border-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Breedte (meters)</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="6"
                    required
                    className="rounded-xl border-input border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Lengte (meters)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="15"
                    required
                    className="rounded-xl border-input border-2"
                  />
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-11 w-full"
              >
                {loading ? "Bezig..." : "Tuin aanmaken"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
