import Link from "next/link";
import { logoutGmMode } from "@/app/actions";
import { GmLoginForm } from "@/components/gm-login-form";
import { isGmModeEnabled } from "@/lib/gm-session";

export default async function GmPage() {
  const gmEnabled = await isGmModeEnabled();

  return (
    <main className="mx-auto grid min-h-[calc(100vh-68px)] w-full max-w-5xl place-items-center px-4 py-12 sm:px-8">
      <section className="marr-panel w-full max-w-xl rounded p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f1d1c8]/82">
          GM Mode
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#eee7d7]">
          {gmEnabled ? "Sealed notes unlocked" : "Open the sealed notes"}
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          {gmEnabled
            ? "GM-only descriptions, secrets, hidden relationships, notes, and stat blocks are visible in this browser session."
            : "Enter the table password to reveal GM-only descriptions, secrets, hidden relationships, notes, and stat blocks. The session lasts eight hours in this browser."}
        </p>

        {gmEnabled ? (
          <form action={logoutGmMode} className="mt-6">
            <button
              type="submit"
              className="w-full rounded border border-[#8b3a2f]/45 bg-[#8b3a2f]/18 px-4 py-3 font-semibold text-[#f1d1c8] transition hover:bg-[#8b3a2f]/26"
            >
              Lock GM Mode
            </button>
          </form>
        ) : (
          <GmLoginForm />
        )}

        <Link
          href="/map"
          className="mt-4 inline-flex text-sm text-[#c9924a] transition hover:text-[#eee7d7]"
        >
          Return to map
        </Link>
      </section>
    </main>
  );
}
