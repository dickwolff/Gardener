# Plot - Projectplan

Een platform om je tuin te ontwerpen, zones te tekenen, planten te plaatsen en bij te houden wat waar groeit.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| ORM | Prisma + SQLite |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Canvas | SVG (interactive zones, plants, tools) |
| Plants | TREFLE API |
| State | Server Components + React Context (for client-side canvas state) |
| Auth | Single default user initially, User model ready for multi-user |

## Architecture: Server-first

- **Server Components** as default for all pages and data fetching
- **Server Actions** for all mutations (create/update/delete garden, zone, plant)
- **TREFLE API** called exclusively from server (server action), never from browser
- **`'use client'`** only on the garden editor canvas and interactive tools -- the minimum surface area
- Data flows: server loads garden/plant data, passes as props to client canvas component
- Mutations: client canvas calls server actions, server revalidates, data flows back down

## Data Model (Prisma)

```
User --< Garden --< Zone --< Plant
                    |
                    +-- polygon points (JSON)
                              |
plant has x/y coords, TREFLE id, cached info (name, sun, water, bloom, image)
```

### Models

- **User**: id, name, email
- **Garden**: id, name, userId, width, height, scale, createdAt
- **Zone**: id, gardenId, type (grass/border/terrace/fence/pond/path/custom), name, color, points (JSON polygon), order
- **Plant**: id, gardenId, zoneId?, x, y, trefleId?, name, commonName, scientificName, imageUrl, watering, sunlight, bloomTime, notes, plantedAt, createdAt

## Routes

| Route | Type | Description |
|---|---|---|
| `/` | Server | Dashboard: list of your gardens |
| `/gardens/new` | Server + Client | Create new garden form (server renders, client handles form) |
| `/gardens/[id]` | Hybrid | Server loads garden data, client renders SVG canvas editor |
| `/gardens/[id]/plants` | Server | Plant list for this garden with search |
| `/gardens/[id]/bewerken` | Hybrid | Garden detail/edit page |
| `/api/auth/...` | NextAuth | Future auth endpoints |

### Server Actions (mutations)

| Action | Description |
|---|---|
| `createGarden` | Create a new garden |
| `updateGarden` | Update garden name, dimensions, boundary |
| `deleteGarden` | Delete a garden |
| `createZone` | Add a zone to a garden |
| `updateZone` | Move/resize/edit a zone |
| `deleteZone` | Remove a zone |
| `addPlant` | Place a plant with TREFLE data |
| `movePlant` | Move plant to new x/y |
| `removePlant` | Remove a plant |
| `searchPlants` | Search TREFLE API (server-only) |
| `getPlantDetail` | Get plant info from cache or TREFLE |

## Garden Editor (core, client component)

### Toolbar
- Draw boundary: click vertices for irregular garden shape, shows meter-length along edges
- Draw zone: pick type (grass, border, terrace, fence, pond), draw polygon within boundary
- Place plant: click grid point in a zone, search plant via TREFLE (server action), place
- Select/move: drag elements
- Zoom/pan for larger gardens

### Visual
- Garden boundary: bold line with length labels per segment
- Zones: colored fills with pattern (grass=green striped, terrace=gray, border=brown, pond=blue)
- Plants: green dots with name tooltip, click for detail card (loaded from server)
- Grid: fine grid within zones (25cm) for precise placement
- Measurement ruler along edges in meters

### Dimensions
- Garden can be any size (default ~6x15m)
- Irregular shapes supported (not just rectangles)
- Length shown per edge segment while drawing
- Grid size configurable (default 25cm)

## Design System (Organic)

From `.skills/design.md`:

- Paper-gray background (#F5F5F5)
- White borderless cards (#FFFFFF)
- Teal hero (#024F46)
- Amber actions (#ECBA82)
- Heading ink (#2E2E2E), body ink (#57564C)
- Inter (body) + Georgia (headings) font stack
- 16px rounded corners, 1280px centered layout
- WCAG 2.2 AA target
