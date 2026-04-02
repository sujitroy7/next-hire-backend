import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes.js";
import { requireEnv } from "./utils/env.js";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

export const app = express();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 5 minutes",
  },
});

app.use(limiter);

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.use(morgan("dev"));

app.use(
  cors({
    origin: requireEnv("WHITE_LISTED_DOMAINS").split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
