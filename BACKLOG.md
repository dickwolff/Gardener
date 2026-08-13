# Backlog

## Tuinen delen

### Data model

Nieuw `GardenShare` model als join table:

```prisma
model GardenShare {
  id        String   @id @default(uuid())
  gardenId  String
  garden    Garden   @relation(fields: [gardenId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      String   // "viewer" | "editor"
  createdAt DateTime @default(now())

  @@unique([gardenId, userId])
  @@index([userId])
}
```

Relaties toevoegen aan Garden en User:
```prisma
model Garden {
  // ...existing fields...
  shares    GardenShare[]
}

model User {
  // ...existing fields...
  shares    GardenShare[]
}
```

### Rechten

| Actie | Owner | Editor | Viewer |
|-------|-------|--------|--------|
| Tuin bekijken | ✅ | ✅ | ✅ |
| Tuin bewerken | ✅ | ✅ | ❌ |
| Tuin verwijderen | ✅ | ❌ | ❌ |
| Zones/planten bewerken | ✅ | ✅ | ❌ |
| Tuin delen | ✅ | ❌ | ❌ |

### Wijzigingen per bestand

| Bestand | Wat |
|---------|-----|
| `prisma/schema.prisma` | `GardenShare` model + relaties toevoegen |
| `src/lib/data.ts` | `getGardens()` toont eigen + gedeelde tuinen; `getGarden()` checkt owner OF share |
| `src/lib/auth-helpers.ts` | Nieuw: `assertGardenAccess()` helper voor authorization |
| `src/actions/garden-actions.ts` | Authorization checks + nieuwe acties: `shareGarden`, `removeShare`, `getShares` |
| `src/actions/plant-actions.ts` | Authorization checks op alle mutating acties |
| `src/actions/bloom-actions.ts` | Authorization check op `refreshBloomData` |
| `src/app/gardens/page.tsx` | Gedeelde tuinen apart tonen (met badge "Gedeeld") |
| `src/app/gardens/[id]/page.tsx` | Share-knop tonen (alleen owner), editor/delete verbergen voor viewers |
| `src/app/gardens/[id]/editor/page.tsx` | Read-only mode voor viewers doorgeven |
| `src/app/gardens/[id]/plants/page.tsx` | Edit controls verbergen voor viewers |
| `src/components/garden-editor.tsx` | `isReadOnly` prop accepteren |
| Nieuw: `src/components/share-garden-dialog.tsx` | UI om per email uit te nodigen + bestaande shares beheren |

### Nieuwe server acties

- `shareGarden(gardenId, email, role)` — owner voegt share toe
- `removeShare(gardenId, userId)` — owner verwijdert share
- `getShares(gardenId)` — owner bekijkt shares

### Authorization helper

```typescript
// src/lib/auth-helpers.ts
async function assertGardenAccess(gardenId: string, requiredRole?: "viewer" | "editor") {
  const user = await getCurrentUser();
  const garden = await prisma.garden.findUnique({ where: { id: gardenId } });
  if (!garden) throw new Error("Tuin niet gevonden.");

  if (garden.userId === user.id) return { garden, role: "owner" as const };

  const share = await prisma.gardenShare.findUnique({
    where: { gardenId_userId: { gardenId, userId: user.id } }
  });
  if (!share) throw new Error("Niet geautoriseerd.");
  if (requiredRole && share.role !== requiredRole) throw new Error("Onvoldoende rechten.");

  return { garden, role: share.role as "viewer" | "editor" };
}
```

### Volgorde van uitvoeren

1. Schema + migratie (`npx prisma db push`)
2. `assertGardenAccess()` helper aanmaken
3. Authorization in alle server acties
4. Data layer aanpassen (getGardens, getGarden)
5. Share acties toevoegen (shareGarden, removeShare, getShares)
6. UI: share dialog component
7. UI: gedeelde tuinen in overzicht (badge "Gedeeld")
8. UI: read-only mode voor viewers in editor
9. UI: share-knop op tuin detail pagina
