import { prisma } from "../../config/prisma.js";

export const createCandidateProfile = async (data) => {
  const alreadyExist = await prisma.candidateProfile.findFirst({
    where: { userId: data.userId },
  });

  if (alreadyExist) throw new Error("Candidate Profile already exist");

  return prisma.candidateProfile.create({
    data: {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      headline: data.headline,
      bio: data.bio,
      publicPhone: data.publicPhone,
      publicEmail: data.publicEmail,
      linkedinUrl: data.linkedinUrl,
      websiteUrl: data.websiteUrl,
      isActive: data.isActive,
      isVerified: data.isVerified,
      isOpenToWork: data.isOpenToWork,
    },
  });
};

export const getCandidateProfile = async (userId) => {
  return prisma.candidateProfile.findFirst({
    where: { userId },
  });
};

export const updateCandidateProfile = async (userId, data) => {
  const alreadyExist = await prisma.candidateProfile.findFirst({
    where: { userId },
  });

  if (!alreadyExist) throw new Error("Candidate Profile not found");

  return prisma.candidateProfile.update({
    where: { userId },
    data,
  });
};
