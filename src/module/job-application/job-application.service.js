import { prisma } from "../../config/prisma.js";

export const createJobApplication = async ({
  jobId,
  candidateId,
  resumeUrl,
}) => {
  const job = await prisma.job.findFirst({
    where: { id: jobId, isActive: true, publishedAt: { not: null } },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  const existingApplication = await prisma.jobApplication.findFirst({
    where: { jobId, candidateId },
  });

  if (existingApplication) {
    throw new Error("Job application already exists");
  }

  return prisma.jobApplication.create({
    data: {
      jobId,
      candidateId,
      resumeUrl,
    },
  });
};

export const getJobApplicationById = async (applicationId) => {
  return prisma.jobApplication.findFirst({
    where: { id: applicationId },
  });
};

export const getCandidateApplications = async (filters) => {
  const { candidateId, page, limit, sortBy, sortOrder, status, jobId } =
    filters;

  const allowedSortBy = ["appliedAt", "status"];
  const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "appliedAt";
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";
  const pageNumber =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const limitNumber =
    Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

  const where = {
    candidateId,
    ...(status ? { status } : {}),
    ...(jobId ? { jobId } : {}),
  };

  const [total, applications] = await Promise.all([
    prisma.jobApplication.count({ where }),
    prisma.jobApplication.findMany({
      where,
      orderBy: { [safeSortBy]: safeSortOrder },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        job: true,
      },
    }),
  ]);

  return { applications, total, page: pageNumber, limit: limitNumber };
};

export const getApplicationsByJob = async (filters) => {
  const { jobId, page, limit, sortBy, sortOrder, status } = filters;

  const allowedSortBy = ["appliedAt", "status"];
  const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "appliedAt";
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";
  const pageNumber =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const limitNumber =
    Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

  const where = {
    jobId,
    ...(status ? { status } : {}),
  };

  const [total, applications] = await Promise.all([
    prisma.jobApplication.count({ where }),
    prisma.jobApplication.findMany({
      where,
      orderBy: { [safeSortBy]: safeSortOrder },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        candidate: true,
      },
    }),
  ]);

  return { applications, total, page: pageNumber, limit: limitNumber };
};

export const updateJobApplicationStatus = async (applicationId, status) => {
  return prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status },
  });
};

export const getOrganizationCandidates = async (filters) => {
  const { organizationId, page, limit, search, status, jobId } = filters;

  const pageNumber =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const limitNumber =
    Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

  const where = {
    job: {
      organizationId,
    },
    ...(status ? { status } : {}),
    ...(jobId ? { jobId } : {}),
    ...(search
      ? {
          OR: [
            {
              candidate: {
                firstName: { contains: search, mode: "insensitive" },
              },
            },
            {
              candidate: {
                lastName: { contains: search, mode: "insensitive" },
              },
            },
            {
              job: {
                title: { contains: search, mode: "insensitive" },
              },
            },
          ],
        }
      : {}),
  };

  const [distinctCandidates, applications] = await Promise.all([
    prisma.jobApplication.groupBy({
      by: ["candidateId"],
      where,
    }),
    prisma.jobApplication.findMany({
      where,
      distinct: ["candidateId"],
      orderBy: { appliedAt: "desc" },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            headline: true,
            publicEmail: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
  ]);

  const total = distinctCandidates.length;

  return { applications, total, page: pageNumber, limit: limitNumber };
};

export const getRecentActivityForOrganization = async (
  organizationId,
  limit = 5,
) => {
  return prisma.jobApplication.findMany({
    where: {
      job: { organizationId },
    },
    orderBy: { appliedAt: "desc" },
    take: limit,
    include: {
      candidate: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      job: {
        select: {
          title: true,
        },
      },
    },
  });
};

export const getRecentActivityForRecruiter = async (recruiterId, limit = 5) => {
  return prisma.jobApplication.findMany({
    where: {
      job: { recruiterId },
    },
    orderBy: { appliedAt: "desc" },
    take: limit,
    include: {
      candidate: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      job: {
        select: {
          title: true,
        },
      },
    },
  });
};
