# Marr Interactive Development Roadmap

This roadmap keeps Marr Interactive focused: a stable content system, a compelling visual map, clean GM/player separation, fast loading, and a codebase that can grow into more of Marr without becoming precious or brittle.

## Phase 1 MVP

### Goals

- Establish the content-driven foundation.
- Ship a strong first explorable map for Surface Marr and UndaMarr.
- Keep player-facing and GM-only content clearly separated.
- Keep the app fast, local, and maintainable.
- Make future content additions possible without changing app logic.

### Features

- Next.js App Router, TypeScript, and Tailwind foundation.
- Typed `ContentNode`, map, area, faction, NPC, item, lore, and GM annotation schema.
- Initial Marr vertical slice:
  - Tree of Marr
  - Hanging Cages
  - Book of Souls
  - Cult of Daemos
  - Brindlecross Market
  - Lanternwick Watch Shrine
  - Black Sap Market
  - White Root Tangles
  - Taproot Vault
- SVG-based interactive map with clickable regions, hover states, centered zoom, breadcrumbs, and codex panel.
- Lightweight GM mode using an environment password and server-side content sanitizing.
- Content validation during build.
- Content authoring guide.
- Single verification command for Phase 1 work: `npm run check`.

### Risks

- Content schema could become too broad before real needs appear.
- Map visuals could become decorative instead of useful.
- GM-only text could leak if future client components import raw content directly.
- The first map could be over-polished before the content workflow is proven.

### What Not To Build Yet

- User accounts or role management.
- Database-backed content editing.
- Search, filters, or graph browsing.
- Full campaign timeline or faction clocks.
- Hand-drawn production map assets.
- Animation-heavy map effects.
- Deep dungeon-room navigation beyond the first UndaMarr drilldown.

## Phase 2 Expansion

### Goals

- Expand Marr beyond the first slice while keeping authoring consistent.
- Improve navigation across a larger body of content.
- Add richer GM utility without turning the site into a campaign manager.
- Keep performance stable as maps and nodes grow.

### Features

- Additional Surface Marr districts and UndaMarr subareas.
- Nested drilldown maps for major landmarks and dungeon-like areas.
- Content indexes for factions, NPCs, relics, rumors, and lore articles.
- Lightweight client search across player-safe content.
- Optional GM-only filters and annotation views.
- Better related-node navigation and backlink display.
- Reusable map asset pipeline for hand-drawn or generated bitmap map layers.
- Expanded content validation rules for orphan nodes, missing map regions, and duplicate labels.

### Risks

- Search and index pages could make the experience feel text-first instead of map-first.
- More node categories could force UI complexity if not kept disciplined.
- GM tools could drift into session tracking, encounter building, or database needs too early.
- Larger content files could become hard to review if not split carefully.

### What Not To Build Yet

- Full CMS.
- Multiplayer or shared live table state.
- Campaign log, calendars, or quest trackers.
- Rules automation.
- Real authentication unless the site is going beyond home/private use.
- Procedural map generation.

## Phase 3 Polish And Publishing

### Goals

- Make the site feel finished, durable, and publishable.
- Improve accessibility, performance, and deploy confidence.
- Prepare the project for a wider player/GM audience if desired.
- Decide whether lightweight GM mode is still sufficient.

### Features

- Production map art and responsive image handling.
- Accessibility pass for keyboard navigation, contrast, labels, and reduced motion.
- Performance audit for bundle size, static rendering, and image loading.
- Metadata, Open Graph images, icons, and deployment docs.
- Print-friendly or session-reference views.
- Optional real authentication if publishing beyond a trusted table.
- Error boundaries and graceful missing-content screens.
- Expanded QA checklist for GM leakage, content validation, and map interactions.

### Risks

- Publishing needs may pull the project toward infrastructure before the campaign content is ready.
- Production art can dominate time without improving table utility.
- Real auth adds complexity and hosting constraints.
- Polish work may hide unresolved content-model problems if Phase 2 expansion was rushed.

### What Not To Build Yet

- Monetization.
- Public user-generated content.
- Social features.
- A generalized worldbuilding platform.
- Heavy analytics or tracking.
- Complex permission matrices unless real publishing demands them.
