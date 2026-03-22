import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";

export const createUser = async (data, prismaClient = prisma) => {
  const alreadyExist = await prismaClient.user.findUnique({
    where: { email: data.email },
  });

  if (alreadyExist) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prismaClient.user.create({
    data: {
      email: data.email,
      passwordHash,
      userType: data.userType,
    },
    select: {
      id: true,
      email: true,
      userType: true,
      createdAt: true,
    },
  });
  return user;
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
      userType: true,
      addressId: true,
      createdAt: true,
    },
  });
};

export const getUserById = async (
  id,
  select = {
    id: true,
    email: true,
    userType: true,
    createdAt: true,
    organizationProfile: {
      select: { name: true },
    },
    recruiterProfile: {
      select: { firstName: true, lastName: true },
    },
    candidateProfile: {
      select: { firstName: true, lastName: true },
    },
  },
) => {
  return prisma.user.findUnique({ where: { id }, select });
};

export const getRecruitersByOrganization = async (
  organizationId,
  { page = 1, limit = 10 } = {},
) => {
  const skip = (page - 1) * limit;

  const [recruiters, total] = await Promise.all([
    prisma.recruiterProfile.findMany({
      where: { organizationId },
      skip,
      take: limit,
      orderBy: { user: { createdAt: "desc" } },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        publicEmail: true,
        publicPhone: true,
        linkedinUrl: true,
        about: true,
        isActive: true,
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.recruiterProfile.count({
      where: { organizationId },
    }),
  ]);

  return {
    data: recruiters,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const deleteRecruiter = async (recruiterId, organizationId) => {
  const recruiterProfile = await prisma.recruiterProfile.findUnique({
    where: { userId: recruiterId },
  });

  if (!recruiterProfile) {
    throw { status: 404, message: "Recruiter not found" };
  }

  if (recruiterProfile.organizationId !== organizationId) {
    throw {
      status: 403,
      message: "Recruiter does not belong to your organization",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.recruiterProfile.delete({
      where: { userId: recruiterId },
    });

    await tx.user.delete({
      where: { id: recruiterId },
    });
  });
};
