import { Router } from "express";
import authRouter from "./module/auth/auth.routes.js";
import userRouter from "./module/user/user.routes.js";
import organizationProfileRouter from "./module/organization-profile/organization-profile.routes.js";
import candidateProfileRouter from "./module/candidate-profile/candidate-profile.routes.js";

const router = Router();

router.get("/health", (_, res) => res.json({ status: "ok 👍" }));
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/organization-profile", organizationProfileRouter);
router.use("/candidate-profile", candidateProfileRouter);

export default router;
