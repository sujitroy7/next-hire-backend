import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes.js";
import { requireEnv } from "./utils/env.js";
import morgan from "morgan";

export const app = express();

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
