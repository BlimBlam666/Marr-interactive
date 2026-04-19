import { cookies } from "next/headers";

export const GM_COOKIE_NAME = "marr_gm_mode";
const GM_COOKIE_VALUE = "enabled";

export async function isGmModeEnabled() {
  const cookieStore = await cookies();

  return cookieStore.get(GM_COOKIE_NAME)?.value === GM_COOKIE_VALUE;
}

export async function enableGmMode() {
  const cookieStore = await cookies();

  cookieStore.set(GM_COOKIE_NAME, GM_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function disableGmMode() {
  const cookieStore = await cookies();

  cookieStore.delete(GM_COOKIE_NAME);
}

export function isValidGmPassword(password: string) {
  const configuredPassword = process.env.MARR_GM_PASSWORD;

  return Boolean(configuredPassword) && password === configuredPassword;
}
