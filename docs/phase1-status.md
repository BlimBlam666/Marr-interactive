# Phase 1 Status

## Complete

- Structured TypeScript content schema for nodes, maps, areas, factions, items/relics, lore, and GM metadata.
- Build-time content validation for duplicate ids, missing references, map/area links, and malformed hotspot regions.
- Phase 1 seed content for the 9 MVP mapped nodes:
  - Tree of Marr
  - Hanging Cages
  - Book of Souls
  - Cult of Daemos
  - Brindlecross Market
  - Lanternwick Watch Shrine
  - Black Sap Market
  - White Root Tangles
  - Taproot Vault
- Surface Marr map view with 6 clickable hotspots.
- UndaMarr map view with 3 clickable hotspots.
- Click-to-focus map behavior using content `zoomTarget` data.
- Player-facing codex panel driven by selected `ContentNode` data.
- Breadcrumb/back-navigation pattern.
- Lightweight GM/player separation pass for the map and codex flow:
  - `/map` checks GM mode on the server before preparing the client payload.
  - Player mode strips GM notes, secrets, stat blocks, GM annotations, and GM-only relationships.
  - GM mode uses the existing password-gated session cookie and shows sealed codex material deliberately.
- GM mode has a visible active-state indicator and relock control through the site header.
- Content authoring guide and project roadmap.
- Focused Phase 1 QA pass for the existing map and codex flow:
  - Checked player-mode `/map` rendering and confirmed GM-only phrase `soul-fed engine` is absent.
  - Checked GM-mode `/map` rendering with the unlocked session cookie and confirmed GM content, mode indicator, and relock control are present.
  - Reviewed desktop and narrow/mobile layout behavior for the map, codex panel, breadcrumbs, area switching, and GM controls.
  - Ran lint and production build successfully.
- QA-driven fixes:
  - Reduced the mobile map minimum height so narrow viewports are less cramped.
  - Gave area and node chip buttons explicit selected state with `aria-pressed`.
  - Tightened the site header on very narrow screens so GM mode controls remain accessible.

## Remaining In Phase 1

- Phase 1 MVP is effectively complete unless the table wants a final human visual acceptance pass.
- Keep leak checks in the normal build/verification habit whenever codex fields change.

## Recommended Next Single Step

Do a final human acceptance pass of the Phase 1 MVP in a real browser, then freeze Phase 1 and move to Phase 2 planning only if no blocking table-use issues are found.

## Known Risks Or Weak Spots

- The SVG map art remains placeholder-level, but it is sufficient for Phase 1 MVP because all 9 hotspots are visible, clickable, and backed by codex entries.
- `viewBox` updates center correctly from `zoomTarget`, but browser interpolation of SVG `viewBox` is limited; this is acceptable for MVP.
- Related-node navigation can select nodes across areas, but deeper nested map flows are intentionally not implemented yet.
- GM mode is lightweight home-campaign protection. It uses an environment password plus an HTTP-only session cookie, not full authentication or authorization.
- Player-mode leak prevention depends on server-side sanitizing before client components receive data. Future client components should not import raw `marrContent` directly.
- The local `agent-browser` command was not available on PATH during this QA pass, so verification used server responses, route-level leak checks, code review, lint, and production build rather than screenshots.

## Architectural Notes For The Next Prompt

- `src/content/marr.ts` is the source of truth for Phase 1 map nodes, map definitions, area definitions, and metadata.
- `src/app/map/page.tsx` is the visibility boundary for the map. It reads GM session state and passes either sanitized or GM-expanded content into the client map.
- `src/lib/gm-visibility.ts` owns stripping GM-only fields from player-mode content.
- `MapViewer` reads `AreaDefinition.nodeIds`, resolves nodes through validation helpers, and renders hotspots from each node's `region`.
- `AreaHotspot` supports `box` and `polygon` regions in `0-100` map coordinates.
- `InfoPanel` renders player-facing fields by default and only renders `node.gm` fields when `gmEnabled` is true.
- Keep future map additions content-driven: add a node, region, zoom target, and area/map `nodeIds`; avoid hardcoding lore in components.
