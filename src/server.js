import express from "express";
import "dotenv/config";
import router from "./routes.js";

export const app = express()

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
