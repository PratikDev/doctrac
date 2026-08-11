import { ApiError } from "@/middleware/errorHandler";
import { User } from "@/models/User";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/utils/cookies";
import { signAuthToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signAuthToken({ userId: user.id });
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
  res.json({ id: user.id, name: user.name, email: user.email });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  res.json({ id: user.id, name: user.name, email: user.email });
}
