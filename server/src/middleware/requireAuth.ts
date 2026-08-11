import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/middleware/errorHandler";
import { AUTH_COOKIE_NAME } from "@/utils/cookies";
import { verifyAuthToken } from "@/utils/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies[AUTH_COOKIE_NAME] as string | undefined;

  if (!token) {
    throw new ApiError(401, "Not authenticated");
  }

  try {
    const payload = verifyAuthToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired session");
  }
}
