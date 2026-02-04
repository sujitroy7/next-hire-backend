import { prisma } from "../../config/prisma.js";

export const createRecruiterProfile = async (data) => {
  const {
    userId,
    organizationId,
    firstName,
    lastName,
    publicEmail,
    publicPhone,
    linkedinUrl,
    about,
    isActive = true,
  } = data;

  const alreadyExist = await prisma.organizationProfile.findFirst({
    where: { userId },
  });

  if (alreadyExist) throw new Error("Recruiter Profile already exist");

  return await prisma.recruiterProfile.create({
    data: {
      userId,
      organizationId,
      firstName,
      lastName,
      publicEmail,
      publicPhone,
      linkedinUrl,
      about,
      isActive,
    },
  });
};

export const updateRecruiterProfile = async (userId, data) => {
  const alreadyExist = await prisma.organizationProfile.findFirst({
    where: { userId },
  });

  if (alreadyExist) throw new Error("Recruiter Profile already exist");

  return await prisma.recruiterProfile.update({
    where: { userId },
    data,
  });
};

export const getRecruiterProfile = async (userId) => {
  return await prisma.recruiterProfile.findFirst({ where: { userId } });
};
