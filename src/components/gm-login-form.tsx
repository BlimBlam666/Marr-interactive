"use client";

import { useActionState } from "react";
import { type GmLoginState, loginGmMode } from "@/app/actions";

const initialState: GmLoginState = {};

export function GmLoginForm() {
  const [state, formAction, isPending] = useActionState(loginGmMode, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-stone-200" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="w-full rounded border marr-hairline bg-black/28 px-4 py-3 text-stone-50 outline-none transition placeholder:text-stone-600 focus:border-[#c9924a]/55"
        placeholder="Table password"
      />
      {state.error ? (
        <p className="rounded border border-[#8b3a2f]/38 bg-[#8b3a2f]/15 px-3 py-2 text-sm text-[#f1d1c8]">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded border border-[#e7dcc3]/45 bg-[#e7dcc3] px-4 py-3 font-semibold text-[#17140f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Opening..." : "Enter GM Mode"}
      </button>
    </form>
  );
}
