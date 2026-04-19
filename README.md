# Marr Interactive

Marr Interactive is a content-driven Next.js app for exploring a fantasy campaign setting as a visual gazetteer. Every explorable thing is modeled as a content node: landmarks, districts, factions, NPCs, relics, rumors, dungeon rooms, hazards, and future lore objects all use the same core shape.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local TypeScript content files
- HTTP-only cookie session for GM mode
- No database, no accounts, no 3D, no canvas simulation

## Run Locally

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
MARR_GM_PASSWORD=your-table-password
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Folder Structure

```text
src/
  app/
    actions.ts        Server actions for entering/exiting GM mode
    gm/page.tsx       Password gate for GM mode
    layout.tsx        Root shell and persistent navigation
    map/page.tsx      Interactive gazetteer route
    page.tsx          Homepage entry point
  components/
    area-hotspot.tsx    Clickable SVG polygon/box regions
    breadcrumbs.tsx     Map navigation trail
    info-panel.tsx      Player-facing and GM-gated node details
    map-viewer.tsx      Reusable SVG map viewer with centered zoom
    site-header.tsx
    tag-list.tsx
  content/
    marr.ts           Initial Marr content slice
    types.ts          Gazetteer schema
    validation.ts     Reference and shape validation helpers
  lib/
    gm-visibility.ts   Strips GM-only content before player-mode client rendering
    gm-session.ts     Cookie helpers and password validation
```

## Content Model

The central type is `ContentNode` in `src/content/types.ts`. Each node supports:

- `id`, `title`, `shortLabel`, and `category`
- player-facing summary and full description
- optional `gm.description`, `gm.secrets`, `gm.notes`, and `gm.statBlocks`
- related node references
- child and parent node references
- map/layer references
- clickable region data using either a bounding box or polygon
- zoom target data
- tags, hooks, rumors, and discovery state hooks

Separate structures index or enrich those nodes:

- `MapDefinition` describes visual maps, layers, bounds, and map node ids.
- `AreaDefinition` describes explorable areas such as Surface Marr and UndaMarr.
- `LoreArticle` stores article-style setting text linked to nodes.
- `FactionEntry`, `NpcEntry`, and `ItemEntry` add specialized campaign metadata.
- `GmAnnotation` stores referee notes attached to nodes, maps, or areas.

For practical authoring patterns, examples, naming conventions, and writing style guidance, see [docs/content-authoring.md](docs/content-authoring.md).

For project priorities and future sequencing, see [docs/roadmap.md](docs/roadmap.md).

## Initial Slice

The current content includes:

- The Tree of Marr
- The Hanging Cages
- The Book of Souls
- The Cult of Daemos
- Brindlecross Market
- Lanternwick Watch Shrine
- The Taproot Vault
- The Black Sap Market
- The White Root Tangles

The Phase 1 seed intentionally keeps mapped content to these nine nodes, with supporting faction, relic, lore, and GM annotation metadata linked through the structured content model.

## Adding Future Locations

Most future additions should not require app logic changes.

1. Add a new `ContentNode` in `src/content/marr.ts`.
2. Give it `map`, `region`, and `zoomTarget` data if it should appear on an interactive map.
3. Add its id to the relevant `MapDefinition.nodeIds` and `AreaDefinition.nodeIds`.
4. Link it to other content with `related`, `parentNodeId`, or `childNodeIds`.
5. Put referee-only material inside `gm`.

The map UI reads areas, maps, and nodes from content data. If a new node belongs to an existing category, existing components can render it immediately. If a new category is added to `ContentCategory`, add a visual style for that category in `area-hotspot.tsx`.

## Validation

`src/content/validation.ts` checks for duplicate node ids, missing references, invalid map/area references, and malformed clickable regions. `marr.ts` calls `assertValidGazetteerContent(marrContent)` so content mistakes fail early in development and builds.

## GM Mode

GM content is gated before client rendering. The password is checked against `MARR_GM_PASSWORD` in a server action, then the app sets an HTTP-only session cookie. When GM mode is inactive, `getVisibleGazetteerContent` strips GM-only descriptions, secrets, notes, stat blocks, GM annotations, and GM-only relationships before content is passed into client components.

This is lightweight protection for a home campaign tool. It keeps secrets out of the normal player UI and out of the player-mode client payload, but it is not enterprise authentication or authorization.

For a later production-grade upgrade:

1. Replace the single environment password with a real auth provider or signed user sessions.
2. Store role/permission claims server-side.
3. Move GM-only content behind authenticated server routes or server components.
4. Add audit logging for unlocks and content access if the campaign needs it.
5. Keep `getVisibleGazetteerContent` as a final rendering guard even after adding real auth.

## Scripts

```bash
npm run dev
npm run check
npm run build
npm run lint
```
