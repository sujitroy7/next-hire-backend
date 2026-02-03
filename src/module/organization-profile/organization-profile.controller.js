import { Prisma } from "@prisma/client";
import {
  createOrganizationProfile,
  getOrganizationProfile,
  updateOrganizationProfile,
} from "./organization-profile.service.js";

export const createOrganizationProfileHandler = async (req, res) => {
  const data = req.body;
  try {
    const user = await createOrganizationProfile(data);
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error.message);
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getOrganizationProfileHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getOrganizationProfile(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Organization Profile not found" });
    }
    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateOrganizationProfileHandler = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  try {
    const user = await updateOrganizationProfile(userId, data);
    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error.message);
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
    return res.status(500).json({ status: "error", message: error.message });
  }
};
