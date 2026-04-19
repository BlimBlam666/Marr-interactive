import { MapViewer } from "@/components/map-viewer";
import { campaignAreas, marrContent } from "@/content/marr";
import { getVisibleGazetteerContent } from "@/lib/gm-visibility";
import { isGmModeEnabled } from "@/lib/gm-session";

export default async function MapPage() {
  const gmEnabled = await isGmModeEnabled();
  const visibleContent = getVisibleGazetteerContent(marrContent, gmEnabled);

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
          Player view stays clean; GM mode reveals sealed notes without changing the map.
        </p>
      </div>

      <MapViewer content={visibleContent} areas={campaignAreas} gmEnabled={gmEnabled} />
    </main>
  );
}
