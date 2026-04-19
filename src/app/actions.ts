"use server";

import { redirect } from "next/navigation";
import { disableGmMode, enableGmMode, isValidGmPassword } from "@/lib/gm-session";

export type GmLoginState = {
  error?: string;
};

export async function loginGmMode(
  _previousState: GmLoginState,
  formData: FormData,
): Promise<GmLoginState> {
  const password = String(formData.get("password") ?? "");

  if (!isValidGmPassword(password)) {
    return {
      error: "That password did not open the sealed notes.",
    };
  }

  await enableGmMode();
  redirect("/map");
}

export async function logoutGmMode() {
  await disableGmMode();
  redirect("/");
}
