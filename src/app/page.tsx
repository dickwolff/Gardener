import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PencilRuler, PenTool, Sprout, CalendarDays, Flower2 } from "lucide-react";

function GardenIllustration() {
  const topLeftPlants = [
    [66, 70], [108, 70], [150, 70],
    [66, 118], [108, 118], [150, 118],
  ];
  const bottomLeftPlants = [
    [66, 236], [108, 236], [150, 236],
    [66, 278], [108, 278], [150, 278],
    [66, 320], [108, 320], [150, 320],
  ];
  const topRightPlants = [
    [316, 70], [358, 70], [400, 70],
    [316, 118], [358, 118], [400, 118],
  ];
  const bottomRightPlants = [
    [316, 236], [358, 236], [400, 236],
    [316, 278], [358, 278], [400, 278],
    [316, 320], [358, 320], [400, 320],
  ];

  return (
    <svg
      viewBox="0 0 480 400"
      className="w-full max-w-md"
      role="img"
      aria-label="Abstracte illustratie van een tuinplan met borders en paden"
    >
      <rect
        x="20"
        y="20"
        width="440"
        height="360"
        rx="32"
        fill="#0A5C52"
        stroke="#ECBA82"
        strokeWidth="2"
      />
      <rect x="210" y="20" width="60" height="360" fill="#F5F5F5" opacity="0.18" />

      <rect x="36" y="36" width="158" height="150" rx="18" fill="#ECBA82" />
      {topLeftPlants.map(([cx, cy]) => (
        <circle key={`tl-${cx}-${cy}`} cx={cx} cy={cy} r="9" fill="#F5F5F5" />
      ))}

      <rect x="36" y="206" width="158" height="158" rx="18" fill="#EFE3D5" />
      {bottomLeftPlants.map(([cx, cy]) => (
        <circle key={`bl-${cx}-${cy}`} cx={cx} cy={cy} r="8" fill="#0A5C52" />
      ))}

      <rect x="286" y="36" width="158" height="150" rx="18" fill="#4A7C59" />
      {topRightPlants.map(([cx, cy]) => (
        <circle key={`tr-${cx}-${cy}`} cx={cx} cy={cy} r="9" fill="#F5F5F5" />
      ))}

      <rect x="286" y="206" width="158" height="158" rx="18" fill="#F5F5F5" />
      {bottomRightPlants.map(([cx, cy], index) => (
        <circle
          key={`br-${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="8"
          fill={index % 2 === 0 ? "#ECBA82" : "#4A7C59"}
        />
      ))}
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <Header variant="light" />
      <main className="flex-1">
        <section className="bg-secondary text-secondary-foreground rounded-b-[80px]">
          <div className="mx-auto max-w-[1280px] w-full px-6 md:px-12 py-20 md:py-28 grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-6">
              <p className="text-primary text-sm font-medium">Tuinontwerp & plantenbeheer</p>
              <h1
                className="text-4xl md:text-5xl xl:text-6xl text-white leading-[1.08]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Jouw tuin, van schets tot bloei
              </h1>
              <p className="text-white/80 text-lg max-w-md leading-relaxed">
                Teken de omtrek van je tuin, zoek planten uit de bibliotheek en houd bij wat waar groeit, bloeit en gesnoeid moet worden.
              </p>
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Link href="/gardens/new">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 px-7"
                  >
                    Nieuwe tuin aanmaken
                  </Button>
                </Link>
                <Link
                  href="/gardens"
                  className="text-white/80 hover:text-white border-b border-white/40 pb-0.5"
                >
                  Bekijk mijn tuinen
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <GardenIllustration />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] w-full px-6 md:px-12 py-16 md:py-28">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12">
            <h2
              className="text-3xl md:text-4xl text-[#2E2E2E] md:col-span-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Een tuin begint met een idee
            </h2>
            <p className="text-muted-foreground leading-relaxed md:col-span-3 text-lg">
              Plot zet je tuin op de kaart — letterlijk. Teken de omtrek, verdeel je tuin in zones
              en geef elke plant een plek. Zo zie je in één oogopslag wat waar groeit, bloeit en
              gesnoeid wil worden.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] w-full px-6 md:px-12 pb-16 md:pb-28">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-3xl border-0">
              <CardContent className="p-8 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <PencilRuler className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-xl text-[#2E2E2E]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Tuin ontwerper
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Teken je tuin zoals hij er echt uitziet. Maak de omtrek, zet zones neer voor zon
                  en schaduw en verplaats planten tot alles klopt.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0">
              <CardContent className="p-8 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Flower2 className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-xl text-[#2E2E2E]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Plantenbibliotheek
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Duizenden planten binnen handbereik. Zoek op naam, bekijk foto&apos;s en kies de
                  planten die bij jouw tuin passen.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] w-full px-6 md:px-12 pb-16 md:pb-28">
          <h2
            className="text-3xl md:text-4xl text-[#2E2E2E] mb-12"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Zo werkt het
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: PenTool,
                title: "Teken",
                text: "Teken de omtrek van je tuin en verdeel hem in zones.",
              },
              {
                icon: Sprout,
                title: "Plant",
                text: "Zoek planten uit de bibliotheek en zet ze op de juiste plek.",
              },
              {
                icon: CalendarDays,
                title: "Plan",
                text: "Houd bij wanneer alles bloeit en gesnoeid moet worden.",
              },
            ].map((step, index) => (
              <div key={step.title} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <step.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Stap {index + 1}</p>
                  <h3
                    className="text-xl text-[#2E2E2E]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] w-full px-6 md:px-12 pb-16 md:pb-28">
          <div className="bg-[#1A1A1A] rounded-[32px] px-6 md:px-16 py-16 md:py-20 text-center">
            <h2
              className="text-3xl md:text-4xl text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Klaar om je tuin te tekenen?
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Maak je eerste tuin en ontdek wat er allemaal in past.
            </p>
            <Link href="/gardens/new">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 px-7"
              >
                Nieuwe tuin aanmaken
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
