import { Prisma } from "@prisma/client";
import {
  createCandidateProfile,
  getCandidateProfile,
  updateCandidateProfile,
} from "./candidate-profile.service.js";
import { getCandidateExperience } from "./candidate-experiance.services.js";
import { extractPdfDataGrpc } from "./pdf-processor.client.js";

export const createCandidateProfileHandler = async (req, res) => {
  const data = req.body;
  try {
    const user = await createCandidateProfile({
      ...data,
      userId: req.user.sub,
    });
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

export const getCandidateProfileHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getCandidateProfile(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Candidate Profile not found" });
    }
    const userJobs = await getCandidateExperience(userId);
    return res
      .status(200)
      .json({ status: "success", data: { ...user, experiences: userJobs } });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateCandidateProfileHandler = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  try {
    const user = await updateCandidateProfile(userId, data);
    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    console.error(error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const extractPdfDataHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "No PDF file provided" });
    }
    const data = await extractPdfDataGrpc(req.file.buffer);
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};
