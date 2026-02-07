import jwt from "jsonwebtoken";
import { requireEnv } from "../utils/env.js";

export const authenticate = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authToken = req.headers?.authorization?.split(" ")?.[1];

      if (!authToken) throw new Error("Token required!");

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
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
