"use client";

import { useMemo, useState } from "react";
import type { AreaDefinition, ContentNode, GazetteerContent, MapDefinition } from "@/content/types";
import { getNodeById, getNodesForArea } from "@/content/validation";
import { AreaHotspot, getRegionCenter } from "./area-hotspot";
import { Breadcrumbs } from "./breadcrumbs";
import { InfoPanel } from "./info-panel";

type MapViewerProps = {
  content: GazetteerContent;
  areas: AreaDefinition[];
  gmEnabled: boolean;
};

export function MapViewer({ content, areas, gmEnabled }: MapViewerProps) {
  const [selectedAreaId, setSelectedAreaId] = useState(areas[0]?.id ?? "");
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();

  const selectedArea = areas.find((area) => area.id === selectedAreaId) ?? areas[0];
  const selectedMap = content.maps.find((map) => map.id === selectedArea?.mapId);
  const areaNodes = useMemo(
    () => (selectedArea ? getNodesForArea(content, selectedArea).filter((node) => node.region) : []),
    [content, selectedArea],
  );
  const selectedNode = selectedNodeId ? getNodeById(content, selectedNodeId) : undefined;
  const focusedNode =
    selectedNode && selectedNode.map?.mapId === selectedMap?.id && selectedNode.region
      ? selectedNode
      : undefined;
  const viewBox = getFocusedViewBox(selectedMap, focusedNode);

  function selectArea(areaId: string) {
    setSelectedAreaId(areaId);
    setSelectedNodeId(undefined);
  }

  function selectNode(node: ContentNode) {
    const nodeArea = areas.find((area) => area.nodeIds.includes(node.id));

    if (nodeArea && nodeArea.id !== selectedAreaId) {
      setSelectedAreaId(nodeArea.id);
    }

    setSelectedNodeId(node.id);
  }

  function resetToOverview() {
    setSelectedAreaId(areas[0]?.id ?? "");
    setSelectedNodeId(undefined);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {gmEnabled ? (
        <div className="rounded border border-[#c9924a]/35 bg-[#3a2515]/35 px-4 py-3 text-sm leading-6 text-[#ead8ba] shadow-[0_0_28px_rgba(201,146,74,0.08)]">
          <span className="font-semibold text-[#f0c987]">GM mode active.</span>{" "}
          Sealed notes, secrets, stat ideas, and hidden relationships can appear in the codex.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Breadcrumbs
          area={selectedArea}
          selectedNode={selectedNode}
          onReset={resetToOverview}
          onAreaReset={() => setSelectedNodeId(undefined)}
        />
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => (
            <button
              key={area.id}
              type="button"
              aria-pressed={area.id === selectedArea.id}
              onClick={() => selectArea(area.id)}
              className={`rounded border px-4 py-2 text-sm transition ${
                area.id === selectedArea.id
                  ? "border-[#c9924a]/45 bg-[#c9924a]/13 text-[#eee7d7]"
                  : "marr-hairline bg-[#17140f]/55 text-stone-300 hover:border-[#c9924a]/32 hover:text-[#eee7d7]"
              }`}
            >
              {area.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="min-w-0">
          <div className="marr-panel overflow-hidden rounded">
            {selectedMap ? (
              <svg
                viewBox={viewBox}
                role="img"
                aria-label={`${selectedArea.title} interactive map`}
                className="block aspect-[4/3] min-h-[280px] w-full bg-[#10110d] transition-[view-box] duration-300 sm:min-h-[460px]"
              >
                <defs>
                  <filter id="hotspotGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="0" stdDeviation="1.15" floodColor="#e7dcc3" floodOpacity="0.62" />
                  </filter>
                  <filter id="pinGlow" x="-80%" y="-80%" width="260%" height="260%">
                    <feDropShadow dx="0" dy="0" stdDeviation="1.1" floodColor="#e7dcc3" floodOpacity="0.72" />
                  </filter>
                  <radialGradient id="treeGlow" cx="50%" cy="35%" r="46%">
                    <stop offset="0%" stopColor="#6f7d53" stopOpacity="0.34" />
                    <stop offset="58%" stopColor="#2f3a24" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#090807" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="underGlow" cx="50%" cy="45%" r="58%">
                    <stop offset="0%" stopColor="#6b5f74" stopOpacity="0.22" />
                    <stop offset="68%" stopColor="#2a2430" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#090807" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {selectedArea.id === "undamarr" ? <UndaMarrArt /> : <SurfaceMarrArt />}

                {areaNodes.length ? (
                  areaNodes.map((node) => (
                    <AreaHotspot
                      key={node.id}
                      node={node}
                      selected={focusedNode?.id === node.id}
                      onSelect={selectNode}
                    />
                  ))
                ) : (
                  <text x="50" y="50" textAnchor="middle" className="fill-stone-400 text-[3px]">
                    No mapped nodes yet
                  </text>
                )}
              </svg>
            ) : (
              <div className="grid aspect-[4/3] min-h-[280px] place-items-center p-8 text-center sm:min-h-[460px]">
                <div>
                  <p className="text-lg font-semibold text-stone-100">Map unavailable</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-stone-400">
                    This area does not have a map definition yet. Add one to content before
                    assigning clickable nodes.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 rounded border marr-hairline bg-[#17140f]/45 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-[#eee7d7]">{selectedArea.title}</h2>
                <p className="mt-1 text-sm text-[#c9924a]/85">{selectedArea.subtitle}</p>
              </div>
              {selectedMap ? (
                <span className="rounded border marr-hairline bg-black/20 px-2.5 py-1 text-xs text-stone-400">
                  {selectedMap.shortLabel} / {selectedMap.defaultLayer}
                </span>
              ) : null}
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
              {selectedArea.description}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {areaNodes.map((node) => (
              <button
                key={node.id}
                type="button"
                aria-pressed={selectedNode?.id === node.id}
                onClick={() => selectNode(node)}
                className={`rounded border px-2.5 py-1.5 text-xs transition ${
                  selectedNode?.id === node.id
                    ? "border-[#c9924a]/45 bg-[#c9924a]/13 text-[#eee7d7]"
                    : "marr-hairline bg-[#17140f]/38 text-stone-400 hover:border-[#c9924a]/32 hover:text-[#eee7d7]"
                }`}
              >
                {node.shortLabel}
              </button>
            ))}
          </div>
        </section>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <InfoPanel
            content={content}
            node={selectedNode}
            onSelectNode={selectNode}
            gmEnabled={gmEnabled}
          />
        </div>
      </div>
    </div>
  );
}

function getFocusedViewBox(map: MapDefinition | undefined, node: ContentNode | undefined) {
  const bounds = map?.bounds ?? { width: 100, height: 100 };

  if (!node) {
    return `0 0 ${bounds.width} ${bounds.height}`;
  }

  const center = node.zoomTarget?.center ?? getRegionCenter(node);
  const scale = node.zoomTarget?.scale ?? 1.85;
  const width = bounds.width / scale;
  const height = bounds.height / scale;
  const x = clamp(center.x - width / 2, 0, bounds.width - width);
  const y = clamp(center.y - height / 2, 0, bounds.height - height);

  return `${x} ${y} ${width} ${height}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function SurfaceMarrArt() {
  return (
    <g>
      <rect width="100" height="100" fill="#10110d" />
      <rect width="100" height="100" fill="url(#treeGlow)" />
      <path d="M2 78 C18 70 27 73 42 66 C60 58 74 65 98 53 L100 100 L0 100 Z" fill="#202415" />
      <path d="M10 59 C29 54 39 62 52 56 C65 50 77 47 92 51" fill="none" stroke="#5d482c" strokeWidth="2.3" strokeLinecap="round" opacity="0.58" />
      <path d="M21 76 C35 65 44 70 55 61 C70 49 79 54 88 45" fill="none" stroke="#715733" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <ellipse cx="50" cy="31" rx="22" ry="20" fill="#26301d" opacity="0.94" />
      <ellipse cx="42" cy="27" rx="14" ry="12" fill="#344023" opacity="0.82" />
      <ellipse cx="60" cy="30" rx="14" ry="13" fill="#303b22" opacity="0.84" />
      <path d="M46 28 C47 43 43 56 39 73 L58 73 C54 55 54 42 53 28 Z" fill="#2a1f15" />
      <path d="M48 33 C47 48 47 59 45 72" fill="none" stroke="#7b552f" strokeWidth="1.1" opacity="0.52" />
      <path d="M53 34 C55 49 56 61 58 72" fill="none" stroke="#14100c" strokeWidth="1.2" opacity="0.7" />
      <path d="M41 72 C34 76 27 79 18 83" fill="none" stroke="#382416" strokeWidth="3.2" strokeLinecap="round" opacity="0.78" />
      <path d="M57 72 C67 75 77 78 88 86" fill="none" stroke="#2b1d14" strokeWidth="3.1" strokeLinecap="round" opacity="0.78" />
      <g fill="#2b251b" stroke="#9b7a4b" strokeWidth="0.25" opacity="0.88">
        <rect x="24" y="57" width="5" height="4" rx="0.4" />
        <rect x="31" y="60" width="6" height="4.5" rx="0.4" />
        <rect x="63" y="66" width="5.5" height="4" rx="0.4" />
        <rect x="67" y="29" width="5" height="4" rx="0.4" />
      </g>
      <circle cx="58" cy="50" r="3.5" fill="#4d391f" stroke="#e7dcc3" strokeWidth="0.4" opacity="0.82" />
      <path d="M31 24 C35 22 39 22 43 24" fill="none" stroke="#d1c4aa" strokeWidth="0.7" strokeLinecap="round" opacity="0.58" />
      <path d="M35 24 L35 30 M39 23.5 L39 30" stroke="#d1c4aa" strokeWidth="0.35" opacity="0.58" />
    </g>
  );
}

function UndaMarrArt() {
  return (
    <g>
      <rect width="100" height="100" fill="#0b0908" />
      <rect width="100" height="100" fill="url(#underGlow)" />
      <path d="M50 0 C48 15 54 26 50 38 C46 51 50 67 47 100" fill="none" stroke="#372519" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 38 C35 47 26 52 12 67" fill="none" stroke="#2d2118" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M52 43 C67 48 76 55 91 68" fill="none" stroke="#2d2118" strokeWidth="4.4" strokeLinecap="round" />
      <path d="M31 60 C45 56 55 56 69 60" fill="none" stroke="#101015" strokeWidth="7.5" strokeLinecap="round" opacity="0.7" />
      <path d="M24 61 C42 58 58 58 76 62" fill="none" stroke="#25252c" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="50" cy="38" rx="12" ry="9" fill="#21170f" stroke="#a99aa8" strokeWidth="0.35" opacity="0.82" />
      <g fill="#21170f" stroke="#7d6743" strokeWidth="0.22" opacity="0.88">
        <rect x="27" y="56" width="5" height="4" rx="0.4" />
        <rect x="33" y="59" width="4.5" height="3.5" rx="0.4" />
        <rect x="37" y="55" width="4" height="3" rx="0.4" />
      </g>
      <path d="M62 52 C68 49 76 52 81 60 C75 68 66 70 58 64" fill="#2a1d28" opacity="0.58" />
      <path d="M63 53 C70 56 73 61 78 68" fill="none" stroke="#b9796e" strokeWidth="0.6" opacity="0.48" />
    </g>
  );
}
