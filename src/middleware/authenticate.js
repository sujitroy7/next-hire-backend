import jwt from "jsonwebtoken";
import { getRequestTokens } from "../utils/authTokens.js";
import { requireEnv } from "../utils/env.js";

export const authenticate = (allowedRoles = []) => {
  return (req, res, next) => {
    const { authToken } = getRequestTokens(req);

    if (!authToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const decoded = jwt.verify(authToken, requireEnv("JWT_ACCESS_SECRET"));
      req.user = decoded; // attach user info to request

      if (
        !Array.isArray(allowedRoles) ||
        allowedRoles.length === 0 ||
        !allowedRoles.includes(req.user.userType)
      ) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
        });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
