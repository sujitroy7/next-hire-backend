import { prisma } from "../../config/prisma.js";

export const createOrganizationProfile = async (data) => {
  const alreadyExist = await prisma.organizationProfile.findFirst({
    where: { userId: data.userId },
  });

  if (alreadyExist) throw new Error("Organization Profile already exist");

  return prisma.organizationProfile.create({
    data: {
      userId: data.userId,
      name: data.name,
      about: data.about,
      isActive: data.isActive,
      isVerified: data.isVerified,
      organizationTypeId: data.organizationTypeId,
      publicEmail: data.publicEmail,
      publicPhone: data.publicPhone,
      websiteUrl: data.websiteUrl,
      linkedinUrl: data.linkedinUrl,
    },
  });
};

export const getOrganizationProfile = async (userId) => {
  return prisma.organizationProfile.findFirst({
    where: { userId },
  });
};

export const updateOrganizationProfile = async (userId, data) => {
  const alreadyExist = await prisma.organizationProfile.findFirst({
    where: { userId },
  });

  if (!alreadyExist) throw new Error("Organization Profile not found");

  return prisma.organizationProfile.update({
    where: { userId },
    data,
  });
};
