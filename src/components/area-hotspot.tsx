"use client";

import type { KeyboardEvent } from "react";
import type { ContentCategory, ContentNode } from "@/content/types";

type AreaHotspotProps = {
  node: ContentNode;
  selected: boolean;
  onSelect: (node: ContentNode) => void;
};

const hotspotPaint: Record<ContentCategory, { fill: string; stroke: string }> = {
  landmark: { fill: "rgba(201, 146, 74, 0.16)", stroke: "#e7dcc3" },
  district: { fill: "rgba(111, 125, 83, 0.18)", stroke: "#c5c8a2" },
  settlement: { fill: "rgba(111, 125, 83, 0.18)", stroke: "#c5c8a2" },
  faction: { fill: "rgba(139, 58, 47, 0.18)", stroke: "#e1b4a9" },
  item: { fill: "rgba(201, 146, 74, 0.14)", stroke: "#e7dcc3" },
  relic: { fill: "rgba(201, 146, 74, 0.18)", stroke: "#ead7ad" },
  dungeon: { fill: "rgba(81, 71, 91, 0.22)", stroke: "#d4c9d8" },
  rumor: { fill: "rgba(231, 220, 195, 0.11)", stroke: "#d5c8ae" },
  npc: { fill: "rgba(111, 125, 83, 0.14)", stroke: "#d3d7b5" },
  lore: { fill: "rgba(111, 125, 83, 0.14)", stroke: "#d3d7b5" },
  hazard: { fill: "rgba(139, 58, 47, 0.22)", stroke: "#e1b4a9" },
  route: { fill: "rgba(99, 88, 65, 0.2)", stroke: "#dcc99d" },
  site: { fill: "rgba(201, 146, 74, 0.14)", stroke: "#e7dcc3" },
};

export function AreaHotspot({ node, selected, onSelect }: AreaHotspotProps) {
  if (!node.region) {
    return null;
  }

  const paint = hotspotPaint[node.category];
  const center = getRegionCenter(node);

  function handleKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(node);
    }
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Focus ${node.title}`}
      aria-pressed={selected}
      className="group cursor-pointer outline-none"
      onClick={() => onSelect(node)}
      onKeyDown={handleKeyDown}
    >
      {node.region.type === "box" ? (
        <rect
          x={node.region.x}
          y={node.region.y}
          width={node.region.width}
          height={node.region.height}
          rx="1.5"
          fill={paint.fill}
          stroke={paint.stroke}
          strokeWidth={selected ? 0.9 : 0.45}
          filter={selected ? "url(#hotspotGlow)" : undefined}
          className="transition-opacity duration-200 group-hover:opacity-100"
          opacity={selected ? 0.9 : 0.5}
        />
      ) : (
        <polygon
          points={node.region.points.map((point) => `${point.x},${point.y}`).join(" ")}
          fill={paint.fill}
          stroke={paint.stroke}
          strokeWidth={selected ? 0.9 : 0.45}
          filter={selected ? "url(#hotspotGlow)" : undefined}
          className="transition-opacity duration-200 group-hover:opacity-100"
          opacity={selected ? 0.9 : 0.5}
        />
      )}
      <circle
        cx={center.x}
        cy={center.y}
        r={selected ? 2.2 : 1.4}
        fill={paint.stroke}
        filter="url(#pinGlow)"
        className="transition-transform duration-200 group-hover:scale-125"
        style={{ transformOrigin: `${center.x}px ${center.y}px` }}
      />
      <text
        x={center.x}
        y={center.y - 3.2}
        textAnchor="middle"
        className="pointer-events-none select-none fill-[#eee7d7] text-[2.8px] font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100"
        paintOrder="stroke"
        stroke="rgba(0,0,0,0.72)"
        strokeWidth="0.8"
      >
        {node.shortLabel}
      </text>
      <title>{node.title}</title>
    </g>
  );
}

export function getRegionCenter(node: ContentNode) {
  if (node.zoomTarget) {
    return node.zoomTarget.center;
  }

  if (!node.region) {
    return { x: 50, y: 50 };
  }

  if (node.region.type === "box") {
    return {
      x: node.region.x + node.region.width / 2,
      y: node.region.y + node.region.height / 2,
    };
  }

  const totals = node.region.points.reduce(
    (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }),
    { x: 0, y: 0 },
  );

  return {
    x: totals.x / node.region.points.length,
    y: totals.y / node.region.points.length,
  };
}
