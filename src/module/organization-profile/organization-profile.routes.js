import { Router } from "express";
import {
  createOrganizationProfileHandler,
  getOrganizationProfileHandler,
  updateOrganizationProfileHandler,
} from "./organization-profile.controller.js";
import {
  createOrganizationProfileSchema,
  updateOrganizationProfileSchema,
} from "./organization-profile.schema.js";
import { validateRequest } from "../../middleware/validateRequest.js";

const router = Router();

router.post(
  "/",
  validateRequest(createOrganizationProfileSchema),
  createOrganizationProfileHandler,
);

router.get("/:userId", getOrganizationProfileHandler);

router.patch(
  "/:userId",
  validateRequest(updateOrganizationProfileSchema),
  updateOrganizationProfileHandler,
);

export default router;
