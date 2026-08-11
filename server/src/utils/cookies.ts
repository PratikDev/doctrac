import type { CookieOptions } from "express";
import { env } from "@/config/env";

export const AUTH_COOKIE_NAME = "token";

// Client and server are different origins even in dev (different ports), but
// same registrable "site", so `lax` works locally. In production they may be
// on different domains entirely, which requires `none` + `secure`.
export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT expiry
};
