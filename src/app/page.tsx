import Link from "next/link";
import { campaignAreas } from "@/content/marr";
import { isGmModeEnabled } from "@/lib/gm-session";

export default async function Home() {
  const gmEnabled = await isGmModeEnabled();

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b marr-hairline">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_26%,rgba(111,125,83,0.28),transparent_24%),radial-gradient(circle_at_52%_62%,rgba(201,146,74,0.12),transparent_18%)]" />
        <div className="absolute left-1/2 top-10 -z-10 h-[680px] w-[300px] -translate-x-1/2 rounded-[48%] border border-[#e7dcc3]/10 bg-gradient-to-b from-[#e7dcc3]/8 via-[#2a1f15] to-[#070605] shadow-[0_0_120px_rgba(111,125,83,0.16)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#0d0c09] to-transparent" />

        <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl py-8">
            <p className="marr-kicker">
              Interactive fantasy gazetteer
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.96] text-[#eee7d7] sm:text-7xl">
              Marr Interactive
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              A visual reference for the village under the Tree: cages in the canopy,
              names buried in root-dark ledgers, and the quiet machinery of Daemos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/map"
                className="rounded border border-[#e7dcc3]/45 bg-[#e7dcc3] px-5 py-3 font-semibold text-[#17140f] transition hover:border-white hover:bg-white"
              >
                Enter the Map
              </Link>
              <Link
                href="/gm"
                className="rounded border border-[#e7dcc3]/16 bg-[#17140f]/72 px-5 py-3 font-semibold text-stone-200 transition hover:border-[#c9924a]/45 hover:text-[#eee7d7]"
              >
                {gmEnabled ? "GM Mode Active" : "Unlock GM Mode"}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 py-6 lg:py-0">
            {campaignAreas.map((area) => (
              <Link
                key={area.id}
                href="/map"
                className="marr-panel group rounded p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#c9924a]/38"
              >
                <p className="marr-kicker">
                  {area.nodeIds.length} nodes
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#eee7d7]">{area.title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-300">{area.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
