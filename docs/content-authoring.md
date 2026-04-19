# Marr Interactive Content Authoring Guide

Marr Interactive is a visual campaign gazetteer. It presents Marr as an explorable map, but the real source of truth is structured content in `src/content/marr.ts`.

Every explorable thing is a `ContentNode`: landmarks, factions, NPCs, items, rumors, dungeon sites, hazards, and future lore entries all use the same core shape.

## Core Structure

Use `src/content/types.ts` as the schema reference. The main content file exports `marrContent`, which contains:

- `nodes`: every content node
- `maps`: map definitions and layers
- `areas`: explorable regions such as Surface Marr and UndaMarr
- `lore`: article-style entries
- `factions`, `npcs`, `items`: specialized metadata linked to nodes
- `gmAnnotations`: GM notes tied to nodes, maps, or areas

Each `ContentNode` should include:

```ts
{
  id: "black-sap-market",
  title: "Black Sap Market",
  shortLabel: "Sap Market",
  category: "district",
  playerSummary: "One sentence players can scan quickly.",
  playerDescription: "A short paragraph of player-safe context.",
  sensoryDetails: ["One concrete table detail."],
  hooks: ["A playable situation."],
  rumors: ["A rumor that may be true, false, or incomplete."],
  related: [{ id: "brindlecross-market", relationship: "route-to" }],
  tags: ["undamarr", "trade"]
}
```

## Adding A New Region

Add both a `MapDefinition` and an `AreaDefinition` when the region needs its own map view.

1. Add a map to `marrContent.maps`.
2. Add an area to `marrContent.areas`.
3. Add the area id to a parent area's `childAreaIds` if it is nested.
4. Add node ids to both `MapDefinition.nodeIds` and `AreaDefinition.nodeIds`.

Use stable ids:

```ts
{
  id: "old-orchard-map",
  title: "Old Orchard Map",
  shortLabel: "Orchard",
  description: "A short map description.",
  defaultLayer: "surface",
  layers: [{ id: "surface", title: "Paths", visibleByDefault: true }],
  nodeIds: ["root-choked-orchard"],
  bounds: { width: 100, height: 100 }
}
```

## Adding A New Landmark

Add a `ContentNode` with a map reference, region, and zoom target.

```ts
{
  id: "root-choked-orchard",
  title: "Root-Choked Orchard",
  shortLabel: "Orchard",
  category: "landmark",
  playerSummary: "Dead fruit trees strangled by roots from the Tree of Marr.",
  playerDescription: "The orchard is quiet except for the creak of dry branches...",
  sensoryDetails: ["Sour fruit rot.", "Roots flexing under dead leaves."],
  hooks: ["A child swears one tree still grows silver apples."],
  rumors: ["Daemos cut down the orchard's first tree himself."],
  related: [{ id: "tree-of-marr", relationship: "contained-by" }],
  map: { mapId: "surface-marr-map", layer: "surface" },
  region: { type: "box", x: 12, y: 44, width: 10, height: 8 },
  zoomTarget: {
    mapId: "surface-marr-map",
    nodeId: "root-choked-orchard",
    center: { x: 17, y: 48 },
    scale: 2
  },
  tags: ["surface", "root", "landmark"]
}
```

Then add `"root-choked-orchard"` to the relevant map and area `nodeIds`.

## Factions, Items, NPCs, And Rumors

These should usually be both a `ContentNode` and a specialized entry.

For a faction:

```ts
// In nodes
{
  id: "ash-witnesses",
  title: "The Ash Witnesses",
  shortLabel: "Witnesses",
  category: "faction",
  playerSummary: "A quiet group that records names before the Book can erase them.",
  playerDescription: "They write on cloth, skin, and hidden beams...",
  hooks: ["They ask the party to protect a forbidden recitation."],
  rumors: ["They can restore a name if three people speak it together."],
  tags: ["faction", "memory"]
}

// In factions
{
  nodeId: "ash-witnesses",
  publicFace: "Mourners, scribes, and shrine helpers.",
  wants: ["Protect names", "Expose the Book"],
  methods: ["Hidden ledgers", "Public mourning", "Smuggled testimony"]
}
```

For an NPC, add a node with `category: "npc"` and an `NpcEntry`. For an item, add a node with `category: "item"` or `"relic"` and an `ItemEntry`. For a rumor, a node with `category: "rumor"` is often enough unless it needs special UI later.

## GM-Only Content

Put referee-only material inside the `gm` field:

```ts
gm: {
  description: "What is really happening.",
  notes: ["How to use this at the table."],
  secrets: ["A reveal players should not see by default."],
  statBlocks: [
    {
      id: "root-wight",
      name: "Root-Wight",
      role: "Soul-drained remnant",
      instincts: ["Find its name", "Punish the living"],
      abilities: ["Pass through rootwood", "Steal a spoken memory"]
    }
  ]
}
```

Use `gmOnly: true` for hidden relationships:

```ts
related: [
  { id: "book-of-souls", relationship: "contains", gmOnly: true }
]
```

Player mode strips GM-only fields before content reaches client components. Still, write as if anything outside `gm` is player-safe.

## Map Hotspots

Hotspots come from `region`.

Use `box` for simple areas:

```ts
region: { type: "box", x: 24, y: 52, width: 12, height: 10 }
```

Use `polygon` for irregular areas:

```ts
region: {
  type: "polygon",
  points: [
    { x: 45, y: 12 },
    { x: 58, y: 18 },
    { x: 54, y: 44 }
  ]
}
```

Coordinates are percentages within the map bounds, currently `0` to `100`.

## Zoom Targets

`zoomTarget.center` should point to the visual center of the feature, not necessarily the first polygon point. `scale` controls how far the map zooms when selected.

Guidelines:

- `scale: 1.5` to `1.8` for huge landmarks
- `scale: 2` to `2.4` for village features
- `scale: 2.5+` for small sites or future room-level maps

## Naming Conventions

- Use kebab-case ids: `lanternwick-watch`, `book-of-souls`.
- Keep ids stable once referenced.
- Use concise `shortLabel` text for map labels.
- Prefer specific titles over generic ones.
- Tags should be lowercase and reusable: `memory`, `cult`, `undamarr`, `trade`.

## Writing Style

Player-facing text:

- Keep it mysterious but grounded.
- Describe what characters can see, hear, smell, or infer.
- Avoid explaining hidden mechanics.
- Use one strong image instead of three vague ones.
- Keep panel text short enough to scan.

GM-facing text:

- Reveal structure, motive, clocks, and utility.
- Say how to use the node in play.
- Prefer actionable secrets over lore dumps.
- Include costs, consequences, and pressure points.
- Write stat ideas as flexible prompts, not full rules bloat.

Good Marr writing is dark, mythic, and oppressive, but still useful at the table.
