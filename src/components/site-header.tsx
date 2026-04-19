import Link from "next/link";
import { logoutGmMode } from "@/app/actions";

type SiteHeaderProps = {
  gmEnabled: boolean;
};

export function SiteHeader({ gmEnabled }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b marr-hairline bg-[#0d0c09]/86 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Marr Interactive home">
          <span className="grid size-10 place-items-center rounded border border-[#c9924a]/35 bg-[#211d16] text-lg text-[#e7dcc3] shadow-[0_0_26px_rgba(201,146,74,0.12)] transition group-hover:border-[#e7dcc3]/45">
            M
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-[#e7dcc3]">
              Marr
            </span>
            <span className="block text-xs text-stone-500 transition group-hover:text-stone-300">
              Interactive Gazetteer
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 text-sm text-stone-300 sm:gap-2">
          <Link
            href="/map"
            className="rounded border border-transparent px-3 py-2 transition hover:border-[#c9924a]/30 hover:bg-[#c9924a]/10 hover:text-[#eee7d7]"
          >
            Map
          </Link>
          <Link
            href="/gm"
            className={`rounded border px-3 py-2 transition ${
              gmEnabled
                ? "border-[#8b3a2f]/55 bg-[#8b3a2f]/18 text-[#f1d1c8] hover:bg-[#8b3a2f]/26"
                : "border-transparent hover:border-[#c9924a]/30 hover:bg-[#c9924a]/10 hover:text-[#eee7d7]"
            }`}
          >
            {gmEnabled ? "GM On" : "GM"}
          </Link>
          {gmEnabled ? (
            <form action={logoutGmMode}>
              <button
                type="submit"
                className="rounded border border-[#8b3a2f]/55 bg-[#8b3a2f]/18 px-3 py-2 text-[#f1d1c8] transition hover:bg-[#8b3a2f]/26"
              >
                Lock
              </button>
            </form>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
