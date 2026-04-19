import type { ContentNode, GazetteerContent, LoreArticle } from "@/content/types";

export function getVisibleGazetteerContent(
  content: GazetteerContent,
  gmEnabled: boolean,
): GazetteerContent {
  if (gmEnabled) {
    return content;
  }

  return {
    ...content,
    nodes: content.nodes.map(stripGmNodeContent),
    lore: content.lore.map(stripGmLoreContent),
    gmAnnotations: [],
  };
}

export function hasGmContent(node: ContentNode) {
  return Boolean(
    node.gm?.description ||
      node.gm?.secrets?.length ||
      node.gm?.notes?.length ||
      node.gm?.statBlocks?.length ||
      node.related?.some((related) => related.gmOnly),
  );
}

function stripGmNodeContent(node: ContentNode): ContentNode {
  const publicNode = { ...node };
  delete publicNode.gm;

  return {
    ...publicNode,
    related: publicNode.related?.filter((related) => !related.gmOnly),
  };
}

function stripGmLoreContent(article: LoreArticle): LoreArticle {
  const publicArticle = { ...article };
  delete publicArticle.gm;

  return publicArticle;
}
