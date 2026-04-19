import type { ContentNode, GazetteerContent } from "./types";
import { assertValidGazetteerContent } from "./validation";

const marrNodes: ContentNode[] = [
  {
    id: "tree-of-marr",
    title: "The Tree of Marr",
    shortLabel: "The Tree",
    category: "landmark",
    playerSummary:
      "A black-barked giant at Marr's center, wide enough to swallow streets and tall enough to darken noon.",
    playerDescription:
      "The Tree is city, temple, gallows, and horizon. Houses lean into its roots. Ropeways vanish into its lower branches. The people call it protection, but no one stands in its shadow without lowering their voice.",
    sensoryDetails: [
      "Sap glows like banked coals beneath split bark.",
      "The air tastes of iron rain and old smoke.",
      "Leaves shift overhead when the village is windless.",
    ],
    related: [
      { id: "hanging-cages", relationship: "contains" },
      { id: "book-of-souls", relationship: "contained-by", gmOnly: true },
      { id: "taproot-vault", relationship: "route-to" },
      { id: "cult-of-daemos", relationship: "enemy" },
    ],
    childNodeIds: ["hanging-cages", "taproot-vault"],
    map: { mapId: "surface-marr-map", layer: "surface" },
    region: {
      type: "polygon",
      points: [
        { x: 45, y: 12 },
        { x: 57, y: 13 },
        { x: 62, y: 38 },
        { x: 55, y: 70 },
        { x: 44, y: 70 },
        { x: 38, y: 38 },
      ],
    },
    zoomTarget: {
      mapId: "surface-marr-map",
      nodeId: "tree-of-marr",
      center: { x: 50, y: 38 },
      scale: 1.7,
    },
    tags: ["central-landmark", "oppression", "memory", "soul-harvest"],
    hooks: [
      "A root splits a cottage floor and exposes a child's name carved in fresh wood.",
      "A caged prisoner begs the party to cut them down before the Tree flowers.",
      "The Tree drops a black leaf bearing the face of someone still alive.",
    ],
    rumors: [
      "No one born under the Tree can truly leave Marr.",
      "The Tree speaks only to people who have forgotten someone they loved.",
      "Red fruit appears in the canopy after a prisoner dies.",
    ],
    gm: {
      description:
        "The Tree is a soul-fed engine. Lord Daemos keeps it alive by hanging prisoners in the canopy and letting the Book of Souls drink through the roots.",
      notes: [
        "Use sap brightness as a pressure gauge: bright sap means recent feeding; falling black leaves mean the Book is hungry.",
        "Every major power in Marr either serves the Tree, hides from it, or wants to redirect its harvest.",
      ],
      secrets: [
        "The Tree remembers every prisoner it has consumed, but only as fragments.",
        "Its roots can withhold power from Daemos if the Book is damaged or starved.",
      ],
      statBlocks: [
        {
          id: "tree-engine",
          name: "The Tree as Engine",
          system: "system-neutral",
          role: "Oppressive setting engine",
          instincts: ["Preserve the harvest", "Punish oath-breakers", "Spread roots toward buried power"],
          abilities: ["Bleed prophetic sap", "Seal or open root passages", "Tremble when a cage prisoner dies"],
          weaknesses: ["The Book of Souls", "Remembered names of the first dead", "Fire given freely"],
        },
      ],
    },
  },
  {
    id: "hanging-cages",
    title: "The Hanging Cages",
    shortLabel: "Cages",
    category: "landmark",
    playerSummary:
      "Iron cages hang from the canopy, swaying above the village as Marr's clearest warning.",
    playerDescription:
      "The cages are visible from nearly every lane. Some hold criminals, some debtors, some people no one admits knowing. The law says the guilty are displayed until Lord Daemos shows mercy. Mercy rarely climbs that high.",
    sensoryDetails: [
      "Chains creak like teeth grinding.",
      "Old straw, bird droppings, and dried blood speckle the cage floors.",
      "People stop talking when a cage shadow crosses them.",
    ],
    related: [
      { id: "tree-of-marr", relationship: "contained-by" },
      { id: "book-of-souls", relationship: "seeks", gmOnly: true },
      { id: "cult-of-daemos", relationship: "guards", gmOnly: true },
      { id: "brindlecross-market", relationship: "mentions" },
    ],
    parentNodeId: "tree-of-marr",
    map: { mapId: "surface-marr-map", layer: "canopy" },
    region: { type: "box", x: 31, y: 20, width: 13, height: 11 },
    zoomTarget: {
      mapId: "surface-marr-map",
      nodeId: "hanging-cages",
      center: { x: 37, y: 26 },
      scale: 2,
    },
    tags: ["tyranny", "public-fear", "canopy", "prisoners"],
    hooks: [
      "A prisoner in the highest cage knows where the Book is buried.",
      "A cage is lowered empty, but the party hears someone breathing inside it.",
      "The next prisoner scheduled for hanging is innocent, useful, and already half-forgotten.",
    ],
    rumors: [
      "If a prisoner is forgotten by name, the cage opens by itself.",
      "Daemos can hear anything spoken beneath a cage.",
      "The Tree blooms red after a night of full cages.",
    ],
    gm: {
      description:
        "The cages are feeding hooks. Prisoners suspended above the trunk are slowly drained through sympathetic iron into the Book beneath the Tree.",
      notes: [
        "Use the cages for immediate stakes: rescue, public sentencing, coercion, or witness testimony.",
        "A prisoner can survive days or weeks depending on how hungry the Book is.",
      ],
      secrets: [
        "Living fear produces a cleaner harvest than execution.",
        "Each cage chain descends through the bark as a hair-thin root of black iron.",
        "Opening a cage without breaking its feeding link transfers the drain to the rescuer for one night.",
      ],
      statBlocks: [
        {
          id: "cage-bailiff",
          name: "Cage Bailiff",
          system: "nsr",
          role: "Daemos enforcer",
          instincts: ["Make an example", "Name a witness", "Call the cult's watchers"],
          abilities: ["Hooked pole", "Keys on a throat-chain", "Knows which prisoners are still useful"],
          weaknesses: ["Public shame", "Broken chain links", "Contradictory sealed orders"],
        },
      ],
    },
  },
  {
    id: "book-of-souls",
    title: "The Book of Souls",
    shortLabel: "Soul Book",
    category: "relic",
    playerSummary:
      "A buried ledger beneath the Tree, feared in whispers as the place where names go thin.",
    playerDescription:
      "Most villagers have never seen the Book of Souls. They know it through absence: a face no one can place, a grave no one tends, a family line that ends in a smudge of ink on official records.",
    sensoryDetails: [
      "Warm pages pulse like skin over a vein.",
      "Ink smells of wet roots and extinguished candles.",
      "Names whisper louder when blood is nearby.",
    ],
    related: [
      { id: "tree-of-marr", relationship: "guards", gmOnly: true },
      { id: "hanging-cages", relationship: "seeks", gmOnly: true },
      { id: "taproot-vault", relationship: "contained-by", gmOnly: true },
      { id: "cult-of-daemos", relationship: "seeks", gmOnly: true },
      { id: "lanternwick-watch", relationship: "enemy" },
    ],
    parentNodeId: "taproot-vault",
    map: { mapId: "surface-marr-map", layer: "village" },
    region: { type: "box", x: 54, y: 46, width: 9, height: 8 },
    zoomTarget: {
      mapId: "surface-marr-map",
      nodeId: "book-of-souls",
      center: { x: 58, y: 50 },
      scale: 2.4,
    },
    tags: ["relic", "setting-engine", "souls", "memory"],
    hooks: [
      "A villager's name vanishes from every written record except one page beneath the Tree.",
      "A prisoner begs the party to save their name, not their body.",
      "The Book writes a party member's childhood nickname before they reach the vault.",
    ],
    rumors: [
      "Daemos cannot die while his name remains written below.",
      "The Book hates nicknames because they slip between lines.",
      "A page torn from the Book grows roots if buried.",
    ],
    gm: {
      description:
        "The Book is the core setting engine. It converts life-force, memory, and civic identity into power for the Tree and legitimacy for Daemos's rule.",
      notes: [
        "Use the Book to explain missing memories, rewritten records, cult rites, and sudden changes in village loyalty.",
        "Breaking it should release stolen souls, starve the Tree, and destabilize Marr.",
      ],
      secrets: [
        "The Book is chained in the Taproot Vault.",
        "Each prisoner in the cages appears as a wet line of ink. When the line dries, the prisoner is spiritually spent.",
        "Daemos's title renews itself through the Book; killing the current lord is temporary unless the ledger is broken.",
      ],
      statBlocks: [
        {
          id: "book-engine",
          name: "The Book of Souls",
          system: "system-neutral",
          role: "Soul-harvesting ledger",
          instincts: ["Record possession", "Consume names", "Reward lawful cruelty"],
          abilities: ["Erase a relationship", "Empower Daemos's decrees", "Bind a dying soul to a root"],
          weaknesses: ["Unrecorded names", "Freed prisoners", "Pages read aloud by someone who loves the victim"],
        },
      ],
    },
  },
  {
    id: "cult-of-daemos",
    title: "The Cult of Daemos",
    shortLabel: "Daemos Cult",
    category: "faction",
    playerSummary:
      "A hidden civic religion that turns loyalty, guilt, and ambition into quiet obedience.",
    playerDescription:
      "No one admits the Cult of Daemos exists. Still, red thread appears around door handles after accusations. Neighbors forget old kindnesses. Desperate people receive help, then become useful in ways they cannot explain.",
    sensoryDetails: [
      "Red thread knots around wrists, locks, and tongue-shaped charms.",
      "Cult prayers sound like legal testimony recited in sleep.",
      "Their meeting rooms smell of wax, damp wool, and bruised flowers.",
    ],
    related: [
      { id: "hanging-cages", relationship: "guards", gmOnly: true },
      { id: "book-of-souls", relationship: "seeks", gmOnly: true },
      { id: "black-sap-market", relationship: "ally", gmOnly: true },
      { id: "lanternwick-watch", relationship: "enemy" },
      { id: "brindlecross-market", relationship: "seeks" },
    ],
    map: { mapId: "surface-marr-map", layer: "village" },
    region: { type: "box", x: 64, y: 27, width: 13, height: 10 },
    zoomTarget: {
      mapId: "surface-marr-map",
      nodeId: "cult-of-daemos",
      center: { x: 70, y: 32 },
      scale: 2.1,
    },
    tags: ["faction", "coercion", "memory", "social-control"],
    hooks: [
      "A grateful family turns hostile overnight after receiving cult charity.",
      "A cult rite requires the party to willingly forget one kindness done to them.",
      "A red-thread list names every person who spoke against a hanging.",
    ],
    rumors: [
      "The cult can make a mother forget which child is hers.",
      "Daemos hears prayers tied with red thread.",
      "People who accept cult bread stop dreaming of escape.",
    ],
    gm: {
      description:
        "The cult is Daemos's social machinery. It identifies useful fears, edits memory through small rites, and turns the village against anyone who threatens the cages or Book.",
      notes: [
        "Play cultists as purposeful neighbors, not cartoon villains.",
        "Their best weapon is coercive care: debt relief, food, protection, and public forgiveness.",
      ],
      secrets: [
        "The cult feeds selected memories to the Book to change what communities desire or tolerate.",
        "Cult rites work better when victims consent under pressure.",
      ],
      statBlocks: [
        {
          id: "red-thread-confessor",
          name: "Red-Thread Confessor",
          system: "nsr",
          role: "Memory corrupter",
          instincts: ["Offer help with a hook in it", "Make guilt useful", "Separate friends politely"],
          abilities: ["Rite of shared blame", "Red thread geas", "Knows one secret recently confessed"],
          weaknesses: ["Public contradiction", "Uncoerced forgiveness", "A victim naming what was taken"],
        },
      ],
    },
  },
  {
    id: "brindlecross-market",
    title: "Brindlecross Market",
    shortLabel: "Market",
    category: "district",
    playerSummary:
      "A cramped village market beneath root-arches, where hunger, gossip, and forbidden trade meet.",
    playerDescription:
      "Brindlecross Market is where Marr pretends to be normal. Fish, turnips, lamp oil, cage charms, and patched boots change hands under the Tree's shadow. People haggle loudly so no one hears what is traded quietly.",
    sensoryDetails: [
      "Boiled roots, sour beer, wet rope, and cheap incense.",
      "A bell rings whenever a new cage sentence is posted.",
      "Merchants glance upward before naming a price.",
    ],
    related: [
      { id: "black-sap-market", relationship: "route-to" },
      { id: "cult-of-daemos", relationship: "seeks" },
      { id: "hanging-cages", relationship: "mentions" },
      { id: "lanternwick-watch", relationship: "route-to" },
    ],
    map: { mapId: "surface-marr-map", layer: "village" },
    region: { type: "box", x: 25, y: 54, width: 14, height: 12 },
    zoomTarget: {
      mapId: "surface-marr-map",
      nodeId: "brindlecross-market",
      center: { x: 32, y: 60 },
      scale: 2.15,
    },
    tags: ["village", "trade", "rumors", "starting-hub"],
    hooks: [
      "A cage charm seller recognizes a party member's face from a charm made yesterday.",
      "A trader offers a map to UndaMarr in exchange for a message delivered to a prisoner.",
      "Cult debt collectors quietly close every stall owned by one family.",
    ],
    rumors: [
      "A route below the pickle stall leads to the black-sap traders.",
      "The market bell rings once for law, twice for death, and three times for Daemos.",
      "Someone is buying old lullabies by the verse.",
    ],
    gm: {
      description:
        "The market is the best first hub: rumors, supplies, cult pressure, and routes to UndaMarr all pass through it.",
      notes: [
        "Use market stalls as fast information menus: food, charms, gossip, and black-market routes.",
        "The Cult of Daemos controls enough debt here to steer public mood.",
      ],
      secrets: [
        "A quiet exchange handles cage messages and UndaMarr goods.",
        "One stall scale is calibrated to weigh memories sold at the Black Sap Market.",
      ],
    },
  },
  {
    id: "lanternwick-watch",
    title: "Lanternwick Watch Shrine",
    shortLabel: "Watch Shrine",
    category: "landmark",
    playerSummary:
      "A low shrine and watch post where lanterns burn for the missing and condemned.",
    playerDescription:
      "Lanternwick Watch Shrine is built around a dry stone well and a leaning watch platform. Families leave lanterns for prisoners in the cages, travelers, and loved ones whose names have begun to fade.",
    sensoryDetails: [
      "Cold ash, well-stone, tallow smoke, and rainwater.",
      "Lantern flames bend toward the Tree.",
      "The watch bell is wrapped in cloth so it cannot ring by accident.",
    ],
    related: [
      { id: "book-of-souls", relationship: "enemy", gmOnly: true },
      { id: "cult-of-daemos", relationship: "enemy" },
      { id: "brindlecross-market", relationship: "route-to" },
      { id: "hanging-cages", relationship: "mentions" },
    ],
    map: { mapId: "surface-marr-map", layer: "village" },
    region: { type: "box", x: 59, y: 63, width: 13, height: 10 },
    zoomTarget: {
      mapId: "surface-marr-map",
      nodeId: "lanternwick-watch",
      center: { x: 65, y: 68 },
      scale: 2.15,
    },
    tags: ["village", "shrine", "watch-post", "memory"],
    hooks: [
      "A lantern marked with a living villager's name goes out at noon.",
      "The shrine keeper asks the party to carry a hidden name to someone in the cages.",
      "The dry well repeats a secret the party has not spoken yet.",
    ],
    rumors: [
      "Names spoken at the shrine last longer in dreams.",
      "The watch bell rang once by itself on the night Daemos took power.",
      "The well is dry because the Tree drinks first.",
    ],
    gm: {
      description:
        "The shrine is one of the few places where stolen names resist the Book for a little while.",
      notes: [
        "Use the shrine for mercy, mourning, and grounded village stakes.",
        "It can give players a temporary anti-Book tool without solving the whole campaign.",
      ],
      secrets: [
        "A name spoken into the dry well cannot be erased for one night.",
        "The cult wants the well capped with Tree roots.",
      ],
    },
  },
  {
    id: "black-sap-market",
    title: "Black Sap Market",
    shortLabel: "Sap Market",
    category: "district",
    playerSummary:
      "An under-root trade hollow where memories, prison favors, and forbidden supplies change hands.",
    playerDescription:
      "The Black Sap Market gathers beside a dark, slow seep beneath Marr. No one calls prices. Buyers whisper offers into clay cups; sellers answer by floating tokens across the sap.",
    sensoryDetails: [
      "Black sap moves like oil over muscle.",
      "Fungal lanterns glow blue-green through damp cloth.",
      "Coins come away sticky and warm.",
    ],
    related: [
      { id: "brindlecross-market", relationship: "route-to" },
      { id: "white-root-tangles", relationship: "route-to" },
      { id: "cult-of-daemos", relationship: "ally", gmOnly: true },
      { id: "book-of-souls", relationship: "mentions", gmOnly: true },
    ],
    map: { mapId: "undamarr-root-map", layer: "underground" },
    region: { type: "box", x: 24, y: 53, width: 18, height: 13 },
    zoomTarget: {
      mapId: "undamarr-root-map",
      nodeId: "black-sap-market",
      center: { x: 33, y: 60 },
      scale: 2.05,
    },
    tags: ["undamarr", "trade", "memory", "black-sap"],
    hooks: [
      "A cage key is for sale, but the price is the buyer's memory of a safe home.",
      "A broker offers proof that Daemos bought a public betrayal in advance.",
      "Someone sells a party member's name before the party arrives.",
    ],
    rumors: [
      "You can buy back a forgotten face if you know what it feared.",
      "The cult pays double for memories of kindness.",
      "The sap refuses counterfeit coins but accepts lies.",
    ],
    gm: {
      description:
        "This is the trade area of UndaMarr and the bridge between village survival, smugglers, cult agents, and root guides.",
      notes: [
        "Every deal should solve one problem and create one pressure.",
        "Use it to sell risky tools, rumors, routes, false papers, cage keys, and memory bargains.",
      ],
      secrets: [
        "The cult buys memories of rebellion here before public crackdowns.",
        "A hidden toll records who enters and sells that list to Daemos twice a month.",
      ],
      statBlocks: [
        {
          id: "memory-broker",
          name: "Memory Broker",
          system: "nsr",
          role: "Under-market fixer",
          instincts: ["Keep the deal moving", "Never own the danger", "Buy grief cheaply"],
          abilities: ["Appraise a memory", "Produce a forbidden route", "Summon three quiet guards"],
          weaknesses: ["Unique childhood memories", "Unpaid cage debts"],
        },
      ],
    },
  },
  {
    id: "white-root-tangles",
    title: "White Root Tangles",
    shortLabel: "Tangles",
    category: "hazard",
    playerSummary:
      "A living root passage that opens for need, closes for violence, and remembers fear.",
    playerDescription:
      "The White Root Tangles are narrow corridors of pale feeder roots. They flex around lantern light and shift when people argue. Travelers mark turns with songs because chalk lines are swallowed.",
    sensoryDetails: [
      "The walls are soft, cold, and faintly breathing.",
      "Voices return a heartbeat late.",
      "The air tastes of milk, chalk, and buried teeth.",
    ],
    related: [
      { id: "black-sap-market", relationship: "route-to" },
      { id: "taproot-vault", relationship: "route-to" },
      { id: "tree-of-marr", relationship: "contained-by" },
      { id: "book-of-souls", relationship: "route-to", gmOnly: true },
    ],
    map: { mapId: "undamarr-root-map", layer: "underground" },
    region: {
      type: "polygon",
      points: [
        { x: 61, y: 49 },
        { x: 78, y: 52 },
        { x: 82, y: 69 },
        { x: 69, y: 75 },
        { x: 58, y: 65 },
      ],
    },
    zoomTarget: {
      mapId: "undamarr-root-map",
      nodeId: "white-root-tangles",
      center: { x: 69, y: 61 },
      scale: 2,
    },
    tags: ["undamarr", "root-passage", "living-corridor", "hazard"],
    hooks: [
      "A child returns from the Tangles with an adult's missing memory.",
      "The shortest route to the Book requires singing a prison song backwards.",
      "A root opens like a mouth and speaks a name crossed out of the village records.",
    ],
    rumors: [
      "The Tangles open for lullabies and close around knives.",
      "If you mark the wall, the wall marks you back.",
      "Daemos's guards avoid one white corridor and pretend not to see it.",
    ],
    gm: {
      description:
        "The Tangles are UndaMarr's living corridor. They can connect any root location if fed the right emotional key.",
      notes: [
        "Use the Tangles as a dungeon hallway that reacts to play, not as a random maze.",
        "Useful keys: lullaby, confessed fear, remembered name, blood from a cage chain.",
      ],
      secrets: [
        "The Tangles carry stolen life-force from cages to the Book.",
        "They can be persuaded to starve the Book for one night.",
      ],
      statBlocks: [
        {
          id: "pale-root-snare",
          name: "Pale Root Snare",
          system: "nsr",
          role: "Living corridor hazard",
          instincts: ["Separate the fearful", "Seal around drawn blades", "Mimic a loved voice"],
          abilities: ["Close a passage", "Steal one spoken direction", "Show a false exit"],
          weaknesses: ["Lullabies", "Protected names", "Iron warmed by living hands"],
        },
      ],
    },
  },
  {
    id: "taproot-vault",
    title: "Taproot Vault",
    shortLabel: "Taproot",
    category: "dungeon",
    parentNodeId: "tree-of-marr",
    playerSummary:
      "A sealed chamber knotted in the deepest roots, where hidden power makes the Tree tremble.",
    playerDescription:
      "The Taproot Vault lies below the roots where the air turns hot and mineral-dry. A basalt door without hinges is wrapped in living wood. Every sound near it becomes quieter than it should be.",
    sensoryDetails: [
      "Hot stone under wet roots.",
      "A heartbeat heard through the floor.",
      "Dust that tastes like old coins.",
    ],
    related: [
      { id: "tree-of-marr", relationship: "contained-by" },
      { id: "book-of-souls", relationship: "contains", gmOnly: true },
      { id: "white-root-tangles", relationship: "route-to" },
      { id: "cult-of-daemos", relationship: "seeks", gmOnly: true },
    ],
    childNodeIds: ["book-of-souls"],
    map: { mapId: "undamarr-root-map", layer: "underground" },
    region: { type: "box", x: 42, y: 30, width: 15, height: 15 },
    zoomTarget: {
      mapId: "undamarr-root-map",
      nodeId: "taproot-vault",
      center: { x: 50, y: 38 },
      scale: 2.25,
    },
    tags: ["undamarr", "hidden-power", "dungeon", "book-of-souls"],
    hooks: [
      "A black stone key warms when a prisoner above speaks the party's name.",
      "The Vault door asks for a name no one in Marr remembers.",
      "A cult procession descends with a living prisoner and no lanterns.",
    ],
    rumors: [
      "The deepest root grows around a door, not a stone.",
      "Daemos visits the roots only when the cages are full.",
      "The Vault can make a dead lord legal again.",
    ],
    gm: {
      description:
        "This is the dangerous secret place of UndaMarr: the buried chamber containing the Book and the lever that can change Marr's power structure.",
      notes: [
        "Use the Vault as the first major campaign objective or a terrible place reached too early.",
        "Opening it should reshape cult behavior immediately.",
      ],
      secrets: [
        "The Book of Souls is chained inside the Vault, not merely stored there.",
        "The Vault can transfer the Tree's loyalty, starve it, or wake something older under Marr.",
      ],
      statBlocks: [
        {
          id: "taproot-ward",
          name: "Taproot Ward",
          system: "nsr",
          role: "Mythic lock and guardian pressure",
          instincts: ["Demand a true name", "Punish theft", "Protect the Book"],
          abilities: ["Seal exits with roots", "Age metal to rust", "Speak in the voice of a prisoner"],
          weaknesses: ["A freed cage chain", "A protected name", "The Book writing against itself"],
        },
      ],
    },
  },
];

