# Design brief - Homepage Plot (/)

## 1. Doel
Een overtuigende landing/introductiepagina die het product verkoopt: wat Plot is, waarom het de moeite waard is, en direct uitnodigt om te beginnen. De pagina is de eerste indruk voor een openbaar publiek.

## 2. Doelgroep
Iedere tuinliefhebber, van hobbyist tot beginnende ontwerper. Geen aannames over voorkennis. De pagina legt in eenvoudige, warme taal uit wat de app doet.

## 3. Toon & stijl
Trouw aan het Organic design systeem: warm, rustig, editorial en onhaast.

- Papiergrijs `#F5F5F5` achtergrond, borderloze witte panelen
- Diepteel `#024F46` hero-band (boven vierkant, onder 80px afgerond)
- Amber `#ECBA82` als actiekleur
- Serif-koppen (Georgia), normale breedte, `-0.025em` tracking
- 16px radius op controls, 24-32px op grote containers
- Geen gradients, geen schreeuwerige elementen

## 4. Primaire CTA
**"Nieuwe tuin aanmaken"** -> `/gardens/new`
Secundair: **"Bekijk mijn tuinen"** -> `/gardens`

## 5. Uitgelichte features (alleen deze twee)
- **Tuin ontwerper**: teken de omtrek, voeg zones toe, sleep planten op een canvas
- **Plantenbibliotheek**: zoek planten via TREFLE, krijg naam, foto en verzorging

## 6. Pagina-opbouw

| Sectie | Inhoud |
|---|---|
| **Hero** (teal band, 80px onderradius) | Serif-kop met tagline, korte subtekst, amber CTA "Nieuwe tuin aanmaken" + secundaire link, in-palet illustratie/mockup van een tuin |
| **Intro** (papier) | Editorial paragraaf: wat Plot is en voor wie |
| **Features** (papier) | Twee borderloze witte panels: Tuin ontwerper & Plantenbibliotheek, elk met korte tekst + eigen visueel accent |
| **Hoe het werkt** (papier) | 3 stappen: teken -> plant -> plan (snoeien/bloeien) |
| **CTA-band** (teal of donker eiland `#1A1A1A`) | Laatste uitnodiging met herhaalde amber CTA |
| **Footer** | Merknaam, compacte links (Mijn tuinen, Nieuwe tuin), copyright |

## 7. Content (Nederlands)
Warme, korte copy. Geen vakjargon. Koppen in serif, zin over hoe de tuin "tot bloei komt".

## 8. Technische vereisten
- Server Component (`src/app/page.tsx`), geen client nodig
- Bestaande shadcn/ui tokens + Organic kleuren, geen nieuwe hex-codes los in markup
- Header: lichte variant op de landing (paper-achtergrond boven de teal hero). Anders valt de teal header weg tegen de teal hero
- Responsive: secties 112px padding desktop / 64px mobiel, hero-tekst schaalt

## 9. Succescriteria
- Eén blik duidelijk: "dit is een tuin-app"
- CTA springt eruit (amber op teal)
- Rustig ritme: donkere banden afgewisseld met licht
- Geen interactie nodig om de pagina te waarderen
