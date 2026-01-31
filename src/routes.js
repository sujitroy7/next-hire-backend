import { Router } from "express";
import userRouter from "./module/user/user.routes.js";
// import profileRouter from "./module/users/user.routes.js";

const router = Router();

router.get("/health", (_, res) => res.json({ status: "ok 👍" }));
router.use("/users", userRouter);
// router.use("/profile", profileRouter);

export default router;
