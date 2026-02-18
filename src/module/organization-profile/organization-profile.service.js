import { prisma } from "../../config/prisma.js";

export const createOrganizationProfile = async (data) => {
  const { address, ...profileData } = data;

  const alreadyExist = await prisma.organizationProfile.findFirst({
    where: { userId: profileData.userId },
  });

  if (alreadyExist) throw new Error("Organization Profile already exist");

  return prisma.$transaction(async (tx) => {
    // If address is provided, create it and link to the user
    if (address) {
      const newAddress = await tx.address.create({
        data: address,
      });

      await tx.user.update({
        where: { id: profileData.userId },
        data: { addressId: newAddress.id },
      });
    }

    const profile = await tx.organizationProfile.create({
      data: {
        userId: profileData.userId,
        name: profileData.name,
        about: profileData.about,
        isActive: profileData.isActive,
        isVerified: profileData.isVerified,
        organizationType: profileData.organizationType,
        publicEmail: profileData.publicEmail,
        publicPhone: profileData.publicPhone,
        websiteUrl: profileData.websiteUrl,
        linkedinUrl: profileData.linkedinUrl,
        logoUrl: profileData.logoUrl,
        employeeCount: profileData.employeeCount,
        galleryImages: profileData.galleryImages,
      },
      include: {
        user: {
          select: { address: true },
        },
      },
    });

    const { user, ...rest } = profile;
    return { ...rest, address: user?.address ?? null };
  });
};

export const getOrganizationProfile = async (userId) => {
  const profile = await prisma.organizationProfile.findFirst({
    where: { userId },
    include: {
      user: {
        select: { address: true },
      },
    },
  });

  if (!profile) return null;

  const { user, ...rest } = profile;
  return { ...rest, address: user?.address ?? null };
};

export const updateOrganizationProfile = async (userId, data) => {
  const { address, ...profileData } = data;

  const alreadyExist = await prisma.organizationProfile.findFirst({
    where: { userId },
  });

  if (!alreadyExist) throw new Error("Organization Profile not found");

  return prisma.$transaction(async (tx) => {
    // If address is provided, upsert it
    if (address) {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { addressId: true },
      });

      if (user?.addressId) {
        // Update existing address
        await tx.address.update({
          where: { id: user.addressId },
          data: address,
        });
      } else {
        // Create new address and link to user
        const newAddress = await tx.address.create({
          data: address,
        });

        await tx.user.update({
          where: { id: userId },
          data: { addressId: newAddress.id },
        });
      }
    }

    const profile = await tx.organizationProfile.update({
      where: { userId },
      data: profileData,
      include: {
        user: {
          select: { address: true },
        },
      },
    });

    const { user, ...rest } = profile;
    return { ...rest, address: user?.address ?? null };
  });
};