export const marrContent = {
  nodes: marrNodes,
  maps: [
    {
      id: "surface-marr-map",
      title: "Surface Marr Map",
      shortLabel: "Surface",
      description:
        "The public layer of Marr: the Tree, its cages, the village commons, and the visible edges of Daemos's rule.",
      defaultLayer: "surface",
      layers: [
        { id: "surface", title: "Tree and paths", visibleByDefault: true },
        { id: "canopy", title: "Canopy and cages" },
        { id: "village", title: "Village detail" },
        { id: "gm", title: "GM overlays", gmOnly: true },
      ],
      nodeIds: [
        "tree-of-marr",
        "hanging-cages",
        "book-of-souls",
        "cult-of-daemos",
        "brindlecross-market",
        "lanternwick-watch",
      ],
      bounds: { width: 100, height: 100 },
    },
    {
      id: "undamarr-root-map",
      title: "UndaMarr Root Map",
      shortLabel: "UndaMarr",
      description:
        "The first descent beneath Marr, where roots carry trade, memory, and hidden power below Daemos's city.",
      defaultLayer: "underground",
      layers: [
        { id: "underground", title: "Root caverns", visibleByDefault: true },
        { id: "gm", title: "GM overlays", gmOnly: true },
      ],
      nodeIds: ["black-sap-market", "white-root-tangles", "taproot-vault"],
      bounds: { width: 100, height: 100 },
    },
  ],
  areas: [
    {
      id: "surface-marr",
      title: "Surface Marr",
      shortLabel: "Surface",
      subtitle: "The Tree, the cages, and the village under Daemos's shadow",
      description:
        "Surface Marr is the visible campaign layer: a fearful village organized around the Tree, public punishment, coerced trade, and edited memory.",
      mapId: "surface-marr-map",
      nodeIds: [
        "tree-of-marr",
        "hanging-cages",
        "book-of-souls",
        "cult-of-daemos",
        "brindlecross-market",
        "lanternwick-watch",
      ],
      childAreaIds: ["undamarr"],
      tags: ["surface", "village", "daemos"],
    },
    {
      id: "undamarr",
      title: "UndaMarr",
      shortLabel: "Below",
      subtitle: "Root corridors, black-sap trade, and the hidden engine of rule",
      description:
        "UndaMarr is the root-world below Marr: a dangerous understructure where commerce, stolen memory, and Daemos's true power meet.",
      mapId: "undamarr-root-map",
      nodeIds: ["black-sap-market", "white-root-tangles", "taproot-vault"],
      parentAreaId: "surface-marr",
      tags: ["underground", "root", "book-of-souls"],
    },
  ],
  lore: [
    {
      id: "lore-soul-harvest",
      title: "The Soul Harvest",
      summary: "The cages, Tree, Book, and Daemos form one oppressive engine.",
      body:
        "Marr's tyranny is not only political. Public punishment creates fear, fear isolates prisoners, and the Book converts their life-force and civic identity into power. The Tree is the visible monument; the Book is the machine.",
      nodeIds: ["tree-of-marr", "hanging-cages", "book-of-souls", "taproot-vault"],
      tags: ["souls", "daemos", "setting-engine"],
      gm: {
        secrets: [
          "Breaking any one part of the engine creates consequences but not victory. Lasting change requires disrupting the harvest cycle.",
        ],
      },
    },
    {
      id: "lore-memory-as-law",
      title: "Memory as Law",
      summary: "Daemos rules by changing what people remember wanting.",
      body:
        "The Cult of Daemos does not simply spread doctrine. It edits guilt, gratitude, and social obligation until oppression feels like order.",
      nodeIds: ["cult-of-daemos", "book-of-souls", "lanternwick-watch"],
      tags: ["cult", "memory", "law"],
      gm: {
        secrets: ["A community can be freed temporarily by restoring one shared memory in public."],
      },
    },
  ],
  factions: [
    {
      nodeId: "cult-of-daemos",
      alignment: "Order through coerced consent",
      publicFace: "Charity, confession, mediation, debt relief, and civic calm.",
      wants: [
        "Keep the soul harvest accepted as law",
        "Identify threats before they become public",
        "Steer memory and desire toward obedience",
      ],
      methods: ["Red-thread rites", "Debt relief", "Confession", "Targeted memory distortion"],
      rivals: ["lanternwick-watch"],
      allies: ["black-sap-market"],
    },
  ],
  npcs: [],
  items: [
    {
      nodeId: "book-of-souls",
      itemType: "relic",
      properties: ["Consumes prisoner life-force", "Rewrites memory and civic identity", "Renews Daemos's rule"],
    },
  ],
  gmAnnotations: [
    {
      id: "gm-harvest-loop",
      areaId: "surface-marr",
      title: "The Harvest Loop",
      body:
        "Cages create public fear. The Book consumes prisoner life-force and memory. The Tree converts the harvest into authority and supernatural pressure. Daemos uses that authority to keep the cages full.",
      priority: "high",
      tags: ["setting-engine", "daemos"],
    },
    {
      id: "gm-opening-pressure",
      areaId: "surface-marr",
      title: "Opening Pressure",
      body:
        "Start in Brindlecross during a cage sentence. Offer three directions: rescue the prisoner, investigate a vanished name, or follow a market route below.",
      priority: "medium",
      tags: ["session-start"],
    },
    {
      id: "gm-undamarr-purpose",
      mapId: "undamarr-root-map",
      title: "UndaMarr Purpose",
      body:
        "UndaMarr is not a separate dungeon zone; it is the hidden infrastructure that makes surface oppression work.",
      priority: "high",
      tags: ["undamarr", "tone"],
    },
  ],
} satisfies GazetteerContent;

assertValidGazetteerContent(marrContent);

export const campaignAreas = marrContent.areas;
export const campaignMaps = marrContent.maps;
export const allNodes = marrContent.nodes;

export function findNode(id: string) {
  return marrContent.nodes.find((node) => node.id === id);
}
