<div align="center">
  <img src="/public/icon.svg" alt="Plot logo" width="64" height="64">
  <h1>Plot</h1>
  <p>Ontwerp, teken en beheer je tuin — plant voor plant, boom voor boom.</p>
  <p><a href="https://example.com">Bekijk Plot op example.com</a></p>
</div>

## Wat is Plot?

Plot is een webapp waarmee je je tuin op de kaart zet. Je tekent de omtrek, verdeelt de ruimte in zones (zon, schaduw, borders) en plaatst planten en bomen die je uit de bibliotheek haalt. Vervolgens houd je eenvoudig bij wanneer alles bloeit en gesnoeid moet worden.

### Wat kun je ermee?

- **Tuin ontwerpen** — teken de omtrek en zones op een canvas.
- **Planten en bomen toevoegen** — zoek via een plantenbibliotheek en plaats ze op de juiste plek.
- **Bloei-overzicht** — zie in één oogopslag wanneer je tuin in bloei staat.
- **Snoei-overzicht** — plan en volg snoeimomenten per plant.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/) met SQLite
- [Base UI](https://base-ui.com/) component primitives

---

## Zelf draaien

### Vereisten

- Node.js 20+
- npm

### Installatie

```bash
npm install
```

### Omgevingsvariabelen

Maak een `.env` bestand in de root en vul de volgende waarden in:

```env
# Database (optioneel, default is SQLite)
DATABASE_URL="file:./prisma/dev.db"

# Trefle API key — nodig voor de plantenbibliotheek
# Haal een gratis key op via https://trefle.io
TREFLE_API_TOKEN=your_trefle_token_here

# Perenual API key — alternatief voor planten details
# Haal een key op via https://perenual.com
PERENUAL_API_KEY=your_perenual_key_here
```

### Database klaarzetten

```bash
npx prisma generate
npx prisma db push
```

### Development server starten

```bash
npm run dev
```

Open vervolgens [http://localhost:3000](http://localhost:3000) in je browser.

### Beschikbare scripts

| Script | Beschrijving |
|---|---|
| `npm run dev` | Start de development server |
| `npm run build` | Bouwt de app voor productie |
| `npm run lint` | Voert ESLint uit |
| `npm run format` | Formatteert code met Prettier |
| `npx prisma generate` | Genereert de Prisma client |
| `npx prisma db push` | Synchroniseert het schema met de database |
| `npx prisma studio` | Opent Prisma Studio |
