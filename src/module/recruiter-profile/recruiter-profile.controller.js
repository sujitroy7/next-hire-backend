import {
  getRecruiterProfile,
  updateRecruiterProfile,
} from "./recruiter-profile.service.js";

export const getRecruiterProfileHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await getRecruiterProfile(userId);
    return res.status(200).json({ status: "success", data: profile });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateRecruiterProfileHandler = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  try {
    const profile = await updateRecruiterProfile(userId, data);
    return res.status(201).json({ status: "success", data: profile });
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
