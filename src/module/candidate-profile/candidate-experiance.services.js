import { prisma } from "../../config/prisma.js";

export const getCandidateExperience = async (userId) => {
  return prisma.candidateExperience.findMany({
    where: { candidateProfile: { userId } },
    orderBy: { startDate: "desc" },
  });
};
