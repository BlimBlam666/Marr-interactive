import { MapViewer } from "@/components/map-viewer";
import { campaignAreas, marrContent } from "@/content/marr";
import { getVisibleGazetteerContent } from "@/lib/gm-visibility";
import { isGmModeEnabled } from "@/lib/gm-session";

type MapPageProps = {
  searchParams?: Promise<{
    area?: string | string[];
    node?: string | string[];
  }>;
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const gmEnabled = await isGmModeEnabled();
  const visibleContent = getVisibleGazetteerContent(marrContent, gmEnabled);
  const params = await searchParams;
  const requestedAreaId = getSingleParam(params?.area);
  const requestedNodeId = getSingleParam(params?.node);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-8 sm:py-9">
      <div className="mb-6 flex flex-col gap-3 sm:mb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="marr-kicker">
            Explorable Reference
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[#eee7d7] sm:text-5xl">
            Marr Map
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-300">
            Explore the Tree, its village, and the root-dark infrastructure beneath
            Daemos&apos;s rule.
          </p>
        </div>
        <p className="max-w-sm text-sm leading-6 text-stone-500 lg:text-right">
          Select a hotspot to focus the map and open its codex entry.
          {gmEnabled ? " GM mode is showing sealed notes." : " Player-safe text is shown by default."}
        </p>
      </div>

      <MapViewer
        content={visibleContent}
        areas={campaignAreas}
        gmEnabled={gmEnabled}
        initialAreaId={requestedAreaId}
        initialNodeId={requestedNodeId}
      />
    </main>
  );
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
