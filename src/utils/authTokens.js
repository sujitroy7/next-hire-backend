import jwt from "jsonwebtoken";
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

export const signRefreshToken = (user) => {
  const secret = requireEnv("JWT_REFRESH_SECRET");
  return jwt.sign(buildTokenPayload(user), secret, {
    expiresIn: refreshExpiresIn,
  });
};

export const verifyRefreshToken = (token) => {
  const secret = requireEnv("JWT_REFRESH_SECRET");
  return jwt.verify(token, secret);
};

export const getAccessTokenExpiresAt = () =>
  new Date(Date.now() + ACCESS_TOKEN_TTL_MS);

export const getRefreshTokenExpiresAt = () =>
  new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

const getCookieBaseOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  const sameSite = process.env.COOKIE_SAMESITE || "lax";
  const secureEnv = process.env.COOKIE_SECURE;
  const secure = secureEnv === "true" ? true : isProd;

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
  path: "/api/auth/refresh",
});

export const getCsrfCookieOptions = () => ({
  secure: true,
  sameSite: "lax",
  path: "/api/auth/refresh",
});
