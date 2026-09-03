(() => {
  "use strict";
  if (window.__MARR_ATLAS_APP_LOADED__) return;
  window.__MARR_ATLAS_APP_LOADED__ = true;

  const atlas = window.MARR_ATLAS;
  const { destinations, regions = [], routes = [], indexRecords = [], discoveryStates = [] } = atlas;
  const byId = (id) => document.getElementById(id);
  const BASE_PATH = "/Marr-interactive";
  const routeHref = (path = "/") => `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
  const assetHref = (path) => (path?.startsWith("/") ? `${BASE_PATH}${path}` : path);
  const appPathname = () => {
    const pathname = window.location.pathname;
    if (pathname === BASE_PATH) return "/";
    return pathname.startsWith(`${BASE_PATH}/`) ? pathname.slice(BASE_PATH.length) : pathname;
  };

  const els = {
    home: byId("homeButton"),
    search: byId("atlasSearch"),
    about: byId("aboutButton"),
    dialog: byId("aboutDialog"),
    ledgerButton: byId("ledgerButton"),
    ledgerDialog: byId("ledgerDialog"),
    ledgerSummary: byId("ledgerSummary"),
    ledgerStatus: byId("ledgerStatus"),
    downloadLedger: byId("downloadLedgerButton"),
    restoreLedger: byId("restoreLedgerButton"),
    closeLedger: byId("closeLedgerButton"),
    ledgerFile: byId("ledgerFileInput"),
    fit: byId("fitButton"),
    fullscreen: byId("fullscreenButton"),
    mobileMap: byId("mobileMapButton"),
    mobileFolio: byId("mobileFolioButton"),
    mobileFull: byId("mobileFullButton"),
    sheetHandle: byId("sheetHandle"),
    guidePanel: byId("guidePanel"),
    offlineBadge: byId("offlineBadge"),
    install: byId("installButton"),
    realmBar: byId("realmBar"),
    breadcrumbs: byId("breadcrumbs"),
    mapTitle: byId("mapTitle"),
    mapSubtitle: byId("mapSubtitle"),
    mapFrame: byId("mapFrame"),
    mapPaper: byId("mapPaper"),
    mapImage: byId("mapImage"),
    realmIllustration: byId("realmIllustration"),
    hotspots: byId("mapHotspots"),
    mapHint: byId("mapHint"),
    guideEyebrow: byId("guideEyebrow"),
    guideTitle: byId("guideTitle"),
    folio: byId("folioNumber"),
    guideTab: byId("guideTab"),
    rulesTab: byId("rulesTab"),
    indexTab: byId("indexTab"),
    guide: byId("guideContent"),
  };

  const slugify = (value) =>
    value
      .normalize("NFKD")
      .replace(/[’']/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

  const getSavedDiscoveries = () => {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem("marr-atlas-discoveries-v2") || "{}") || {};
    } catch {
      saved = {};
    }

    try {
      const oldMarks = JSON.parse(localStorage.getItem("marr-atlas-visited") || "[]");
      oldMarks.forEach((key) => {
        const [locationId, entryId] = key.split(":");
        if (locationId && entryId && !saved[`entry:${locationId}:${entryId}`]) {
          saved[`entry:${locationId}:${entryId}`] = "visited";
        }
      });
    } catch {
      // A malformed old traveler ledger is safely ignored.
    }
    return saved;
  };

  const state = {
    regionId: "all",
    locationId: null,
    entryId: null,
    tab: "guide",
    query: "",
    indexFilter: "all",
    discoveries: getSavedDiscoveries(),
  };

  const roman = (n) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] || String(n);
  const regionById = (id) => regions.find((region) => region.id === id) || null;
  const destinationById = (id) => destinations.find((destination) => destination.id === id) || null;
  const destinationsInRegion = (regionId) => destinations.filter((destination) => destination.layer === regionId);
  const currentLocation = () => destinationById(state.locationId);
  const currentEntry = () => {
    const location = currentLocation();
    return location?.entries.find((entry) => entry.id === state.entryId) || location?.entries[0] || null;
  };
  const regionPath = (regionId) => {
    if (regionId === "marr") return routeHref("/marr-proper");
    if (regionId === "undamarr") return routeHref("/undamarr");
    if (regionId === "roots") return routeHref("/roots");
    if (regionId === "surface") return routeHref("/surface");
    return routeHref("/");
  };
  const locationHref = (location) => {
    if (!location) return regionPath(state.regionId);
    if (location.layer === "marr") return routeHref(`/${slugify(location.name)}`);
    return `${regionPath(location.layer)}/${slugify(location.name)}`;
  };
  const entryHref = (location, entry) =>
    location && entry ? `${locationHref(location)}/${slugify(entry.name)}` : locationHref(location);
  const currentHref = () => {
    const location = currentLocation();
    if (!location) return regionPath(state.regionId);
    return entryHref(location, currentEntry());
  };

  const syncPath = (replace = false, hrefOverride = null) => {
    const href = hrefOverride || currentHref();
    if (window.location.pathname === href) return;
    window.history[replace ? "replaceState" : "pushState"](
      { regionId: state.regionId, locationId: state.locationId, entryId: state.entryId },
      "",
      href
    );
  };

  const readPath = () => {
    const segments = appPathname().split("/").filter(Boolean).map(decodeURIComponent);
    state.regionId = "all";
    state.locationId = null;
    state.entryId = null;
    if (!segments.length) return;

    const firstRegion =
      segments[0] === "marr-proper"
        ? "marr"
        : ["undamarr", "roots", "surface"].includes(segments[0])
          ? segments[0]
          : null;

    if (firstRegion) {
      state.regionId = firstRegion;
      const location = destinationsInRegion(firstRegion).find((item) => slugify(item.name) === segments[1]);
      if (!location) return;
      state.locationId = location.id;
      const entry = location.entries.find((item) => slugify(item.name) === segments[2]);
      state.entryId = entry?.id || location.entries[0]?.id || null;
      return;
    }

    const legacyLocation = destinationsInRegion("marr").find((item) => slugify(item.name) === segments[0]);
    if (!legacyLocation) return;
    state.regionId = "marr";
    state.locationId = legacyLocation.id;
    const entry = legacyLocation.entries.find((item) => slugify(item.name) === segments[1]);
    state.entryId = entry?.id || legacyLocation.entries[0]?.id || null;
  };

  const discoveryKey = (location, entry = null) =>
    entry ? `entry:${location.id}:${entry.id}` : `location:${location.id}`;
  const getDiscovery = (key) => state.discoveries[key] || "discovered";
  const saveDiscoveries = () => {
    try {
      localStorage.setItem("marr-atlas-discoveries-v2", JSON.stringify(state.discoveries));
    } catch {
      // The atlas remains usable when device storage is unavailable.
    }
  };
  const discoveryName = (id) => discoveryStates.find((item) => item.id === id)?.name || "Discovered";
  const validDiscoveryIds = new Set(discoveryStates.map((item) => item.id));
  const allDiscoveryKeys = new Set(
    destinations.flatMap((location) => [
      discoveryKey(location),
      ...location.entries.map((entry) => discoveryKey(location, entry)),
    ])
  );
  const ledgerCounts = () => {
    const counts = Object.fromEntries(discoveryStates.map((item) => [item.id, 0]));
    allDiscoveryKeys.forEach((key) => {
      counts[getDiscovery(key)] += 1;
    });
    return counts;
  };
  const renderLedgerSummary = () => {
    const counts = ledgerCounts();
    els.ledgerSummary.innerHTML = discoveryStates
      .map((item) => `<span class="status-${item.id}"><strong>${counts[item.id]}</strong>${item.name}</span>`)
      .join("");
  };
  const setLedgerStatus = (message, isError = false) => {
    els.ledgerStatus.textContent = message;
    els.ledgerStatus.classList.toggle("is-error", isError);
  };
  const discoveryControl = (key) => {
    const selected = getDiscovery(key);
    return `
      <label class="discovery-control">
        <span>Campaign status</span>
        <select data-discovery-key="${key}" aria-label="Campaign discovery status">
          ${discoveryStates
            .map(
              (item) =>
                `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${item.name} — ${item.description}</option>`
            )
            .join("")}
        </select>
      </label>
    `;
  };

  const statBlock = (stat) => {
    if (!stat) return '<p class="rules-note">This entry is descriptive and has no separate rules profile.</p>';
    return `
      <article class="stat-block">
        <div class="stat-head"><strong>${stat.name}</strong><span>Cairn 2e</span></div>
        <p class="stat-line">${stat.line}</p>
        <ul class="stat-traits">${stat.traits.map((trait) => `<li>${trait}</li>`).join("")}</ul>
      </article>
    `;
  };

  const waresBlock = (wares) => {
    if (!wares?.length) return "";
    return `
      <section class="wares">
        <h4>Posted wares</h4>
        <ul class="wares-list">${wares
          .map(([item, price]) => `<li><span>${item}</span><span>${price}</span></li>`)
          .join("")}</ul>
      </section>
    `;
  };

  const connectionsBlock = (location) => {
    if (!location?.connections?.length) return "";
    return `
      <section class="connections-block">
        <p class="section-label">Known routes</p>
        <ul class="route-list">
          ${location.connections
            .map((connection) => {
              const target = destinationById(connection.to);
              if (!target) return "";
              return `
                <li>
                  <a href="${locationHref(target)}" data-action="location" data-location="${target.id}">
                    <span><strong>${connection.name}</strong><small>to ${target.name}</small></span>
                    <em>${connection.cost}</em>
                  </a>
                </li>
              `;
            })
            .join("")}
        </ul>
      </section>
    `;
  };

  const entryCard = (location, entry, rulesOnly = false) => {
    if (!entry) return "";
    if (rulesOnly) {
      return `
        <section class="entry-card">
          <h3>${entry.name}</h3><span class="entry-type">${entry.type}</span>
          <p class="rules-note">Profiles use HP, Armor, STR, DEX, WIL, attacks, behavior, and Critical Damage as applicable. A save succeeds on d20 equal to or under the named Attribute; a natural 1 always succeeds and a natural 20 always fails.</p>
          ${statBlock(entry.stat)}${waresBlock(entry.wares)}
        </section>
      `;
    }
    const key = discoveryKey(location, entry);
    return `
      <section class="entry-card">
        <div class="entry-title-row">
          <div><h3>${entry.name}</h3><span class="entry-type">${entry.type}</span></div>
          <span class="status-stamp status-${getDiscovery(key)}">${discoveryName(getDiscovery(key))}</span>
        </div>
        <p class="entry-description">${entry.description}</p>
        <ul class="fact-list">${entry.facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>
        ${waresBlock(entry.wares)}
        ${discoveryControl(key)}
      </section>
    `;
  };

  const entryIndex = (location, activeId) => `
    <section class="entry-index">
      <p class="section-label">Map key — ${location.entries.length} entries</p>
      <ul class="entry-list">
        ${location.entries
          .map((entry, index) => {
            const status = getDiscovery(discoveryKey(location, entry));
            return `
              <li>
                <a class="entry-link ${entry.id === activeId ? "active" : ""}" href="${entryHref(location, entry)}" data-action="entry" data-entry="${entry.id}" ${entry.id === activeId ? 'aria-current="page"' : ""}>
                  <span class="list-number status-${status}">${index + 1}</span>
                  <span class="list-copy"><strong>${entry.name}</strong><small>${entry.type} · ${discoveryName(status)}</small></span>
                  <span class="arrow" aria-hidden="true">›</span>
                </a>
              </li>
            `;
          })
          .join("")}
      </ul>
    </section>
  `;

  const regionList = () => `
    <ul class="realm-list">
      ${regions
        .map(
          (region) => `
            <li>
              <a class="realm-card" href="${routeHref(region.href)}" data-action="region" data-region="${region.id}">
                <span class="realm-card-icon" aria-hidden="true">${region.icon}</span>
                <span><strong>${region.name}</strong><small>${region.short}</small><em>${destinationsInRegion(region.id).length} mapped locations</em></span>
                <span class="arrow" aria-hidden="true">›</span>
              </a>
            </li>
          `
        )
        .join("")}
    </ul>
  `;

  const overviewList = (regionId = state.regionId) => {
    if (regionId === "all") return regionList();
    const regionDestinations = destinationsInRegion(regionId);
    return `
      <ul class="location-list">
        ${regionDestinations
          .map((location) => {
            const status = getDiscovery(discoveryKey(location));
            return `
              <li>
                <a class="location-link" href="${locationHref(location)}" data-action="location" data-location="${location.id}">
                  <span class="list-number status-${status}">${location.marker}</span>
                  <span class="list-copy"><strong>${location.name}</strong><small>${location.short} · ${discoveryName(status)}</small></span>
                  <span class="arrow" aria-hidden="true">›</span>
                </a>
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  };

  const buildIndex = () => {
    const records = [];
    destinations.forEach((location) => {
      records.push({
        type: "places",
        name: location.name,
        summary: location.description,
        locationId: location.id,
        aliases: [location.short, location.subtitle, ...(location.aliases || [])],
      });
      location.entries.forEach((entry) => {
        records.push({
          type: "places",
          name: entry.name,
          summary: entry.description,
          locationId: location.id,
          entryId: entry.id,
          aliases: [entry.type, ...(entry.aliases || []), ...(entry.facts || [])],
        });
        (entry.wares || []).forEach(([item, price]) => {
          records.push({
            type: "wares",
            name: item,
            summary: `${price} · posted at ${entry.name}`,
            locationId: location.id,
            entryId: entry.id,
            aliases: [entry.name, location.name],
          });
        });
      });
    });
    routes.forEach((route) => {
      const a = destinationById(route.a);
      const b = destinationById(route.b);
      if (!a || !b) return;
      records.push({
        type: "routes",
        name: route.name,
        summary: `${a.name} ↔ ${b.name} · ${route.cost}`,
        locationId: a.id,
        aliases: [a.name, b.name, route.cost],
      });
    });
    records.push(...indexRecords);
    return records;
  };
  const fullIndex = buildIndex();
  const indexOrder = ["places", "people", "wares", "factions", "routes", "rumors"];
  const indexLabels = {
    places: "Places",
    people: "People",
    wares: "Wares",
    factions: "Factions",
    routes: "Routes",
    rumors: "Rumors",
  };
  const indexSingular = {
    places: "Place",
    people: "Person",
    wares: "Ware",
    factions: "Faction",
    routes: "Route",
    rumors: "Rumor",
  };
  const recordHaystack = (record) =>
    [record.name, record.summary, ...(record.aliases || [])].join(" ").toLocaleLowerCase();

  const indexFilters = () => `
    <div class="index-filters" role="group" aria-label="Atlas index filters">
      ${["all", ...indexOrder]
        .map(
          (type) =>
            `<button class="filter-chip ${state.indexFilter === type ? "active" : ""}" type="button" data-action="filter-index" data-filter="${type}" aria-pressed="${state.indexFilter === type}">${type === "all" ? "All" : indexLabels[type]}</button>`
        )
        .join("")}
    </div>
  `;

  const renderIndexRecords = (records) => {
    if (!records.length) {
      return '<div class="empty-state"><strong>The charcoal stays quiet.</strong><p>Try a place, person, ware, faction, route, rumor, or alias.</p></div>';
    }
    return indexOrder
      .map((type) => {
        const group = records
          .filter((record) => record.type === type)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (!group.length) return "";
        return `
          <section class="index-group">
            <p class="section-label">${indexLabels[type]} — ${group.length}</p>
            <ul class="search-list">
              ${group
                .map((record) => {
                  const location = destinationById(record.locationId);
                  const entry = location?.entries.find((item) => item.id === record.entryId);
                  const href = entry ? entryHref(location, entry) : locationHref(location);
                  return `
                    <li class="search-result">
                      <a href="${href}" data-action="index-record" data-location="${record.locationId}" ${record.entryId ? `data-entry="${record.entryId}"` : ""}>${record.name}</a>
                      <p>${location?.name || "Marr Atlas"} · ${indexSingular[type]}</p>
                      <p>${record.summary}</p>
                    </li>
                  `;
                })
                .join("")}
            </ul>
          </section>
        `;
      })
      .join("");
  };

  const renderSearch = () => {
    const needle = state.query.trim().toLocaleLowerCase();
    const results = fullIndex.filter(
      (record) =>
        recordHaystack(record).includes(needle) &&
        (state.indexFilter === "all" || record.type === state.indexFilter)
    );
    els.guideEyebrow.textContent = "Atlas search";
    els.guideTitle.textContent = results.length ? `${results.length} matching records` : "No matching records";
    els.folio.textContent = "⌕";
    els.guide.innerHTML = `${indexFilters()}${renderIndexRecords(results)}`;
  };

  const renderIndex = () => {
    const records = fullIndex.filter((record) => state.indexFilter === "all" || record.type === state.indexFilter);
    els.guideEyebrow.textContent = "Cross-referenced folio";
    els.guideTitle.textContent = "Atlas index";
    els.folio.textContent = "A–Z";
    els.guide.innerHTML = `
      <p class="lede">Every public place, person, ware, faction, route, and rumor in one searchable ledger.</p>
      ${indexFilters()}${renderIndexRecords(records)}
    `;
  };

  const regionRules = (regionId) => {
    const copy = {
      all: ["Marr exploration", "Use one exploration turn for a focused move, search, interaction, rest, rite, or attempt to hide. Time, supplies, attention, and memory are meaningful costs."],
      marr: ["Marr Proper", "Ordinary travel between adjacent public sites takes one turn. Watch patrols, gate hours, and posted rules matter more than navigation."],
      undamarr: ["City mode", "Movement risks attention. Papers, coin, favors, and anonymity secure routes. Loud, slow, or prohibited acts may raise Pressure."],
      roots: ["Rootcrawl mode", "Navigation is unreliable without a guide, rite, or marker. Light is sacred. Failed navigation reaches something meaningful at a cost."],
      surface: ["Surface mode", "A travel watch covers about six miles. Supplies, daylight, shelter, weather, and road reports determine exposure."],
    };
    const [title, text] = copy[regionId] || copy.all;
    return `<section class="entry-card"><h3>${title}</h3><p class="rules-note">${text}</p>${regionId === "marr" ? statBlock(atlas.overviewStat) : ""}</section>`;
  };

  const renderGuide = () => {
    if (state.query.trim()) {
      renderSearch();
      return;
    }
    if (state.tab === "index") {
      renderIndex();
      return;
    }

    const location = currentLocation();
    const region = regionById(state.regionId);
    if (!location) {
      const isRules = state.tab === "rules";
      if (state.regionId === "all") {
        els.guideEyebrow.textContent = isRules ? "Open rules" : "Traveler’s folio";
        els.guideTitle.textContent = isRules ? "Marr at the table" : "Four ways through Marr";
        els.folio.textContent = "I";
        els.guide.innerHTML = isRules
          ? `${regionRules("all")}<p class="section-label">Regional procedures</p>${regionList()}`
          : `<p class="lede">One wounded land, layered vertically.</p><p class="entry-description">Begin in the walled village, descend into the watched city, bargain through living roots, or follow old roads into weather and ruin.</p><div class="ornament-rule" aria-hidden="true">✦</div>${regionList()}`;
        return;
      }

      els.guideEyebrow.textContent = isRules ? "Regional procedure" : region.short;
      els.guideTitle.textContent = region.name;
      els.folio.textContent = roman(regions.indexOf(region) + 1);
      els.guide.innerHTML = isRules
        ? `${regionRules(region.id)}<p class="section-label">Mapped locations</p>${overviewList(region.id)}`
        : `<p class="lede">${region.subtitle}</p><p class="entry-description">${region.description}</p><div class="ornament-rule" aria-hidden="true">✦</div>${overviewList(region.id)}`;
      return;
    }

    const entry = currentEntry();
    const locationIndex = destinationsInRegion(location.layer).indexOf(location) + 1;
    els.guideEyebrow.textContent = state.tab === "rules" ? "Open rules" : location.short;
    els.guideTitle.textContent = location.name;
    els.folio.textContent = roman(locationIndex);
    const introduction =
      state.tab === "guide"
        ? `<p class="lede">${location.subtitle}</p><p class="entry-description">${location.description}</p><ul class="fact-list">${location.facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>${discoveryControl(discoveryKey(location))}<div class="ornament-rule" aria-hidden="true">✦</div>`
        : "";
    const entryActions = `
      <div class="entry-actions" aria-label="Entry actions">
        <button class="folio-action" type="button" data-action="copy-link">Copy entry link</button>
        <button class="folio-action" type="button" data-action="print-entry">Print entry</button>
        <span id="entryActionStatus" role="status" aria-live="polite"></span>
      </div>
    `;
    els.guide.innerHTML = `${introduction}${entryCard(location, entry, state.tab === "rules")}${entryActions}${
      state.tab === "guide" ? connectionsBlock(location) : ""
    }${entryIndex(location, entry?.id)}`;
  };

  const renderRealmBar = () => {
    els.realmBar.innerHTML = `
      <a href="${routeHref("/")}" data-action="region" data-region="all" class="${state.regionId === "all" ? "active" : ""}" ${state.regionId === "all" ? 'aria-current="page"' : ""}><span aria-hidden="true">✥</span>All Marr</a>
      ${regions
        .map(
          (region) =>
            `<a href="${routeHref(region.href)}" data-action="region" data-region="${region.id}" class="${state.regionId === region.id ? "active" : ""}" ${state.regionId === region.id ? 'aria-current="page"' : ""}><span aria-hidden="true">${region.icon}</span>${region.name}</a>`
        )
        .join("")}
    `;
  };

  const updateOverlayHeight = () => {
    if (!els.mapImage.hidden && els.mapPaper.classList.contains("is-portrait")) {
      els.hotspots.style.height = `${els.mapImage.offsetHeight}px`;
    } else {
      els.hotspots.style.height = "auto";
    }
  };

  const mapHotspot = ({ label, number, x, y, action, href, data = {}, active = false, status = "discovered", index = 0 }) => {
    if (x == null || y == null) return "";
    return `
      <a class="hotspot ${active ? "active" : ""} status-${status}" href="${href}" style="left:${x}%;top:${y}%;--delay:${Math.min(index * 55, 550)}ms" data-label="${label}" data-action="${action}" ${Object.entries(data)
        .map(([key, value]) => `data-${key}="${value}"`)
        .join(" ")} aria-label="${number}. ${label}" ${active ? 'aria-current="page"' : ""}>${number}</a>
    `;
  };

  const showIllustration = (html, theme) => {
    els.mapImage.hidden = true;
    els.realmIllustration.hidden = false;
    els.realmIllustration.className = `realm-illustration theme-${theme}`;
    els.realmIllustration.innerHTML = html;
  };
  const showImage = (location = null) => {
    els.realmIllustration.hidden = true;
    els.realmIllustration.innerHTML = "";
    els.mapImage.hidden = false;
    els.mapImage.src = assetHref(location?.image || "/maps/marr.webp");
    els.mapImage.alt = location?.alt || "Charcoal map of Marr";
  };

  const renderMap = () => {
    const location = currentLocation();
    const region = regionById(state.regionId);
    els.mapPaper.className = "map-paper";
    els.mapPaper.style.backgroundImage = "";
    els.mapPaper.style.backgroundSize = "";
    els.mapPaper.style.backgroundPosition = "";
    els.hotspots.style.height = "auto";

    if (!location && state.regionId === "all") {
      els.breadcrumbs.innerHTML = "<span>Player atlas</span>";
      els.mapTitle.textContent = atlas.regionMeta.all.name;
      els.mapSubtitle.textContent = atlas.regionMeta.all.subtitle;
      showIllustration(
        '<div class="world-rings"><span></span><span></span><span></span></div><div class="world-label">THE WOUNDED TREE<br><small>one land · four layers</small></div>',
        "all"
      );
      els.mapHint.innerHTML = '<span class="pulse-dot" aria-hidden="true"></span>Choose a layer of Marr';
      els.hotspots.innerHTML = regions
        .map((item, index) =>
          mapHotspot({
            label: item.name,
            number: item.marker,
            x: item.x,
            y: item.y,
            action: "region",
            href: routeHref(item.href),
            data: { region: item.id },
            index,
          })
        )
        .join("");
      return;
    }

    if (!location) {
      els.breadcrumbs.innerHTML = `<a href="${routeHref("/")}" data-action="region" data-region="all">All Marr</a><span aria-hidden="true"> / </span><span>${region.name}</span>`;
      els.mapTitle.textContent = region.name;
      els.mapSubtitle.textContent = region.subtitle;
      const regionDestinations = destinationsInRegion(region.id);
      showImage(region);
      els.mapHint.innerHTML = '<span class="pulse-dot" aria-hidden="true"></span>Select a numbered node to enter';
      els.hotspots.innerHTML = regionDestinations
        .map((item, index) =>
          mapHotspot({
            label: item.name,
            number: item.marker,
            x: item.regionX,
            y: item.regionY,
            action: "location",
            href: locationHref(item),
            data: { location: item.id },
            status: getDiscovery(discoveryKey(item)),
            index,
          })
        )
        .join("");
      return;
    }

    const locationRegion = regionById(location.layer);
    els.breadcrumbs.innerHTML = `<a href="${routeHref("/")}" data-action="region" data-region="all">All Marr</a><span aria-hidden="true"> / </span><a href="${routeHref(locationRegion.href)}" data-action="region" data-region="${location.layer}">${locationRegion.name}</a><span aria-hidden="true"> / </span><span>${location.name}</span>`;
    els.mapTitle.textContent = location.name;
    els.mapSubtitle.textContent = location.subtitle;
    if (location.image) {
      showImage(location);
      if (location.portrait) els.mapPaper.classList.add("is-portrait");
      if (location.crop) {
        els.mapPaper.classList.add("is-crop");
        els.mapPaper.style.backgroundImage = `url("${assetHref(location.image)}")`;
        els.mapPaper.style.backgroundSize = location.crop.size;
        els.mapPaper.style.backgroundPosition = location.crop.position;
      }
    } else {
      showIllustration(
        `<div class="node-rings"><span></span><span></span><span></span></div><div class="node-vignette"><span>${location.icon}</span><strong>${location.name}</strong><small>${atlas.layerNames[location.layer]}</small></div>`,
        location.layer
      );
    }
    els.mapHint.innerHTML = '<span class="pulse-dot" aria-hidden="true"></span>Select a numbered mark for its field entry';
    els.hotspots.innerHTML = location.entries
      .map((entry, index) =>
        mapHotspot({
          label: entry.name,
          number: index + 1,
          x: entry.x,
          y: entry.y,
          action: "entry",
          href: entryHref(location, entry),
          data: { entry: entry.id },
          active: entry.id === currentEntry()?.id,
          status: getDiscovery(discoveryKey(location, entry)),
          index,
        })
      )
      .join("");
    requestAnimationFrame(updateOverlayHeight);
  };

  const renderTabs = () => {
    const tabs = [
      [els.guideTab, "guide"],
      [els.rulesTab, "rules"],
      [els.indexTab, "index"],
    ];
    tabs.forEach(([element, id]) => {
      const active = state.tab === id;
      element.classList.toggle("active", active);
      element.setAttribute("aria-selected", String(active));
    });
  };
  const render = () => {
    renderRealmBar();
    renderTabs();
    renderMap();
    renderGuide();
  };
  const resetGuideScroll = () => els.guide.scrollTo({ top: 0, behavior: "smooth" });
  const isMobile = () => window.matchMedia("(max-width: 1050px)").matches;
  const setSheet = (open) => {
    const mobileOpen = open && isMobile();
    document.body.classList.toggle("sheet-open", mobileOpen);
    els.mobileMap.setAttribute("aria-pressed", String(!open));
    els.mobileFolio.setAttribute("aria-pressed", String(open));
    els.sheetHandle.setAttribute("aria-label", open ? "Collapse field guide" : "Open field guide");
    els.guidePanel.inert = isMobile() && !mobileOpen;
  };
  const setFullMap = (enabled) => {
    document.body.classList.toggle("map-fullscreen", enabled);
    els.fullscreen.setAttribute("aria-pressed", String(enabled));
    els.mobileFull.setAttribute("aria-pressed", String(enabled));
    els.fullscreen.textContent = enabled ? "Exit full map" : "Full map";
    els.mobileFull.textContent = enabled ? "⛶ Exit full map" : "⛶ Full map";
    if (enabled) setSheet(false);
    requestAnimationFrame(updateOverlayHeight);
  };

  const enterRegion = (id, updateHistory = true) => {
    if (id !== "all" && !regionById(id)) return;
    state.regionId = id;
    state.locationId = null;
    state.entryId = null;
    state.query = "";
    els.search.value = "";
    render();
    if (updateHistory) syncPath(false, regionPath(id));
    els.mapPaper.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    resetGuideScroll();
    if (isMobile()) setSheet(true);
  };
  const enterLocation = (id, entryId = null, updateHistory = true) => {
    const location = destinationById(id);
    if (!location) return;
    state.regionId = location.layer;
    state.locationId = id;
    state.entryId = entryId || location.entries[0]?.id || null;
    state.query = "";
    els.search.value = "";
    render();
    if (updateHistory) syncPath(false, entryId ? entryHref(location, currentEntry()) : locationHref(location));
    els.mapPaper.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    resetGuideScroll();
    if (isMobile()) setSheet(true);
  };
  const goHome = (updateHistory = true) => enterRegion("all", updateHistory);

  const copyCurrentLink = async () => {
    const url = new URL(currentHref(), window.location.origin).href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const field = document.createElement("textarea");
        field.value = url;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }
      const status = byId("entryActionStatus");
      if (status) status.textContent = "Link copied.";
    } catch {
      const status = byId("entryActionStatus");
      if (status) status.textContent = `Copy failed. Use this address: ${url}`;
    }
  };

  const downloadLedgerBackup = () => {
    const payload = {
      schema: "marr-atlas-travelers-ledger",
      version: 1,
      exportedAt: new Date().toISOString(),
      discoveries: state.discoveries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `marr-travelers-ledger-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setLedgerStatus("Backup downloaded.");
  };

  const restoreLedgerBackup = async (file) => {
    try {
      const payload = JSON.parse(await file.text());
      if (payload?.schema !== "marr-atlas-travelers-ledger" || payload?.version !== 1 || !payload.discoveries) {
        throw new Error("wrong ledger format");
      }
      let restored = 0;
      Object.entries(payload.discoveries).forEach(([key, value]) => {
        if (allDiscoveryKeys.has(key) && validDiscoveryIds.has(value)) {
          state.discoveries[key] = value;
          restored += 1;
        }
      });
      saveDiscoveries();
      renderLedgerSummary();
      renderMap();
      renderGuide();
      setLedgerStatus(`Restored ${restored} campaign marks. Existing marks not in the backup were preserved.`);
    } catch {
      setLedgerStatus("That file is not a valid Marr Traveler’s Ledger backup.", true);
    } finally {
      els.ledgerFile.value = "";
    }
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;
    event.preventDefault();
    const action = trigger.dataset.action;
    if (action === "home") goHome();
    else if (action === "region") enterRegion(trigger.dataset.region);
    else if (action === "location") enterLocation(trigger.dataset.location);
    else if (action === "entry") {
      state.entryId = trigger.dataset.entry;
      renderMap();
      renderGuide();
      syncPath();
      resetGuideScroll();
      if (isMobile()) setSheet(true);
    } else if (action === "index-record") {
      enterLocation(trigger.dataset.location, trigger.dataset.entry || null);
    } else if (action === "filter-index") {
      state.indexFilter = trigger.dataset.filter;
      renderGuide();
    } else if (action === "copy-link") {
      copyCurrentLink();
    } else if (action === "print-entry") {
      window.print();
    }
  });

  document.addEventListener("change", (event) => {
    const select = event.target.closest("[data-discovery-key]");
    if (!select) return;
    state.discoveries[select.dataset.discoveryKey] = select.value;
    saveDiscoveries();
    renderMap();
    renderGuide();
  });

  els.home.addEventListener("click", (event) => {
    event.preventDefault();
    goHome();
  });
  els.guideTab.addEventListener("click", () => {
    state.tab = "guide";
    renderTabs();
    renderGuide();
  });
  els.rulesTab.addEventListener("click", () => {
    state.tab = "rules";
    renderTabs();
    renderGuide();
  });
  els.indexTab.addEventListener("click", () => {
    state.tab = "index";
    renderTabs();
    renderGuide();
  });
  els.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderGuide();
    if (isMobile() && state.query.trim()) setSheet(true);
  });
  els.search.addEventListener("search", (event) => {
    state.query = event.target.value;
    renderGuide();
  });
  els.about.addEventListener("click", () => els.dialog.showModal());
  els.ledgerButton.addEventListener("click", () => {
    renderLedgerSummary();
    setLedgerStatus("");
    els.ledgerDialog.showModal();
  });
  els.downloadLedger.addEventListener("click", downloadLedgerBackup);
  els.restoreLedger.addEventListener("click", () => els.ledgerFile.click());
  els.closeLedger.addEventListener("click", () => els.ledgerDialog.close());
  els.ledgerFile.addEventListener("change", () => {
    const [file] = els.ledgerFile.files || [];
    if (file) restoreLedgerBackup(file);
  });
  els.sheetHandle.addEventListener("click", () => setSheet(!document.body.classList.contains("sheet-open")));
  els.mobileMap.addEventListener("click", () => setSheet(false));
  els.mobileFolio.addEventListener("click", () => setSheet(true));
  els.fullscreen.addEventListener("click", () => setFullMap(!document.body.classList.contains("map-fullscreen")));
  els.mobileFull.addEventListener("click", () => setFullMap(!document.body.classList.contains("map-fullscreen")));
  els.fit.addEventListener("click", () => {
    els.mapPaper.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    els.mapFrame.animate([{ opacity: 0.82 }, { opacity: 1 }], { duration: 220 });
  });
  els.mapImage.addEventListener("load", updateOverlayHeight);
  window.addEventListener("resize", () => {
    updateOverlayHeight();
    if (!isMobile()) setSheet(false);
  });
  window.addEventListener("popstate", () => {
    readPath();
    state.query = "";
    els.search.value = "";
    render();
    resetGuideScroll();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== els.search) {
      event.preventDefault();
      els.search.focus();
    } else if (event.key === "Escape" && document.body.classList.contains("map-fullscreen")) {
      setFullMap(false);
    } else if (event.key === "Escape" && document.body.classList.contains("sheet-open")) {
      setSheet(false);
    } else if (event.key === "Escape" && state.query) {
      state.query = "";
      els.search.value = "";
      renderGuide();
      els.search.blur();
    } else if (/^[1-9]$/.test(event.key) && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "SELECT") {
      const n = Number(event.key);
      const location = currentLocation();
      if (location) {
        const entry = location.entries[n - 1];
        if (entry) {
          state.entryId = entry.id;
          renderMap();
          renderGuide();
          syncPath();
          resetGuideScroll();
          if (isMobile()) setSheet(true);
        }
      } else if (state.regionId === "all") {
        const region = regions[n - 1];
        if (region) enterRegion(region.id);
      } else {
        const destination = destinationsInRegion(state.regionId)[n - 1];
        if (destination) enterLocation(destination.id);
      }
    }
  });

  const updateConnectionState = () => {
    els.offlineBadge.hidden = navigator.onLine;
  };
  window.addEventListener("online", updateConnectionState);
  window.addEventListener("offline", updateConnectionState);
  updateConnectionState();

  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    els.install.hidden = false;
  });
  els.install.addEventListener("click", async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    els.install.hidden = true;
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    els.install.hidden = true;
  });

  window.addEventListener("beforeprint", () => document.body.classList.add("printing-entry"));
  window.addEventListener("afterprint", () => document.body.classList.remove("printing-entry"));

  if ("serviceWorker" in navigator) {
    const registerOfflineAtlas = () =>
      navigator.serviceWorker.register(assetHref("/service-worker.js"), { scope: routeHref("/") }).catch(() => {});
    if (document.readyState === "complete") registerOfflineAtlas();
    else window.addEventListener("load", registerOfflineAtlas, { once: true });
  }

  readPath();
  render();
  window.history.replaceState(
    { regionId: state.regionId, locationId: state.locationId, entryId: state.entryId },
    "",
    window.location.pathname
  );
  if (isMobile()) setSheet(Boolean(state.locationId));
})();
