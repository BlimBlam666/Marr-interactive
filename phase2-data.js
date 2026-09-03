/* Phase 2 player-safe expansion: four regions, public routes, indexes, and field entries. */
(() => {
  "use strict";
  const atlas = window.MARR_ATLAS;
  if (!atlas || atlas.phase2) return;

  const S = (name, line, ...traits) => ({ name, line, traits });
  const E = (id, name, type, x, y, description, facts, stat, wares = [], aliases = []) => ({
    id,
    name,
    type,
    x,
    y,
    description,
    facts,
    stat,
    wares,
    aliases,
  });
  const D = (id, layer, marker, name, short, subtitle, icon, x, y, description, facts, entries, aliases = []) => ({
    id,
    layer,
    marker,
    name,
    short,
    subtitle,
    icon,
    x,
    y,
    regionX: x,
    regionY: y,
    image: `/maps/${id}.webp`,
    alt: `Detailed parchment fantasy map of ${name}`,
    description,
    facts,
    entries,
    aliases,
  });

  const layerNames = {
    marr: "Marr Proper",
    undamarr: "UndaMarr",
    roots: "The Roots",
    surface: "Surface & Borderlands",
  };

  atlas.destinations.forEach((destination) => {
    destination.layer = "marr";
    destination.regionX = destination.x;
    destination.regionY = destination.y;
    destination.aliases = destination.aliases || [];
  });

  const expandedDestinations = [
    D(
      "ash-cathedral",
      "undamarr",
      9,
      "Ash Cathedral District",
      "The ordered heart below",
      "Ash, bells, masks, and the unending measure of song",
      "♜",
      50,
      20,
      "The Cathedral district governs UndaMarr by procession, record, and ritual. Burnt incense coats the tongue. Even between services, a low choral note trembles through the paving stones.",
      [
        "Public rites are posted at the Processional Court each dawn.",
        "Weapons must be bound before entering the nave.",
        "Unlicensed songs may be surrendered at the Confiscation House without immediate charge.",
      ],
      [
        E("processional-court", "Processional Court", "Civic square", 50, 18, "Black-glass lamps border a broad ash-striped square. Officials read edicts from a barkwood dais while petitioners wait behind white cords.", ["A current edict copy costs 1 gp.", "Crossing against a procession raises Pressure by 1."], S("Ash Marshal", "6 HP, 2 Armor, 12 STR, 11 DEX, 14 WIL, staff (d8)", "Directs crowds before using force.", "A whistle summons a Disciple detachment in two rounds.")),
        E("cathedral-nave", "Ash Cathedral Nave", "Public temple", 50, 42, "A forest of stone ribs surrounds the distant Book of Souls. The congregation stands; the Choir sings behind a smoked-glass screen.", ["A quiet vigil and water restore HP.", "Speaking over the Choir requires a WIL save."], S("Cathedral Resonance", "Site • WIL save • failure: 1 Fatigue", "Wax earplugs make the save unnecessary but prevent whispered speech.", "Counter-song draws immediate attention.")),
        E("choir-gate", "Choir Gate", "Guarded threshold", 76, 42, "A bronze lattice shaped like interlocking mouths separates the public ambulatory from the singers’ passage.", ["Visitors may leave written requests with the gate clerk.", "The current soloist list is publicly posted."], S("Choir Gate Detail", "6 HP, 2 Armor, 12 STR, 12 DEX, 13 WIL, glaives (d10), detachment", "Closes the bronze lattice when a note breaks.", "Will protect fleeing civilians before pursuing an intruder.")),
        E("confiscation-house", "Confiscation House", "Public office", 24, 57, "Shelves of sealed instruments, copied lyrics, and numbered ash jars stand behind a long receiving counter.", ["A surrendered object receives a claim token.", "Public records name the item, owner, and stated reason."], S("Receiving Clerk", "3 HP, 9 STR, 11 DEX, 14 WIL, seal press (d4)", "Knows licensed songs and current prohibitions.", "Shutters the record shelves at the first sign of fire.")),
        E("cantors-balcony", "Cantor’s Balcony", "Public address", 50, 76, "A high stone balcony overlooks the district. High Cantor Vraeg appears there masked in black glass to announce rites and closures.", ["Announcements carry throughout the district.", "The balcony stair opens only during public audiences."], S("High Cantor Vraeg", "8 HP, 2 Armor, 11 STR, 12 DEX, 16 WIL, ash crozier (d8 WIL)", "Commands through exact ritual language.", "Critical Damage: the target cannot speak above a whisper until they rest.")),
      ],
      ["cathedral", "book of souls", "ash choir", "vraeg"]
    ),
    D(
      "lantern-ward",
      "undamarr",
      10,
      "Lantern Ward",
      "Trade under watched light",
      "Markets, guides, inns, and safe roads sold one favor at a time",
      "✦",
      22,
      48,
      "UndaMarr pretends to breathe freely here. Traders call prices beneath colored lanterns; guides sell routes; every crowded table has one listener too many.",
      ["Green lanterns mark licensed guides.", "A shuttered amber lamp means a route is temporarily unsafe.", "Songs are traded by fragment, never complete in public."],
      [
        E("split-lantern-market", "Split Lantern Market", "Night market", 47, 22, "Canvas stalls crowd around a lantern cracked neatly in two. Root-spice, lamp glass, surface grain, and small legal comforts change hands.", ["Market hours begin at the evening bell.", "Common provisions use Marr Proper prices."], S("Market Crowd", "7 HP, 10 STR, 10 DEX, 11 WIL, rush (d8 blast), detachment", "Opens a lane for healers and fire crews.", "Critical Damage: traders scatter and close for the watch."), [["Ash-bread, 3 uses", "6 gp"], ["Bell-oil, 3 uses", "10 gp"], ["Root-ink vial", "5 gp"]], ["ash bread"]),
        E("guide-row", "Guide Row", "Route brokers", 24, 43, "Painted walking sticks advertise routes by colored bands. Prices buy time, risk, and silence—not miles.", ["Public route: 5 gp per day.", "Unwatched route: 20 gp or a favor."], S("Lira Thimbleleaf", "5 HP, 10 STR, 14 DEX, 15 WIL, knife (d6)", "Knows lantern signals and song-fragment cant.", "Breaks contact rather than endanger a safe route.")),
        E("crooked-wick", "The Crooked Wick", "Inn", 72, 39, "A bent chimney and seven mismatched lamps mark a warm, narrow inn. Travelers share tables by route rather than status.", ["Bed, meal, and locker: 10 gp.", "A private cellar table costs 10 gp per turn."], S("Hobb Wick, Innkeeper", "4 HP, 11 STR, 10 DEX, 14 WIL, poker (d6)", "Remembers who arrived together.", "Keeps three exits clear at all times.")),
        E("fragment-alley", "Song-Fragment Alley", "Public lane", 73, 66, "Buskers perform single verses, altered refrains, and wordless melodies beneath laundry lines. No one completes another singer’s tune.", ["A fragment costs 1–5 gp or another fragment.", "Performing a prohibited verse may raise Pressure."], S("Contraband Refrain", "Rite • full turn • WIL save", "Success reduces Pressure by 1 in near distance.", "Failure draws a faction encounter.")),
        E("trade-ramp", "Surface Trade Ramp", "Vertical route", 27, 78, "A broad corkscrew ramp climbs toward warehouses and daylight. Mule bells are wrapped in cloth before descent.", ["One exploration turn reaches the surface staging house.", "Cargo toll: 1 gp per bulky slot."], S("Ramp Traffic", "Hazard • DEX save • collision: d6 STR", "Walking the marked edge avoids the save.", "A stalled wagon raises local Pressure by 1.")),
      ],
      ["market", "guides", "smugglers", "lira"]
    ),
    D(
      "vault-echoes",
      "undamarr",
      11,
      "Vault of Echoes",
      "Memory kept as resonance",
      "Whispers stop when acknowledged; sealed years hum behind stone",
      "◌",
      78,
      47,
      "The Archivist Quarter stores testimony in tuned stone, wire, and hollow roots. Visitors speak softly because every surface may already be holding a voice.",
      ["Public echoes may be heard by appointment.", "Copies are transcriptions, never perfect reproductions.", "Red seals mark material unavailable to ordinary visitors."],
      [
        E("resonance-hall", "Resonance Hall", "Archive nave", 50, 20, "Bronze wires cross a high chamber like a frozen harp. A requested voice travels down one wire into a listening bowl.", ["One public hearing: 5 gp.", "Save WIL if the memory concerns your own past."], S("Resonant Echo", "4 HP, 6 STR, 13 DEX, 15 WIL, remembered grief (d6 WIL)", "Cannot leave its tuned bowl unless disturbed.", "Critical Damage: the listener adds 1 Fatigue.")),
        E("public-echo-desk", "Public Echo Desk", "Archive service", 25, 43, "Archivists take names, dates, and the exact question sought. Imprecise requests are returned for revision.", ["Scholar: 20 gp per day.", "A search takes one exploration turn."], S("Archivist Meira Quill", "3 HP, 8 STR, 11 DEX, 16 WIL, tuning fork (d4)", "Distinguishes a copied echo from an original.", "Will refuse access rather than pretend certainty.")),
        E("sealed-year-doors", "Sealed-Year Doors", "Restricted archive", 76, 42, "Seven stone doors bear years but no handles. Each vibrates at a different pitch when approached.", ["The seals and closure dates are public.", "Touching a door requires a WIL save or momentary disorientation."], S("Sealed Resonance", "Site • WIL save • failure: lose the next spoken sentence", "A partner may repeat the lost words afterward.", "Forcing a seal raises Pressure by 2.")),
        E("archive-lift", "Archive Lift", "Public route", 26, 72, "A counterweighted cage moves between Lantern Ward and the upper archive landings. Travelers face outward and remain silent while it moves.", ["Fare: 1 gp.", "One turn covers the full ascent or descent."], S("Echo Lift", "Device • DEX save if overloaded • fall: d10 STR", "The operator refuses more than six travelers.", "A brass brake can halt it from inside.")),
        E("tuning-court", "Tuning Court", "Public garden", 73, 75, "Stone chimes and shallow water basins allow archivists to clear stray resonance from clothing and tools.", ["Ten quiet minutes restore HP.", "A tuning wash costs 2 gp."], S("Tuning Wash", "Procedure • one turn", "Removes one harmless echo or repeated phrase.", "Cannot erase a memory or magical affliction.")),
      ],
      ["archives", "echo archivists", "memory archive"]
    ),
    D(
      "bellfall",
      "undamarr",
      12,
      "Bellfall District",
      "The broken ring",
      "Collapsed towers and streets where sound chooses strange paths",
      "◉",
      50,
      80,
      "Cracked bells lie where they fell generations ago. Some lanes swallow footsteps; others carry a whisper across the district. Salvagers work by hand signal when the stone begins to hum.",
      ["Bell fragments must be registered before sale.", "Unsafe lanes are marked with crossed white chalk.", "No public tolling is permitted."],
      [
        E("broken-ring", "The Broken Ring", "Collapsed plaza", 50, 22, "A circular street ends beneath three fallen bell frames. Rainwater gathers in their bronze mouths.", ["A careful circuit takes one turn.", "Loud impact calls for a Die of Fate; on 1, Pressure rises by 1."], S("Unstable Bellframe", "Hazard • DEX save • collapse: d8 STR", "Chalked safe lanes remove the save.", "Metal tools make the save impaired.")),
        E("bellwright-yard", "Bellwright’s Yard", "Repair court", 25, 48, "Wooden molds, bronze patches, rope, and tuning sand surround a roofless workshop.", ["Bell repair: 20 gp per day.", "A fragment appraisal costs 5 gp."], S("Nera Toll, Bellwright", "4 HP, 12 STR, 12 DEX, 14 WIL, hammer (d8)", "Can name a bell’s pitch from one tap.", "Will not ring an unknown fragment indoors.")),
        E("dream-toll-steps", "Dream-Toll Steps", "Resonance site", 76, 45, "A stair climbs nowhere, ending at a socket where a tower once stood. Sleepers nearby report the same distant toll.", ["Rest here does not restore HP.", "A WIL save permits a clear dream without Fatigue."], S("Dream Toll", "Omen • WIL save • failure: 1 Fatigue", "Success reveals one known route in symbolic form.", "Bell relics warm on the third step.")),
        E("sky-shaft", "Cracked Sky-Shaft", "Surface route", 72, 75, "A jagged chimney reveals a blue coin of sky. Iron staples and old scaffolds climb toward the Bell Tower Ruin.", ["Climb: one turn and a DEX save.", "A rope makes ordinary travel safe."], S("Sky-Shaft Climb", "Journey • DEX save • fall: d8 STR", "Bulky armor makes the save impaired.", "Loose stone alerts both ends of the route.")),
        E("salvage-shelter", "Salvagers’ Shelter", "Public refuge", 27, 76, "A reinforced shed holds stretchers, chalk, water, and a district map corrected in many hands.", ["Water and a safe rest restore HP.", "Current closures may be copied freely."], S("Bellfall Salvagers", "6 HP, 1 Armor, 12 STR, 12 DEX, 11 WIL, picks (d8), detachment", "Rescue trapped people before preserving finds.", "Retreat when the stone hums in two pitches.")),
      ],
      ["broken ring", "bells", "bell-ringers"]
    ),
    D(
      "still-yards",
      "undamarr",
      13,
      "The Still Yards",
      "Homes beneath silence edicts",
      "Gesture, footfall, and illegal lullabies carry ordinary life",
      "□",
      18,
      80,
      "Low dwellings and shared courtyards fill a district where public song is forbidden. Residents converse with hands, chalk, eyebrow, and patient attention.",
      ["Visitors are expected to learn five courtesy signs.", "Night gatherings use hooded lanterns.", "Children maintain the most accurate lane maps."],
      [
        E("silent-square", "Silent Square", "Residential commons", 50, 20, "A broad court of benches and wash lines. Market prices, warnings, and jokes pass hand to hand without a word.", ["Water and seating restore HP when safe.", "Shouting raises Pressure by 1."], S("Still-Yard Crowd", "6 HP, 10 STR, 11 DEX, 13 WIL, rush (d6 blast), detachment", "Communicates instantly by gesture.", "Scatters through six narrow exits if threatened.")),
        E("gesture-school", "Open-Hand School", "Public school", 25, 44, "Painted hand-shapes cover the walls. Brother Elian teaches travelers enough signs to ask, warn, thank, and refuse.", ["Basic lesson: one turn, free.", "Full local cant: 20 gp per week."], S("Brother Elian", "4 HP, 9 STR, 12 DEX, 16 WIL, staff (d6)", "Communicates through precise gesture and ritual.", "Can calm a willing frightened person after one quiet turn.")),
        E("lullaby-court", "Lullaby Court", "Hidden-in-plain-sight shrine", 75, 43, "Wind passing through drilled roof tiles makes a soft five-note pattern. Parents sit here with sleepless children.", ["The wind-song is not legally classed as performance.", "A full turn here may clear 1 Fatigue once per week."], S("Soothing Air", "Sanctuary • no save", "Rest works only while no one speaks above a whisper.", "Violence ends the effect until dawn.")),
        E("edict-post", "Edict Post", "Public notice", 27, 75, "Fresh ash boards cover older boards without removing them. Patient readers can see the district’s restrictions growing layer by layer.", ["Current edicts may be copied freely.", "Removing a board raises Pressure by 2."], S("Edict Watch Pair", "4 HP, 1 Armor, 11 STR, 11 DEX, 13 WIL, cudgels (d6)", "Records names before making arrests.", "One remains with the post while the other seeks help.")),
        E("forgotten-stair", "Forgotten Stair", "Surface route", 73, 75, "A narrow stair rises behind a communal cistern. Its old destination plaque has been scraped blank.", ["One turn reaches a sealed surface hatch.", "A Still-Yard guide asks a favor rather than coin."], S("Old Stair", "Route • DEX save while carrying bulky gear", "Failure: drop one carried item to the landing below.", "Fresh chalk means the hatch was used this watch.")),
      ],
      ["silent district", "brother elian", "lullabies"]
    ),
    D(
      "whispering-walks",
      "roots",
      14,
      "Whispering Walks",
      "Truth returns in another voice",
      "Glyph-cut bark, looping paths, and names traded for direction",
      "≈",
      22,
      34,
      "Curving passages run through roots thick as towers. Words spoken here settle into bark and return later—sometimes accurately, sometimes with a stranger’s emphasis.",
      ["Chalk lasts one watch before sap covers it.", "A guide or rooted rite prevents the first navigation save.", "Speaking a full name aloud may attract an answer."],
      [
        E("talking-bark", "Talking Bark", "Echo passage", 50, 18, "Thousands of shallow cuts resemble writing until lantern light moves. The bark repeats the last honest sentence spoken nearby.", ["A truth offered here may reduce Pressure by 1.", "A deliberate lie calls for a WIL save."], S("Borrowed Voice", "4 HP, 6 STR, 13 DEX, 15 WIL, echo (d6 WIL)", "Repeats what a target avoids saying.", "Critical Damage: target loses speech for one turn.")),
        E("knot-marker", "Seven-Knot Marker", "Navigation point", 24, 43, "Seven roots braid around a stone peg wrapped in old guide cords.", ["Re-tying the public route cord takes one turn.", "Cutting any cord makes navigation impaired."], S("Root Marker", "Site • WIL save when choosing an unmarked path", "Success reaches the intended linked node.", "Failure reaches a useful but unintended route.")),
        E("name-bargain", "Name-Bargain Hollow", "Spirit court", 75, 42, "A child-sized hollow answers route questions by asking what the traveler is called and who taught them the name.", ["A nickname earns a vague direction.", "A cherished name earns exact passage once."], S("Root-Spirit Child", "5 HP, 8 STR, 14 DEX, 15 WIL, thorn fingers (d6)", "Curious, literal, and unable to keep a gifted name secret.", "Retreats from iron bells.")),
        E("vault-mouth", "Vault Resonance Mouth", "City route", 26, 76, "A smooth stone throat carries archive whispers into the living roots. Bronze handholds descend beside it.", ["One turn reaches the Vault of Echoes.", "Speaking during descent repeats the phrase at the archive end."], S("Resonance Descent", "Journey • WIL save • failure: 1 Fatigue", "Descending in silence removes the save.", "An echo stone grants safe direction.")),
        E("loop-shelter", "Loop Shelter", "Root refuge", 73, 75, "A ring-shaped chamber returns to the same doorway from either direction. Rootwardens leave water in a stone cup.", ["A guarded rest restores HP.", "Sleeping here requires a WIL save or loses one hour."], S("Looping Sleep", "Site • WIL save • failure: time advances one turn", "A watchkeeper prevents the loss.", "Pressure does not rise for resting here once per watch.")),
      ],
      ["whispering ways", "root routes", "echo paths"]
    ),
    D(
      "root-bell-cavern",
      "roots",
      15,
      "Root-Bell Cavern",
      "A buried choir beneath white roots",
      "Cracked bells, bone-pale arches, and a song felt through the soles",
      "◉",
      72,
      28,
      "A cavern the size of a cathedral hangs with bells caught in bone-white roots. Most are broken. None are safely silent.",
      ["A lantern flame leans toward the nearest intact bell.", "Any deliberate toll is a full-turn rite.", "The floor-song can be felt even when ears are covered."],
      [
        E("bell-ossuary", "Bell Ossuary", "Burial gallery", 50, 18, "Small handbells rest beside named bone niches. Several names have been rubbed smooth by generations of touch.", ["Speaking a visible name costs no Pressure.", "Removing a bell raises Pressure by 1."], S("Ossuary Chime", "Omen • WIL save • failure: 1 Fatigue", "A sincere remembrance grants +1 Armor against WIL damage for one turn.", "The chime stops when the bell is returned.")),
        E("choir-shelf", "Buried Choir Shelf", "Resonant tomb", 23, 44, "Root ribs enclose stone seats facing the cavern. A harmony trembles through the seats when someone sits.", ["Listening takes one full turn.", "A WIL save separates one voice from the chorus."], S("Buried Chorus", "7 HP, 14 WIL, harmony (d8 WIL), detachment", "Answers only in sung fragments.", "Critical Damage: listener must sing one remembered line aloud.")),
        E("crack-bell", "The Crack Bell", "Relic site", 76, 42, "A great bell split from lip to shoulder hangs an arm’s length above the ground. Its crack glows faintly near false speech.", ["A lie spoken near it makes the metal warm.", "Striking it advances local Pressure to at least 4."], S("Crack Bell", "Relic • 18 HP, 3 Armor, 17 STR, 4 DEX, 16 WIL", "Mundane attacks are impaired.", "A toll exposes deliberate lies spoken within near distance this turn.")),
        E("ash-descent", "Ash Descent", "City route", 26, 76, "Black dust marks a steep root stair toward the Cathedral sublevels.", ["A public closure seal bars ordinary passage.", "One turn reaches the choir service tunnels."], S("Ash-Sealed Stair", "Barrier • 12 HP, 2 Armor, 15 STR, 5 DEX, 14 WIL", "Forcing it raises Pressure by 2.", "A current choir token opens it once.")),
        E("deep-lip", "Deep Root Lip", "Frontier", 73, 75, "The maintained floor ends at a dark shelf where larger roots vanish downward.", ["Rope, light, rations, and a return contact are required.", "Unlit travel makes navigation saves impaired."], S("Deep-Root Exposure", "Journey • WIL save each watch • failure: 1 Fatigue", "A Rootwarden guide removes the first save.", "Rest requires a defensible lighted camp.")),
      ],
      ["buried choir", "bells", "choir cavern"]
    ),
    D(
      "hollow-spiral",
      "roots",
      16,
      "The Hollow Spiral",
      "A stair wound around missing time",
      "Every turn descends; not every turn arrives in order",
      "↻",
      72,
      72,
      "A root helix curls around an empty black shaft. Travelers glimpse themselves one landing below, moving a heartbeat too early or an hour too late.",
      ["Marking a landing with iron remains reliable for one watch.", "Rushing always raises Pressure by 1.", "The lower prison-root is visible from one public overlook."],
      [
        E("upper-coil", "Upper Coil", "Root route", 50, 18, "Broad steps bear old direction marks to the Whispering Walks and Root-Bell Cavern.", ["Careful travel needs no save.", "Choosing an unmarked shortcut requires WIL."], S("Spiral Navigation", "Journey • WIL save", "Success arrives by the intended route.", "Failure arrives one turn early or late at a linked node.")),
        E("lost-hour", "Lost-Hour Landing", "Time-slip site", 24, 43, "A landing holds wax drippings that are warm on one side and ancient on the other.", ["Rest here never restores HP.", "Waiting one turn may advance or reverse a harmless local clock sign."], S("Lost Hour", "Site • WIL save • failure: add 1 Fatigue", "Success lets the traveler ask how much time passed.", "No effect changes completed faction events.")),
        E("lower-walker", "The Lower Walker", "Recurring echo", 76, 43, "A lantern-bearing silhouette always descends one landing below. It stops when addressed but never turns.", ["Following takes a full turn.", "Its lantern marks the safest immediate step."], S("Lower Walker", "5 HP, 8 STR, 13 DEX, 15 WIL, lantern-shadow (d6 WIL)", "Cannot be overtaken by ordinary movement.", "Vanishes if anyone claims to know its name.")),
        E("prison-overlook", "Prison-Root Overlook", "Public limit", 27, 75, "An iron rail overlooks a vast root wrapped in old chains far below. Warm air rises in slow breaths.", ["The overlook is the end of maintained public travel.", "A WIL save is required to linger alone."], S("Prison-Root Presence", "Site • WIL save • failure: deprived until leaving the Spiral", "Companionship grants fictional advantage.", "No truth about the prison beyond what is visible is stored here.")),
        E("surface-sinkhole", "Surface Sinkhole", "Borderland route", 91, 16, "Daylight filters down a steep cone of roots and grey soil toward the Grey Orchard.", ["A rope makes the climb safe.", "Without one, save DEX or take d6 STR damage."], S("Sinkhole Climb", "Journey • DEX save • fall: d6 STR", "Rain makes the save impaired.", "Fresh fruit scent means the orchard route is open.")),
      ],
      ["time spiral", "prison root", "sinkhole"]
    ),
    D(
      "root-notary",
      "roots",
      17,
      "Root Notary Chamber",
      "Where bargains take root",
      "A sentient knot records the words people wish they had weighed",
      "§",
      23,
      72,
      "A living root-knot fills the chamber like an old judge. Spoken bargains appear as pale script in its bark and remain until fulfilled, released, or overgrown.",
      ["The Notary repeats terms before a bargain binds.", "Witnesses may request a public copy.", "Old agreements are read only by named party or proxy."],
      [
        E("bargain-dais", "Bargain Dais", "Ritual court", 50, 18, "Two rootwood stools face one another beneath a listening hollow. The bark brightens when both parties assent.", ["A simple witnessed bargain costs 5 gp in offerings.", "Ambiguous terms are repeated as questions."], S("Root Notary", "10 HP, 2 Armor, 16 STR, 5 DEX, 17 WIL, binding word (d8 WIL)", "Refuses coercion it can perceive.", "Critical Damage: the aggressor cannot knowingly break their next promise without becoming deprived.")),
        E("contract-wall", "Old Contract Wall", "Public archive", 23, 44, "Visible agreements layer the bark in different hands and centuries. Active lines glow faintly.", ["Public contracts may be read freely.", "A copy takes one turn and parchment."], S("Contract Resonance", "Site • WIL save when searching by memory alone", "Success finds one related public agreement.", "Failure finds a different agreement involving the same name.")),
        E("proxy-booth", "Quiet Trade Proxy Booth", "Brokerage", 76, 43, "A curtained desk lets a masked broker negotiate without revealing a principal’s face.", ["Proxy service: 10 gp.", "Identity escrow: 20 gp."], S("Proxy Sable", "4 HP, 9 STR, 12 DEX, 15 WIL, concealed knife (d6)", "Never promises confidentiality beyond the written terms.", "Withdraws when a client demands an unwitnessed change.")),
        E("unbinding-root", "Unbinding Root", "Petition site", 26, 76, "A thin white root grows through a cracked iron ring. Petitioners tie copies of burdensome oaths to its thorns.", ["A petition takes a full turn.", "Both harm and consent must be named plainly."], S("Unbinding Petition", "Rite • WIL save", "Success reveals the next lawful or moral step toward release.", "Failure still records the petition; Pressure rises by 1.")),
        E("forgotten-rootway", "Forgotten Rootway", "Surface route", 73, 75, "A dry tunnel slopes toward old foundations beside the Processional Road.", ["One turn reaches the Toll House Ruin.", "A guide asks for a named future favor."], S("Dry Rootway", "Journey • DEX save during rain • collapse: d6 STR", "Timber braces remove the save.", "Cart-sized loads cannot pass.")),
      ],
      ["contracts", "bargains", "quiet trade"]
    ),
    D(
      "thistlegrasp",
      "surface",
      18,
      "Thistlegrasp Village",
      "A settlement holding to old songs",
      "Root-bleed fields, stubborn roofs, and melodies no one remembers learning",
      "⌂",
      22,
      55,
      "Thistlegrasp clings to a stony rise south of Marr. Grey roots break the fields after rain. Villagers hum unfamiliar refrains while repairing fences and pretending not to notice.",
      ["The village offers food, shelter, guides, and surface news.", "Field paths change after heavy rain.", "The shrine bell is newer than the shrine foundation."],
      [
        E("root-bleed-fields", "Root-Bleed Fields", "Cropland", 50, 18, "Pale roots push through furrows overnight. Farmers flag new growth with red cloth and harvest around it.", ["Fresh food, 3 uses: 5 gp.", "Cutting a pale root raises local Pressure by 1."], S("Root-Bleed", "Hazard • STR save on contact • failure: deprived for one turn", "Thick gloves avoid the save.", "The root withdraws from clean water.")),
        E("new-shrine", "The New-Old Shrine", "Village shrine", 24, 43, "Fresh timber walls stand on much older stones. The little bell bears tool marks that do not match any village hammer.", ["Travelers may sleep on the floor.", "A public hymn at dusk restores HP."], S("Shrine Keeper Osa", "3 HP, 9 STR, 11 DEX, 14 WIL, handbell (d4)", "Knows every current village name.", "Rings three times for fire, never for strangers.")),
        E("thistle-cup", "The Thistle Cup", "Alehouse", 75, 42, "Purple thistles dry above a stone hearth. Teamsters exchange road conditions over bitter brown ale.", ["Meal, ale, and floor bed: 8 gp.", "Reliable surface rumor: 2 gp or a story."], S("Marn Cup, Host", "5 HP, 12 STR, 10 DEX, 13 WIL, cudgel (d6)", "Can identify a caravan by wheel ruts.", "Refuses to sell a traveler more courage than they can carry.")),
        E("sinkhole-fence", "Sinkhole Fence", "Root boundary", 27, 75, "A ring of leaning posts surrounds a breathing hole among the fields. Lantern Bearers replace the warning cords nightly.", ["The lower route reaches the Whispering Walks after two turns.", "A local guide costs 5 gp per day."], S("Field Sinkhole", "Journey • DEX save • fall: d8 STR", "A rope ladder removes the save.", "After rain, the route closes on a Die of Fate result of 1.")),
        E("pilgrim-stone", "Pilgrim Stone", "Road marker", 73, 76, "A worn standing stone points north to Marr and west to the orchard. Travelers leave one thread before choosing a road.", ["The Marr road takes one surface watch.", "A fresh black thread warns of patrols."], S("Road Omen", "Site • Die of Fate", "1–2: weather worsens; 3–4: no change; 5–6: meet helpful travelers.", "Leaving a truthful route note improves the next traveler’s result by 1.")),
      ],
      ["surface village", "thistle", "root bleed"]
    ),
    D(
      "bell-tower-ruin",
      "surface",
      19,
      "Bell Tower Ruin",
      "The shattered origin of the Ash Bell",
      "Wind through broken stone makes a toll too low to hear",
      "♜",
      72,
      25,
      "Half a tower stands on a treeless ridge. Its bell lies split in the grass, while mismatched repairs climb the remaining wall like a desperate wooden vine.",
      ["The ruin is visible from the Processional Road.", "Salvage permits are posted at Root Gate.", "No one agrees who keeps repairing the scaffold."],
      [
        E("shattered-bell", "Shattered Bell", "Great relic", 50, 18, "Two immense bronze halves lie lip-down in the grass. Rain striking them sounds like distant footsteps.", ["A fragment appraisal requires a bellwright.", "Striking either half raises Pressure to at least 4."], S("Shattered Bell", "Relic • 20 HP, 3 Armor, 18 STR, 2 DEX, 16 WIL", "Mundane attacks are impaired.", "A deliberate toll makes hidden writing visible within near distance for one turn.")),
        E("repair-scaffold", "Repair Scaffold", "Climbing works", 23, 43, "New rope joins old timber, neither built to the same plan. Tool marks show several hands working at different times.", ["A DEX save is required above the second level.", "A safety line removes the save."], S("Unmatched Scaffold", "Hazard • DEX save • fall: d8 STR", "Cutting one brace makes the next save impaired.", "The highest platform overlooks Bellfall’s sky-shaft.")),
        E("hero-step", "The Hero Step", "Old monument", 76, 42, "Three worn footprints mark a broad stone before the tower door. Travelers place their own feet inside them before difficult vows.", ["A sincere vow grants +1 Armor against WIL damage for one watch.", "Breaking the vow leaves the character deprived until amends."], S("Heroic Vow", "Rite • full turn • no roll", "State one concrete act and one limit.", "The benefit ends when the act is complete.")),
        E("fallen-belfry", "Fallen Belfry", "Ruin shelter", 27, 76, "Roof stones form a dry wedge around the old bell frame. Ash circles and bedroll marks show recent visitors.", ["A guarded rest restores HP.", "A fire is visible from the road."], S("Ridge Exposure", "Journey • STR save in severe weather • failure: 1 Fatigue", "The belfry shelter removes the save for four people.", "More bodies require additional cover.")),
        E("exile-track", "Forested Exile Track", "Border route", 73, 76, "A narrow path descends west through thorn and pine, bypassing the road and its patrols.", ["Travel takes one surface watch.", "Without a guide, save WIL to keep direction."], S("Exile Track", "Journey • WIL save • failure: arrive at dusk and add 1 Fatigue", "A current trail mark removes the save.", "Bulky carts cannot pass.")),
      ],
      ["ash bell", "bell ruin", "tower"]
    ),
    D(
      "grey-orchard",
      "surface",
      20,
      "The Grey Orchard",
      "A dead grove that still bears visions",
      "Pale fruit, night-moving roots, and a sweet smell before rain",
      "♧",
      30,
      24,
      "Leafless trees bear ash-grey fruit above soil split by the Tree of Marr’s distant roots. The orchard looks dead until moonrise, when branches quietly turn toward the north.",
      ["Grey fruit is never safe to eat without preparation.", "Rootwardens leave stone cairns at stable paths.", "The western road remains open in dry weather."],
      [
        E("vision-boughs", "Vision Boughs", "Enchanted grove", 50, 18, "Clusters of grey fruit hang from branches polished smooth by hands and antlers.", ["Prepared fruit costs 20 gp when available.", "Eating raw fruit requires a WIL save."], S("Grey Orchard Fruit", "Consumable • WIL save", "Success: ask one question about a known place and receive a symbolic vision.", "Failure: add 1 Fatigue and mark the skin with grey veins until rest."), [["Prepared vision fruit", "20 gp"]]),
        E("night-roots", "Night Roots", "Moving hazard", 24, 43, "Fresh furrows cross yesterday’s paths. After dusk, pale roots lift and settle like searching fingers.", ["Daylight travel is ordinary.", "At night, save DEX each exploration turn."], S("Searching Roots", "7 HP, 1 Armor, 14 STR, 9 DEX, 12 WIL, grasp (d8)", "Seek warmth but withdraw from songlight.", "Critical Damage: drag the target one zone toward the north.")),
        E("warden-cairn", "Rootwarden Cairn", "Waystone", 75, 42, "Flat stones balance around a hollow center holding fresh water and a single green leaf.", ["Water and a safe pause restore HP.", "Taking the leaf closes one nearby route until it is returned."], S("Cairn Guardian", "5 HP, 1 Armor, 13 STR, 11 DEX, 15 WIL, stone hand (d8)", "Appears only after the cairn is harmed.", "Accepts repair before restitution.")),
        E("sweet-rot-press", "Sweet-Rot Press", "Abandoned works", 27, 76, "A stone fruit press smells of honey and rain. Someone cleans it despite the missing roof.", ["Prepared fruit requires one turn and proper tools.", "Pressing d6 fruit yields one safe dose on a favorable Die of Fate."], S("Orchard Press", "Device • STR save • crush: d6 STR", "Using the locking bar removes the save.", "Spoiled mash attracts a root creature next turn.")),
        E("forgotten-road", "Forgotten Western Road", "Border route", 73, 76, "Grass covers paired wheel ruts leading beyond Marr’s ordinary patrols.", ["Travel requires one surface watch and supplies.", "A standing stone marks the last reliable turn."], S("Borderland Exposure", "Journey • STR or WIL save each watch • failure: 1 Fatigue", "Shelter answers STR; a guide answers WIL.", "Bad weather makes both routes costly.")),
      ],
      ["orchard", "grey fruit", "visions"]
    ),
    D(
      "processional-road",
      "surface",
      21,
      "Old Processional Road",
      "Trade and authority share the stones",
      "Faded ritual marks still remember the weight of marching feet",
      "═",
      66,
      72,
      "A ceremonial road runs south from Root Gate, broad enough for three carts. Old ash inlays remain beneath repairs, and patrols instinctively keep to their ancient lanes.",
      ["A surface watch covers about six miles.", "Road notices are copied at Root Gate and Thistlegrasp.", "Processions have right of way under current law."],
      [
        E("root-gate-mile", "Root Gate Milestone", "Roadhead", 50, 18, "A black stone marks zero miles at the edge of Marr’s southern wall. Notices are nailed to a replaceable timber face.", ["Current closures are public.", "A local guide costs 5 gp per day."], S("Road Watch Pair", "4 HP, 1 Armor, 12 STR, 11 DEX, 12 WIL, spears (d8)", "Answers direct road questions honestly.", "Carries a horn audible at Root Gate.")),
        E("authority-marks", "Authority Marks", "Ritual paving", 24, 43, "Ash and brass symbols divide the road into walking, trade, and procession lanes.", ["Following the marks avoids ordinary patrol attention.", "Defacing one advances local Pressure by 1."], S("Processional Weight", "Site • WIL save when crossing an active rite", "Failure: halt or join the rear of the procession for one turn.", "A processional medallion removes the save.")),
        E("toll-house", "Toll House Ruin", "Road ruin", 76, 42, "A roofless stone office holds a cold hearth, broken scales, and a dry cellar mouth tangled in roots.", ["A guarded rest restores HP.", "The cellar route reaches the Root Notary Chamber in one turn."], S("Falling Lintel", "Hazard • DEX save • d8 STR", "Triggered by climbing or violent impact.", "Timber bracing makes the shelter safe.")),
        E("caravan-rest", "Three-Cart Rest", "Road camp", 27, 76, "A walled lay-by offers a well, hitching posts, fire rings, and enough space for three wagons.", ["Water is free.", "A watched night’s rest clears ordinary Fatigue."], S("Roadside Camp", "Sanctuary while the gate is barred", "Violence from within ends sanctuary.", "The wall grants +1 Armor against attacks from outside.")),
        E("southern-fork", "Southern Fork", "Border junction", 73, 76, "One stone points toward Thistlegrasp; another bears a weathered bell; a third has been deliberately blanked.", ["Thistlegrasp: one surface watch.", "Bell Tower ridge: one surface watch."], S("Fork Omen", "Die of Fate at departure", "1–2: patrol; 3–4: changing weather; 5–6: helpful caravan.", "A current route rumor lets the group shift the result by 1.")),
      ],
      ["old road", "trade road", "processions"]
    ),
  ];

  atlas.destinations.push(...expandedDestinations);

  atlas.regions = [
    {
      id: "marr",
      marker: 1,
      name: "Marr Proper",
      short: "The walled root-village",
      subtitle: "Tree, market, shrine, watch, homes, games, cages, and gate",
      icon: "♧",
      x: 25,
      y: 28,
      description: "The public village beneath the wounded boughs: ordinary life held close to an extraordinary tree.",
      image: "/maps/marr.webp",
      alt: "Charcoal overview map of Marr Proper",
      href: "/marr-proper",
    },
    {
      id: "undamarr",
      marker: 2,
      name: "UndaMarr",
      short: "The city beneath the Tree",
      subtitle: "Surveillance, scarcity, trade, ritual, and quiet resistance",
      icon: "✦",
      x: 73,
      y: 28,
      description: "A subterranean city of lanterns and songlight where authority travels by procession and memory changes hands in fragments.",
      image: "/maps/undamarr-overview.webp",
      alt: "Detailed parchment fantasy overview map of UndaMarr",
      href: "/undamarr",
    },
    {
      id: "roots",
      marker: 3,
      name: "The Roots",
      short: "Living roads of memory",
      subtitle: "Unstable paths, old bargains, resonant caverns, and missing time",
      icon: "≈",
      x: 26,
      y: 73,
      description: "Root-carved passages react to truth, guilt, song, and names. A shortcut is never merely shorter.",
      image: "/maps/roots-overview.webp",
      alt: "Detailed parchment fantasy overview map of the Roots",
      href: "/roots",
    },
    {
      id: "surface",
      marker: 4,
      name: "Surface & Borderlands",
      short: "Ruins, roads, weather, and sky",
      subtitle: "Villages, old monuments, exposed paths, and the Tree’s distant reach",
      icon: "☼",
      x: 74,
      y: 73,
      description: "Beyond Marr’s wall, old roads and root-touched sites trade the city’s close pressure for distance, weather, and stranger horizons.",
      image: "/maps/surface-overview.webp",
      alt: "Detailed parchment fantasy overview map of the Surface and Borderlands",
      href: "/surface",
    },
  ];

  atlas.regionMeta = {
    all: {
      name: "The Realms of Marr",
      subtitle: "Four layers; one wounded land",
      description: "Marr Proper, UndaMarr, the living Roots, and the Surface interlock through roads, stairs, lifts, sinkholes, and bargains.",
    },
    marr: { name: "Marr Proper", subtitle: "A village beneath the wounded boughs" },
    undamarr: { name: "UndaMarr", subtitle: "The city beneath the Tree" },
    roots: { name: "The Roots", subtitle: "Living paths and memory spaces" },
    surface: { name: "Surface & Borderlands", subtitle: "Ruins, roads, weather, and sky" },
  };

  const routes = [
    { a: "tree", b: "cages", name: "Crown Cage Walk", cost: "1 turn • visitor hours" },
    { a: "tree", b: "watch", name: "Watch Door", cost: "1 turn • visitor token" },
    { a: "tree", b: "market", name: "North Rootway", cost: "1 turn • open by day" },
    { a: "tree", b: "ash-cathedral", name: "Continuing Depths", cost: "2 turns • light and named return contact" },
    { a: "village", b: "green", name: "Commons Lane", cost: "1 turn • free" },
    { a: "village", b: "market", name: "Kettle Lanes", cost: "1 turn • free" },
    { a: "village", b: "gate", name: "West Wall Road", cost: "1 turn • gate hours" },
    { a: "market", b: "gate", name: "South Gate Road", cost: "1 turn • cart traffic" },
    { a: "market", b: "lantern-ward", name: "Lower Trade Ramp", cost: "2 turns • cargo toll 1 gp per bulky slot" },
    { a: "shrine", b: "whispering-walks", name: "Catacomb Rootway", cost: "2 turns • descent token and lantern" },
    { a: "watch", b: "still-yards", name: "North Root Door", cost: "1 turn • escort or current writ" },
    { a: "gate", b: "processional-road", name: "Southern Threshold", cost: "1 turn • posted tolls" },
    { a: "ash-cathedral", b: "lantern-ward", name: "Processional Way", cost: "1 turn • papers or +1 Pressure" },
    { a: "ash-cathedral", b: "vault-echoes", name: "Confiscation Tunnels", cost: "1 turn • official escort" },
    { a: "ash-cathedral", b: "still-yards", name: "Guarded Ways", cost: "1 turn • papers" },
    { a: "ash-cathedral", b: "root-bell-cavern", name: "Choir Service Descent", cost: "1 turn • choir token or +2 Pressure" },
    { a: "lantern-ward", b: "vault-echoes", name: "Archive Lift", cost: "1 turn • 1 gp" },
    { a: "lantern-ward", b: "bellfall", name: "Smuggler Tunnels", cost: "1 turn • 5 gp or a favor" },
    { a: "lantern-ward", b: "still-yards", name: "Silent Lanes", cost: "1 turn • quiet travel" },
    { a: "lantern-ward", b: "root-notary", name: "Broker Shaft", cost: "1 turn • named bargain" },
    { a: "lantern-ward", b: "processional-road", name: "Surface Trade Ramp", cost: "2 turns • cargo toll" },
    { a: "vault-echoes", b: "bellfall", name: "Sealed Collapse", cost: "2 turns • light and tools" },
    { a: "vault-echoes", b: "whispering-walks", name: "Resonance Mouth", cost: "1 turn • silence or WIL save" },
    { a: "bellfall", b: "root-bell-cavern", name: "Deep Bell Spiral", cost: "1 turn • registered light" },
    { a: "bellfall", b: "bell-tower-ruin", name: "Cracked Sky-Shaft", cost: "1 turn • rope or DEX save" },
    { a: "still-yards", b: "thistlegrasp", name: "Forgotten Stair", cost: "2 turns • favor to a local guide" },
    { a: "whispering-walks", b: "root-notary", name: "Knot-Marked Way", cost: "1 turn • offer a name" },
    { a: "whispering-walks", b: "hollow-spiral", name: "Guilt-Bent Path", cost: "1 turn • WIL save or unintended arrival" },
    { a: "root-bell-cavern", b: "hollow-spiral", name: "Deep Bell Path", cost: "1 turn • bell-light" },
    { a: "hollow-spiral", b: "grey-orchard", name: "Surface Sinkhole", cost: "1 turn • rope or DEX save" },
    { a: "root-notary", b: "processional-road", name: "Forgotten Rootway", cost: "1 turn • dry weather" },
    { a: "thistlegrasp", b: "processional-road", name: "Pilgrim Road", cost: "1 surface watch • supplies" },
    { a: "thistlegrasp", b: "grey-orchard", name: "Field Track", cost: "1 surface watch • closed after heavy rain" },
    { a: "bell-tower-ruin", b: "processional-road", name: "Bell Ridge Track", cost: "1 surface watch • daylight" },
    { a: "grey-orchard", b: "processional-road", name: "Orchard Spur", cost: "1 surface watch • rootway cairn" },
  ];

  const destinationById = (id) => atlas.destinations.find((destination) => destination.id === id);
  atlas.destinations.forEach((destination) => {
    destination.connections = [];
  });
  routes.forEach((route, index) => {
    route.id = `route-${index + 1}`;
    const a = destinationById(route.a);
    const b = destinationById(route.b);
    if (!a || !b) return;
    a.connections.push({ to: route.b, name: route.name, cost: route.cost });
    b.connections.push({ to: route.a, name: route.name, cost: route.cost });
  });
  atlas.routes = routes;

  atlas.indexRecords = [
    { type: "people", name: "High Cantor Vraeg", summary: "Masked administrator of the Cathedral’s public rites and edicts.", locationId: "ash-cathedral", aliases: ["vraeg"] },
    { type: "people", name: "Brother Elian", summary: "Mute monk and patient teacher of the Still Yards’ gesture-cant.", locationId: "still-yards", aliases: ["elian", "silent monk"] },
    { type: "people", name: "Lira Thimbleleaf", summary: "Lantern Ward guide known for moving song fragments and people through watched routes.", locationId: "lantern-ward", aliases: ["lira", "song smuggler"] },
    { type: "people", name: "Archivist Meira Quill", summary: "Public-desk archivist who distinguishes original echoes from copies.", locationId: "vault-echoes", aliases: ["meira"] },
    { type: "people", name: "Nera Toll", summary: "Bellfall bellwright who never tests an unknown fragment indoors.", locationId: "bellfall", aliases: ["bellwright"] },
    { type: "people", name: "Proxy Sable", summary: "Quiet Trade broker who writes confidentiality as a term, never a promise.", locationId: "root-notary", aliases: ["broker"] },
    { type: "factions", name: "Disciples of Daemos", summary: "Solemn custodians of order, ash rites, public safety, and licensed memory.", locationId: "ash-cathedral", aliases: ["disciples", "masked priests"] },
    { type: "factions", name: "The Ash Choir", summary: "A sacred order whose continuous song maintains UndaMarr’s ritual harmony.", locationId: "ash-cathedral", aliases: ["choir", "singers"] },
    { type: "factions", name: "The Rootwardens", summary: "Rumored keepers of the Roots’ old shape, bargains, and unstable paths.", locationId: "whispering-walks", aliases: ["root wardens", "spirits"] },
    { type: "factions", name: "The Lantern Bearers", summary: "Guides, traders, and fixers who keep hidden ways lit for those who need them.", locationId: "lantern-ward", aliases: ["lanterns", "smugglers"] },
    { type: "factions", name: "The Echo Archivists", summary: "Scholars who preserve testimony as resonance rather than text.", locationId: "vault-echoes", aliases: ["archivists"] },
    { type: "factions", name: "The Bell-Ringers", summary: "Relic hunters and restorationists convinced the old bells must toll again.", locationId: "bellfall", aliases: ["ringers"] },
    { type: "factions", name: "The Quiet Trade", summary: "Merchants, fences, and proxies who move necessities through every border.", locationId: "root-notary", aliases: ["trade", "brokers"] },
    { type: "rumors", name: "The hands behind the Choir Gate", summary: "Choir members are said to pass messages in gestures too quick for their guards.", locationId: "ash-cathedral", aliases: ["choir notes"] },
    { type: "rumors", name: "A year that was sealed, not lost", summary: "Archivists insist an entire year of Marr’s record exists behind one of the stone doors.", locationId: "vault-echoes", aliases: ["sealed years"] },
    { type: "rumors", name: "The bell that warms at a lie", summary: "A cracked bell below Bellfall grows warm when deliberate falsehood is spoken nearby.", locationId: "root-bell-cavern", aliases: ["truth bell"] },
    { type: "rumors", name: "Someone always walks below", summary: "Travelers in the Hollow Spiral see a lantern one landing beneath them, however fast they descend.", locationId: "hollow-spiral", aliases: ["lower walker"] },
    { type: "rumors", name: "The orchard turns at moonrise", summary: "Grey Orchard branches are said to point north toward the Tree after dark.", locationId: "grey-orchard", aliases: ["grey fruit"] },
    { type: "rumors", name: "The tower repairs itself badly", summary: "No one admits building the mismatched new scaffold on the Bell Tower Ruin.", locationId: "bell-tower-ruin", aliases: ["repair scaffold"] },
    { type: "rumors", name: "Children remember the missing raid", summary: "Adults in one Still-Yard block deny a past raid that children describe in exact detail.", locationId: "still-yards", aliases: ["forgotten raid"] },
    { type: "rumors", name: "Lanterns lean toward safe roots", summary: "A split flame is said to bend toward a route that will remain open for one more watch.", locationId: "lantern-ward", aliases: ["safe route"] },
    { type: "rumors", name: "The Book can be heard through stone", summary: "Night workers claim the Cathedral sublevels answer the Book of Souls in a second heartbeat.", locationId: "ash-cathedral", aliases: ["book of souls"] },
    { type: "rumors", name: "The old road still knows authority", summary: "Marching the Processional Road’s original pattern is said to make strangers step aside without knowing why.", locationId: "processional-road", aliases: ["ritual road"] },
  ];

  atlas.discoveryStates = [
    { id: "unknown", name: "Unknown", description: "Not yet known to this campaign." },
    { id: "rumored", name: "Rumored", description: "Heard of, but not confirmed." },
    { id: "discovered", name: "Discovered", description: "Confirmed and placed on the atlas." },
    { id: "visited", name: "Visited", description: "Reached by the travelers." },
    { id: "changed", name: "Changed", description: "Permanently altered in play." },
  ];
  atlas.layerNames = layerNames;
  atlas.phase2 = true;
})();
