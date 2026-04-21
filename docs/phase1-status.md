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
- GM unlock bugfix:
  - Root cause: the unlock form was wired through `useActionState`, so the action was invoked with bound state plus form data and runtime logs showed `loginGmMode({}, {})`. That made the password payload path harder to reason about, and missing `MARR_GM_PASSWORD` was indistinguishable from a wrong password.
  - Fix: the unlock form now posts directly to a plain server action that receives `FormData` as its first argument.
  - Correct passwords set the existing `marr_gm_mode` HTTP-only cookie and redirect to `/map`.
  - Wrong passwords redirect back to `/gm?error=invalid-password` and show a concise error.
  - Missing server configuration redirects to `/gm?error=missing-config` and names `MARR_GM_PASSWORD`.
- Real-device mobile interaction fix:
  - Root cause found in the interaction layer: SVG hotspots relied on `click` from a focusable `<g>` element, which can be inconsistent on mobile browsers. On narrow screens the codex also sits below the map, so successful selection could still feel like no panel opened.
  - Fix: hotspots now handle non-mouse pointer activation and touch-end activation directly, while suppressing duplicate synthetic clicks.
  - Fix: selecting a node on mobile scrolls the codex panel into view after state updates, so player text and GM notes are visible immediately.
  - Verified by code-path review, lint, production build, and route-level player/GM visibility checks. A final physical phone retest is still required to confirm the reported LAN-device failure is gone.

## Remaining In Phase 1

- Phase 1 MVP is effectively complete after one final physical phone retest confirms map hotspots open the codex in player mode and GM mode.
- Keep leak checks in the normal build/verification habit whenever codex fields change.

## Recommended Next Single Step

Retest `/map` on the real phone over LAN: tap Hanging Cages on Surface Marr, tap one UndaMarr node, then repeat in GM mode. If the codex opens and GM notes appear when unlocked, freeze Phase 1.

## Known Risks Or Weak Spots

- The SVG map art remains placeholder-level, but it is sufficient for Phase 1 MVP because all 9 hotspots are visible, clickable, and backed by codex entries.
- `viewBox` updates center correctly from `zoomTarget`, but browser interpolation of SVG `viewBox` is limited; this is acceptable for MVP.
- Related-node navigation can select nodes across areas, but deeper nested map flows are intentionally not implemented yet.
- GM mode is lightweight home-campaign protection. It uses an environment password plus an HTTP-only session cookie, not full authentication or authorization.
- Production cookies are marked `Secure`, so a production build served over plain local HTTP may not persist the GM cookie in a normal browser. Use `npm run dev` for local HTTP testing or deploy behind HTTPS.
- Player-mode leak prevention depends on server-side sanitizing before client components receive data. Future client components should not import raw `marrContent` directly.
- The local `agent-browser` command was not available on PATH during this QA pass, so verification used server responses, route-level leak checks, code review, lint, and production build rather than screenshots.
- This environment still cannot reproduce an actual phone tap over LAN; the mobile hotspot fix should be accepted only after the reported device flow is retested.

## Architectural Notes For The Next Prompt

- `src/content/marr.ts` is the source of truth for Phase 1 map nodes, map definitions, area definitions, and metadata.
- `src/app/map/page.tsx` is the visibility boundary for the map. It reads GM session state and passes either sanitized or GM-expanded content into the client map.
- `src/lib/gm-visibility.ts` owns stripping GM-only fields from player-mode content.
- `MapViewer` reads `AreaDefinition.nodeIds`, resolves nodes through validation helpers, and renders hotspots from each node's `region`.
- `AreaHotspot` supports `box` and `polygon` regions in `0-100` map coordinates.
- `InfoPanel` renders player-facing fields by default and only renders `node.gm` fields when `gmEnabled` is true.
- Keep future map additions content-driven: add a node, region, zoom target, and area/map `nodeIds`; avoid hardcoding lore in components.
