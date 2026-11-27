"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ACCESS_COOKIE, accessCode, accessToken, checkCode, safeNext } from "@/lib/access";

export type UnlockState = { error?: string };

/** Checks the code (the server action is the check: the proxy only reads the cookie it sets). */
export async function unlock(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const code = String(formData.get("code") ?? "");
  if (!accessCode()) {
    return { error: "No access code is set on this site yet (DITHER_ACCESS_CODE). Add it in the hosting settings and redeploy." };
  }
  if (!(await checkCode(code))) {
    // Slow down guessing a little.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "That code doesn't work. Check it and try again." };
  }
  (await cookies()).set(ACCESS_COOKIE, await accessToken(code.trim()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect(safeNext(String(formData.get("next") ?? "")));
}
