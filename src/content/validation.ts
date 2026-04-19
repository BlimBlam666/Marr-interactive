import type {
  AreaDefinition,
  ClickableRegion,
  ContentNode,
  ContentNodeId,
  GazetteerContent,
  MapDefinition,
  RelatedNode,
} from "./types";

type ValidationIssue = {
  path: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

export function validateGazetteerContent(content: GazetteerContent): ValidationResult {
  const issues: ValidationIssue[] = [];
  const nodeIds = new Set<ContentNodeId>();
  const mapIds = new Set(content.maps.map((map) => map.id));
  const areaIds = new Set(content.areas.map((area) => area.id));

  for (const node of content.nodes) {
    if (nodeIds.has(node.id)) {
      issues.push({ path: `nodes.${node.id}`, message: "Duplicate content node id." });
    }

    nodeIds.add(node.id);
    validateNodeShape(node, issues);
  }

  for (const node of content.nodes) {
    validateNodeReferences(node, nodeIds, mapIds, issues);
  }

  for (const map of content.maps) {
    validateMap(map, nodeIds, issues);
  }

  for (const area of content.areas) {
    validateArea(area, nodeIds, mapIds, areaIds, issues);
  }

  for (const faction of content.factions) {
    validateReference(faction.nodeId, nodeIds, `factions.${faction.nodeId}.nodeId`, issues);
    faction.rivals?.forEach((id) =>
      validateReference(id, nodeIds, `factions.${faction.nodeId}.rivals`, issues),
    );
    faction.allies?.forEach((id) =>
      validateReference(id, nodeIds, `factions.${faction.nodeId}.allies`, issues),
    );
  }

  for (const npc of content.npcs) {
    validateReference(npc.nodeId, nodeIds, `npcs.${npc.nodeId}.nodeId`, issues);
    if (npc.locationNodeId) {
      validateReference(npc.locationNodeId, nodeIds, `npcs.${npc.nodeId}.locationNodeId`, issues);
    }
    npc.factionNodeIds?.forEach((id) =>
      validateReference(id, nodeIds, `npcs.${npc.nodeId}.factionNodeIds`, issues),
    );
  }

  for (const item of content.items) {
    validateReference(item.nodeId, nodeIds, `items.${item.nodeId}.nodeId`, issues);
    if (item.bearerNodeId) {
      validateReference(item.bearerNodeId, nodeIds, `items.${item.nodeId}.bearerNodeId`, issues);
    }
  }

  for (const article of content.lore) {
    article.nodeIds?.forEach((id) =>
      validateReference(id, nodeIds, `lore.${article.id}.nodeIds`, issues),
    );
  }

  for (const annotation of content.gmAnnotations) {
    if (annotation.nodeId) {
      validateReference(annotation.nodeId, nodeIds, `gmAnnotations.${annotation.id}.nodeId`, issues);
    }
    if (annotation.areaId && !areaIds.has(annotation.areaId)) {
      issues.push({
        path: `gmAnnotations.${annotation.id}.areaId`,
        message: `Unknown area id "${annotation.areaId}".`,
      });
    }
    if (annotation.mapId && !mapIds.has(annotation.mapId)) {
      issues.push({
        path: `gmAnnotations.${annotation.id}.mapId`,
        message: `Unknown map id "${annotation.mapId}".`,
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function assertValidGazetteerContent(content: GazetteerContent) {
  const result = validateGazetteerContent(content);

  if (!result.valid) {
    const details = result.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid gazetteer content:\n${details}`);
  }
}

export function getNodeById(content: GazetteerContent, id: ContentNodeId) {
  return content.nodes.find((node) => node.id === id);
}

export function getNodesForArea(content: GazetteerContent, area: AreaDefinition) {
  return area.nodeIds
    .map((id) => getNodeById(content, id))
    .filter((node): node is ContentNode => Boolean(node));
}

export function getNodesForMap(content: GazetteerContent, map: MapDefinition) {
  return map.nodeIds
    .map((id) => getNodeById(content, id))
    .filter((node): node is ContentNode => Boolean(node));
}

export function getRelatedNodes(content: GazetteerContent, related: RelatedNode[] = []) {
  return related
    .map((link) => {
      const node = getNodeById(content, link.id);

      return node ? { link, node } : undefined;
    })
    .filter((entry): entry is { link: RelatedNode; node: ContentNode } => Boolean(entry));
}

function validateNodeShape(node: ContentNode, issues: ValidationIssue[]) {
  if (!node.id.trim()) {
    issues.push({ path: "nodes", message: "Content node id cannot be empty." });
  }

  if (!node.title.trim()) {
    issues.push({ path: `nodes.${node.id}.title`, message: "Content node title cannot be empty." });
  }

  if (!node.shortLabel.trim()) {
    issues.push({
      path: `nodes.${node.id}.shortLabel`,
      message: "Content node short label cannot be empty.",
    });
  }

  if (node.region) {
    validateRegion(node.region, `nodes.${node.id}.region`, issues);
  }

  if (node.zoomTarget && node.zoomTarget.scale <= 0) {
    issues.push({
      path: `nodes.${node.id}.zoomTarget.scale`,
      message: "Zoom target scale must be greater than zero.",
    });
  }
}

function validateNodeReferences(
  node: ContentNode,
  nodeIds: Set<ContentNodeId>,
  mapIds: Set<string>,
  issues: ValidationIssue[],
) {
  if (node.parentNodeId) {
    validateReference(node.parentNodeId, nodeIds, `nodes.${node.id}.parentNodeId`, issues);
  }

  node.childNodeIds?.forEach((id) =>
    validateReference(id, nodeIds, `nodes.${node.id}.childNodeIds`, issues),
  );

  node.related?.forEach((related) =>
    validateReference(related.id, nodeIds, `nodes.${node.id}.related`, issues),
  );

  if (node.map && !mapIds.has(node.map.mapId)) {
    issues.push({
      path: `nodes.${node.id}.map.mapId`,
      message: `Unknown map id "${node.map.mapId}".`,
    });
  }

  if (node.zoomTarget?.mapId && !mapIds.has(node.zoomTarget.mapId)) {
    issues.push({
      path: `nodes.${node.id}.zoomTarget.mapId`,
      message: `Unknown map id "${node.zoomTarget.mapId}".`,
    });
  }
}

function validateMap(map: MapDefinition, nodeIds: Set<ContentNodeId>, issues: ValidationIssue[]) {
  map.nodeIds.forEach((id) => validateReference(id, nodeIds, `maps.${map.id}.nodeIds`, issues));

  if (map.bounds.width <= 0 || map.bounds.height <= 0) {
    issues.push({
      path: `maps.${map.id}.bounds`,
      message: "Map bounds must have positive width and height.",
    });
  }
}

function validateArea(
  area: AreaDefinition,
  nodeIds: Set<ContentNodeId>,
  mapIds: Set<string>,
  areaIds: Set<string>,
  issues: ValidationIssue[],
) {
  area.nodeIds.forEach((id) => validateReference(id, nodeIds, `areas.${area.id}.nodeIds`, issues));

  if (!mapIds.has(area.mapId)) {
    issues.push({ path: `areas.${area.id}.mapId`, message: `Unknown map id "${area.mapId}".` });
  }

  if (area.parentAreaId && !areaIds.has(area.parentAreaId)) {
    issues.push({
      path: `areas.${area.id}.parentAreaId`,
      message: `Unknown parent area id "${area.parentAreaId}".`,
    });
  }

  area.childAreaIds?.forEach((id) => {
    if (!areaIds.has(id)) {
      issues.push({
        path: `areas.${area.id}.childAreaIds`,
        message: `Unknown child area id "${id}".`,
      });
    }
  });
}

function validateReference(
  id: ContentNodeId,
  nodeIds: Set<ContentNodeId>,
  path: string,
  issues: ValidationIssue[],
) {
  if (!nodeIds.has(id)) {
    issues.push({ path, message: `Unknown content node id "${id}".` });
  }
}

function validateRegion(region: ClickableRegion, path: string, issues: ValidationIssue[]) {
  if (region.type === "box") {
    if (region.width <= 0 || region.height <= 0) {
      issues.push({ path, message: "Box regions must have positive width and height." });
    }

    return;
  }

  if (region.points.length < 3) {
    issues.push({ path, message: "Polygon regions need at least three points." });
  }
}
