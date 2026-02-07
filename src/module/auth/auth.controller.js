import { authenticateUser, getUserById } from "./auth.service.js";
import {
  getAccessCookieOptions,
  getAccessTokenExpiresAt,
  getRefreshCookieOptions,
  getRefreshTokenExpiresAt,
  getRequestTokens,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/authTokens.js";

const buildAuthResponse = (user) => ({
  user,
  roles: [user.userType],
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
    const refreshToken = signRefreshToken(user);

    res.cookie("auth-token", accessToken, getAccessCookieOptions());
    res.cookie("refresh-token", refreshToken, getRefreshCookieOptions());

    return res
      .status(200)
      .json({ status: "success", data: buildAuthResponse(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const refreshHandler = async (req, res) => {
  const { refreshToken } = getRequestTokens(req);

  if (!refreshToken) {
    return res
      .status(401)
      .json({ status: "error", message: "Refresh token required" });
  }

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
    const newRefreshToken = signRefreshToken(user);

    res.cookie("auth-token", accessToken, getAccessCookieOptions());
    res.cookie("refresh-token", newRefreshToken, getRefreshCookieOptions());

    return res
      .status(200)
      .json({ status: "success", data: buildAuthResponse(user) });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid refresh token" });
  }
};

export const logoutHandler = async (_req, res) => {
  res.clearCookie("auth-token", getAccessCookieOptions());
  res.clearCookie("refresh-token", getRefreshCookieOptions());

  return res.status(200).json({ status: "success" });
};
