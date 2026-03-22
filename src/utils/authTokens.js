import jwt from "jsonwebtoken";
import crypto from "crypto";
import { requireEnv } from "./env.js";

const FIFTEEN_MIN_IN_MS = 15 * 60 * 1000; // 15 Min
const FIFTEEN_DAY_IN_MS = 15 * 24 * 60 * 60 * 1000; // 15 Days

export const ACCESS_TOKEN_TTL_MS = FIFTEEN_MIN_IN_MS;
export const PERMISSION_TOKEN_TTL_MS = FIFTEEN_DAY_IN_MS;
export const REFRESH_TOKEN_TTL_MS = FIFTEEN_DAY_IN_MS;

const accessExpiresIn = "15m";
const permissionExpiresIn = "15d";

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

// ------------------ Cookie Config Options ------------------

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
  maxAge: PERMISSION_TOKEN_TTL_MS,
  path: "/",
});

// ------------------ Generator Functions ------------------

export function generatePermissionToken(userId, userRole) {
  return jwt.sign(
    {
      sub: userId,
      role: userRole, // ORGANIZATION, RECRUITER, CANDIDATE
    },
    requireEnv("PERMISSIONS_SECRET"),
    { expiresIn: permissionExpiresIn },
  );
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export async function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
