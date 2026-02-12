import {
  authenticateUser,
  createRefreshToken,
  revokeRefreshToken,
} from "./auth.service.js";
import {
  generatePermissionToken,
  generateRefreshToken,
  getAccessCookieOptions,
  getPermissionCookieOptions,
  getRefreshCookieOptions,
  signAccessToken,
} from "../../utils/authTokens.js";
import { getUserById } from "../user/user.service.js";

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser({ email, password });

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const refreshToken = generateRefreshToken();

    await createRefreshToken(user.id, {
      refreshToken,
      device: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    const permissionsToken = generatePermissionToken(user.id, user.userType);
    const accessToken = signAccessToken(user);

    res
      .cookie("refresh-token", refreshToken, getRefreshCookieOptions())
      .cookie("access-token", accessToken, getAccessCookieOptions())
      .cookie(
        "permissions-token",
        permissionsToken,
        getPermissionCookieOptions(),
      )
      .status(200)
      .json({
        status: "success",
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const refreshHandler = async (req, res) => {
  let refreshToken = req.cookies["refresh-token"];

  // validate input data
  if (!refreshToken) {
    return res
      .status(401)
      .json({ status: "error", message: "Refresh token required" });
  }

  try {
    // update old refresh token on DB
    const storedToken = await revokeRefreshToken(refreshToken);
    if (storedToken === null)
      return res
        .status(403)
        .json({ status: "error", message: "Invalid refresh token" });

    // create new refresh token on DB
    const newRefreshToken = generateRefreshToken();
    await createRefreshToken(storedToken.userId, {
      refreshToken: newRefreshToken,
      device: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    // return tokens
    const user = await getUserById(storedToken.userId);
    const accessToken = signAccessToken(user);
    res
      .cookie("refresh-token", newRefreshToken, getRefreshCookieOptions())
      .cookie("access-token", accessToken, getAccessCookieOptions())
      .cookie(
        "permissions-token",
        generatePermissionToken(user.id, user.userType),
        getPermissionCookieOptions(),
      )
      .status(200)
      .json({
        status: "success",
      });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      status: "error",
      message: "Invalid refresh token",
    });
  }
};

export const logoutHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
  } catch (error) {
    console.error(error);
  } finally {
    res.clearCookie("refresh-token", getRefreshCookieOptions());
    res.clearCookie("permissions-token", getPermissionCookieOptions());
    res.clearCookie("access-token", getAccessCookieOptions());
    return res.status(200).json({ status: "success" });
  }
};
