export type ContentNodeId = string;
export type MapDefinitionId = string;
export type AreaDefinitionId = string;

export type ContentCategory =
  | "landmark"
  | "district"
  | "settlement"
  | "faction"
  | "item"
  | "relic"
  | "dungeon"
  | "rumor"
  | "npc"
  | "lore"
  | "hazard"
  | "route"
  | "site";

export type MapLayer =
  | "surface"
  | "canopy"
  | "village"
  | "underground"
  | "gm"
  | "overlay";

export type ClickableRegion =
  | {
      type: "box";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "polygon";
      points: Array<{
        x: number;
        y: number;
      }>;
    };

export type ZoomTarget = {
  mapId?: MapDefinitionId;
  nodeId?: ContentNodeId;
  center: {
    x: number;
    y: number;
  };
  scale: number;
  minScale?: number;
  maxScale?: number;
};

export type DiscoveryStateHook = {
  key: string;
  label: string;
  description?: string;
  defaultState?: "hidden" | "known" | "visited" | "resolved";
};

export type RelatedNode = {
  id: ContentNodeId;
  relationship:
    | "contains"
    | "contained-by"
    | "ally"
    | "enemy"
    | "member"
    | "leader"
    | "seeks"
    | "guards"
    | "created"
    | "owns"
    | "knows"
    | "mentions"
    | "rumored"
    | "located-at"
    | "route-to";
  label?: string;
  gmOnly?: boolean;
};

export type StatBlock = {
  id: string;
  name: string;
  system?: "system-neutral" | "nsr" | "ose" | "custom";
  role: string;
  difficulty?: string;
  instincts?: string[];
  abilities?: string[];
  weaknesses?: string[];
  notes?: string;
};

export type GmContent = {
  description?: string;
  secrets?: string[];
  notes?: string[];
  statBlocks?: StatBlock[];
};

export type MapReference = {
  mapId: MapDefinitionId;
  layer: MapLayer;
  image?: string;
};

export type ContentNode = {
  id: ContentNodeId;
  title: string;
  shortLabel: string;
  category: ContentCategory;
  playerSummary: string;
  playerDescription: string;
  sensoryDetails?: string[];
  gm?: GmContent;
  related?: RelatedNode[];
  childNodeIds?: ContentNodeId[];
  parentNodeId?: ContentNodeId;
  map?: MapReference;
  region?: ClickableRegion;
  zoomTarget?: ZoomTarget;
  tags?: string[];
  hooks?: string[];
  rumors?: string[];
  discoveryHooks?: DiscoveryStateHook[];
};

export type MapDefinition = {
  id: MapDefinitionId;
  title: string;
  shortLabel: string;
  description: string;
  defaultLayer: MapLayer;
  image?: string;
  layers: Array<{
    id: MapLayer;
    title: string;
    image?: string;
    visibleByDefault?: boolean;
    gmOnly?: boolean;
  }>;
  nodeIds: ContentNodeId[];
  bounds: {
    width: number;
    height: number;
  };
};

export type AreaDefinition = {
  id: AreaDefinitionId;
  title: string;
  shortLabel: string;
  subtitle: string;
  description: string;
  mapId: MapDefinitionId;
  nodeIds: ContentNodeId[];
  parentAreaId?: AreaDefinitionId;
  childAreaIds?: AreaDefinitionId[];
  tags?: string[];
};

export type LoreArticle = {
  id: string;
  title: string;
  summary: string;
  body: string;
  nodeIds?: ContentNodeId[];
  tags?: string[];
  gm?: GmContent;
};

export type FactionEntry = {
  nodeId: ContentNodeId;
  alignment?: string;
  publicFace: string;
  wants: string[];
  methods: string[];
  rivals?: ContentNodeId[];
  allies?: ContentNodeId[];
};

export type NpcEntry = {
  nodeId: ContentNodeId;
  role: string;
  pronouns?: string;
  locationNodeId?: ContentNodeId;
  factionNodeIds?: ContentNodeId[];
  wants: string[];
  mannerisms?: string[];
};

export type ItemEntry = {
  nodeId: ContentNodeId;
  itemType: "relic" | "tool" | "treasure" | "key" | "oddity";
  properties: string[];
  bearerNodeId?: ContentNodeId;
};

export type GmAnnotation = {
  id: string;
  nodeId?: ContentNodeId;
  areaId?: AreaDefinitionId;
  mapId?: MapDefinitionId;
  title: string;
  body: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
};

export type GazetteerContent = {
  nodes: ContentNode[];
  maps: MapDefinition[];
  areas: AreaDefinition[];
  lore: LoreArticle[];
  factions: FactionEntry[];
  npcs: NpcEntry[];
  items: ItemEntry[];
  gmAnnotations: GmAnnotation[];
};
