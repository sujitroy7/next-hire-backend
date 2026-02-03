import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import router from "./routes.js";

export const app = express();

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(cookieParser());
app.use(router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
