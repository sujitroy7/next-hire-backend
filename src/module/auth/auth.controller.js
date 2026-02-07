import { authenticateUser, getUserById } from "./auth.service.js";
import {
  getAccessTokenExpiresAt,
  getCsrfCookieOptions,
  getRefreshCookieOptions,
  getRefreshTokenExpiresAt,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/authTokens.js";
import crypto from "crypto";

const buildAuthResponse = (user, accessToken) => ({
  user,
  roles: [user.userType],
  accessToken,
  session: {
    accessTokenExpiresAt: getAccessTokenExpiresAt(),
    refreshTokenExpiresAt: getRefreshTokenExpiresAt(),
  },
});

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser({ email, password });

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const accessToken = signAccessToken(user);
    const csrfToken = crypto.randomUUID();
    const refreshToken = signRefreshToken(user);

    res.cookie("refresh-token", refreshToken, getRefreshCookieOptions());
    res.cookie("csrf-token", csrfToken, getCsrfCookieOptions());

    return res
      .status(200)
      .json({ status: "success", data: buildAuthResponse(user, accessToken) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const refreshHandler = async (req, res) => {
  let refreshToken = req.cookies?.["refresh-token"];
  const csrfCookie = req.cookies.csrfToken;
  const csrfHeader = req.headers["x-csrf-token"];

  if (!refreshToken) {
    return res
      .status(401)
      .json({ status: "error", message: "Refresh token required" });
  }

  if (!csrfCookie || csrfHeader !== csrfCookie) return res.status(403);

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload || typeof payload === "string" || !payload.sub) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid refresh token" });
    }

    const user = await getUserById(payload.sub);

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid refresh token" });
    }

    const accessToken = signAccessToken(user);
    const newCsrfToken = crypto.randomUUID();
    const newRefreshToken = signRefreshToken(user);

    res.cookie("refresh-token", newRefreshToken, getRefreshCookieOptions());
    res.cookie("csrf-token", newCsrfToken, getCsrfCookieOptions());

    return res.status(200).json({
      status: "success",
      data: buildAuthResponse(user, accessToken),
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid refresh token" });
  }
};

export const logoutHandler = async (_req, res) => {
  res.clearCookie("refresh-token", getRefreshCookieOptions());
  res.clearCookie("csrf-token", newCsrfToken, getCsrfCookieOptions());

  return res.status(200).json({ status: "success" });
};
