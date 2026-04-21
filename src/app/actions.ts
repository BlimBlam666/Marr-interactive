"use server";

import { redirect } from "next/navigation";
import {
  disableGmMode,
  enableGmMode,
  isGmPasswordConfigured,
  isValidGmPassword,
} from "@/lib/gm-session";

export async function loginGmMode(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!isGmPasswordConfigured()) {
    redirect("/gm?error=missing-config");
  }

  if (!isValidGmPassword(password)) {
    redirect("/gm?error=invalid-password");
  }

  await enableGmMode();
  redirect("/map");
}

export async function logoutGmMode() {
  await disableGmMode();
  redirect("/");
}
