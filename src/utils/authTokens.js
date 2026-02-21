import jwt from "jsonwebtoken";
import crypto from "crypto";
import { requireEnv } from "./env.js";

export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

const accessExpiresIn = "15m";
const refreshExpiresIn = "15d";

const buildTokenPayload = (user) => ({
  sub: user.id,
  email: user.email,
  userType: user.userType,
  roles: [user.userType],
});

export const signAccessToken = (user) => {
  const secret = requireEnv("JWT_ACCESS_SECRET");
  return jwt.sign(buildTokenPayload(user), secret, {
    expiresIn: accessExpiresIn,
  });
};

const getCookieBaseOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  const sameSite = process.env.COOKIE_SAMESITE || "strict";
  const secureEnv = process.env.COOKIE_SECURE;
  const secure = secureEnv === "true" ? true : true; // Always true as requested

  const options = {
    httpOnly: true,
    secure,
    sameSite,
  };

  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
};

export const getAccessCookieOptions = () => ({
  ...getCookieBaseOptions(),
  maxAge: ACCESS_TOKEN_TTL_MS,
  path: "/",
});

export const getRefreshCookieOptions = () => ({
  ...getCookieBaseOptions(),
  maxAge: REFRESH_TOKEN_TTL_MS,
  path: "/",
});

export const getPermissionCookieOptions = () => ({
  ...getCookieBaseOptions(),
  maxAge: REFRESH_TOKEN_TTL_MS,
  path: "/",
});

export function generatePermissionToken(userId, userRole) {
  return jwt.sign(
    {
      sub: userId,
      role: userRole, // ORGANIZATION, RECRUITER, CANDIDATE
    },
    requireEnv("PERMISSIONS_SECRET"),
    { expiresIn: "15d" },
  );
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export async function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
