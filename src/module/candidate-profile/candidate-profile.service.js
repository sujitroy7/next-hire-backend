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
      skills: data.skills || [],
    },
  });
};

export const getCandidateProfile = async (userId) => {
  return prisma.candidateProfile.findFirst({
    where: { userId },
  });
};

export const updateCandidateProfile = async (userId, data) => {
  const { experiences, ...profileData } = data;

  const candidateProfile = await prisma.candidateProfile.findFirst({
    where: { userId },
  });

  if (!candidateProfile) throw new Error("Candidate Profile not found");

  return await prisma.$transaction(async (tx) => {
    // 1. Update basic profile info
    if (Object.keys(profileData).length > 0) {
      await tx.candidateProfile.update({
        where: { userId },
        data: profileData,
      });
    }

    // 2. Handle Job Experiences if provided
    if (experiences) {
      const existingExperiences = await tx.candidateExperience.findMany({
        where: { candidateProfileId: candidateProfile.id },
      });

      const existingIds = existingExperiences.map((ex) => ex.id);
      const incomingIds = experiences
        .filter((job) => job.id)
        .map((job) => job.id);

      // Identify deletions
      const toDelete = existingIds.filter((id) => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        await tx.candidateExperience.deleteMany({
          where: {
            id: { in: toDelete },
            candidateProfileId: candidateProfile.id,
          },
        });
      }

      // Execute updates and creations
      for (const job of experiences) {
        if (job.id && existingIds.includes(job.id)) {
          // Update existing
          await tx.candidateExperience.update({
            where: { id: job.id },
            data: {
              companyName: job.companyName,
              jobTitle: job.jobTitle,
              startDate: job.startDate,
              endDate: job.endDate,
              description: job.description,
              location: job.location,
            },
          });
        } else {
          // Create new
          await tx.candidateExperience.create({
            data: {
              candidateProfileId: candidateProfile.id,
              companyName: job.companyName,
              jobTitle: job.jobTitle,
              startDate: job.startDate,
              endDate: job.endDate,
              description: job.description,
              location: job.location,
            },
          });
        }
      }
    }

    // Fetch and return the complete profile
    return tx.candidateProfile.findUnique({
      where: { userId },
      include: {
        experiences: {
          orderBy: { startDate: "desc" },
        },
      },
    });
  });
};
