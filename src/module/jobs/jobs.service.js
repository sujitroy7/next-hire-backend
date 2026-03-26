import { prisma } from "../../config/prisma.js";

export const createJob = async (data) => {
  const {
    recruiterId,
    organizationId,
    title,
    description,
    employmentType,
    department,
    location,
    workplaceType,
    experienceLevel,
    currency,
    salaryMin,
    salaryMax,
    salaryInterval,
    skills,
    vacancies,
    externalApplyUrl,
    publishedAt,
    expiresAt,
  } = data;

  return await prisma.job.create({
    data: {
      recruiterId,
      organizationId,
      title,
      description,
      employmentType,
      department,
      location,
      workplaceType,
      experienceLevel,
      currency,
      salaryMin,
      salaryMax,
      salaryInterval,
      skills,
      vacancies,
      externalApplyUrl,
      publishedAt,
      expiresAt,
    },
  });
};

export const getAllJobsByRecruiter = async (filters) => {
  const { page, limit, search, recruiterId, status } = filters;

  const pageNumber =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const limitNumber =
    Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

  const where = {
    recruiterId,
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    }),
  ]);

  return { jobs, total, page: pageNumber, limit: limitNumber };
};

export const getJobDetailes = async (
  jobId,
  where = {
    id: jobId,
    status: "PUBLISHED",
  },
  select = {
    id: true,
    title: true,
    description: true,
    employmentType: true,
    department: true,
    location: true,
    workplaceType: true,
    experienceLevel: true,
    currency: true,
    salaryMin: true,
    salaryMax: true,
    salaryInterval: true,
    skills: true,
    vacancies: true,
    externalApplyUrl: true,
    publishedAt: true,
    expiresAt: true,
    createdAt: true,
    updatedAt: true,
  },
) => {
  return await prisma.job.findFirst({
    where,
    select,
  });
};

export const updateJob = async (jobId, data) => {
  const {
    title,
    description,
    employmentType,
    department,
    location,
    workplaceType,
    experienceLevel,
    currency,
    salaryMin,
    salaryMax,
    salaryInterval,
    skills,
    vacancies,
    externalApplyUrl,
    publishedAt,
    expiresAt,
  } = data;

  return await prisma.job.update({
    data: {
      title,
      description,
      employmentType,
      department,
      location,
      workplaceType,
      experienceLevel,
      currency,
      salaryMin,
      salaryMax,
      salaryInterval,
      skills,
      vacancies,
      externalApplyUrl,
      publishedAt,
      expiresAt,
    },
    where: {
      id: jobId,
    },
  });
};

export const getCandidateJobs = async (filters) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    employmentType,
    workplaceType,
    experienceLevel,
    organizationId,
    recruiterId,
    search,
    salaryMin,
    salaryMax,
    publishedFrom,
    publishedTo,
    createdFrom,
    createdTo,
  } = filters;

  const allowedSortBy = [
    "publishedAt",
    "createdAt",
    "salaryMin",
    "salaryMax",
    "title",
  ];
  const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "publishedAt";
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";
  const pageNumber =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const limitNumber =
    Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const normalizedSalaryMin = Number.isFinite(Number(salaryMin))
    ? Number(salaryMin)
    : undefined;
  const normalizedSalaryMax = Number.isFinite(Number(salaryMax))
    ? Number(salaryMax)
    : undefined;

  const where = {
    status: "PUBLISHED",
  };

  if (employmentType) {
    where.employmentType = { in: employmentType };
  }

  if (workplaceType) {
    where.workplaceType = { in: workplaceType };
  }

  if (experienceLevel) {
    where.experienceLevel = { in: experienceLevel };
  }

  if (organizationId) where.organizationId = organizationId;
  if (recruiterId) where.recruiterId = recruiterId;

  if (normalizedSalaryMin !== undefined) {
    where.salaryMin = { gte: normalizedSalaryMin };
  }

  if (normalizedSalaryMax !== undefined) {
    where.salaryMax = { lte: normalizedSalaryMax };
  }

  if (publishedFrom || publishedTo) {
    where.publishedAt = {};
    if (publishedFrom) where.publishedAt.gte = publishedFrom;
    if (publishedTo) where.publishedAt.lte = publishedTo;
  }

  if (createdFrom || createdTo) {
    where.createdAt = {};
    if (createdFrom) where.createdAt.gte = createdFrom;
    if (createdTo) where.createdAt.lte = createdTo;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { [safeSortBy]: safeSortOrder },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    }),
  ]);

  return { jobs, total, page: pageNumber, limit: limitNumber };
};

export const getJobDetailsForRecruiter = async (jobId, recruiterId) => {
  return await prisma.job.findFirst({
    where: {
      id: jobId,
      recruiterId,
    },
  });
};

export const updateJobStatus = async (jobId, status) => {
  return await prisma.job.update({
    where: { id: jobId },
    data: { status },
  });
};

export const getJobsByOrganization = async (
  organizationId,
  page,
  limit,
  search,
  status,
) => {
  const pageNumber =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const limitNumber =
    Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

  const where = {
    organizationId,
    ...(status ? { status } : {}),
    ...(search
      ? { OR: [{ title: { contains: search, mode: "insensitive" } }] }
      : {}),
  };

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    }),
  ]);

  return { jobs, total, page: pageNumber, limit: limitNumber };
};

export const getJobDetailsForOrganization = async (jobId, organizationId) => {
  return await prisma.job.findFirst({
    where: {
      id: jobId,
      organizationId,
    },
  });
};

export const getJobTitlesForAutocomplete = async (searchQuery, limit) => {
  const titles = await prisma.job.findMany({
    where: {
      status: "PUBLISHED",
      title: {
        contains: searchQuery,
        mode: "insensitive",
      },
    },
    select: {
      title: true,
    },
    distinct: ["title"],
    take: limit,
    orderBy: {
      title: "asc",
    },
  });

  return titles.map((job) => job.title);
};

export const getOrganizationDashboardStats = async (organizationId) => {
  const [totalJobs, activeApplications, interviewsScheduled, hires] =
    await Promise.all([
      prisma.job.count({ where: { organizationId } }),
      prisma.jobApplication.count({
        where: {
          job: { organizationId },
          status: { notIn: ["REJECTED", "HIRED"] },
        },
      }),
      prisma.jobApplication.count({
        where: {
          job: { organizationId },
          status: "SHORTLISTED",
        },
      }),
      prisma.jobApplication.count({
        where: {
          job: { organizationId },
          status: "HIRED",
        },
      }),
    ]);

  return { totalJobs, activeApplications, interviewsScheduled, hires };
};

export const getRecentJobsForOrganization = async (
  organizationId,
  limit = 5,
) => {
  return prisma.job.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      _count: {
        select: { jobApplications: true },
      },
    },
  });
};

export const getRecruiterDashboardStats = async (recruiterId) => {
  const [totalJobs, activeApplications, interviewsScheduled, hires] =
    await Promise.all([
      prisma.job.count({ where: { recruiterId } }),
      prisma.jobApplication.count({
        where: {
          job: { recruiterId },
          status: { notIn: ["REJECTED", "HIRED"] },
        },
      }),
      prisma.jobApplication.count({
        where: {
          job: { recruiterId },
          status: "SHORTLISTED",
        },
      }),
      prisma.jobApplication.count({
        where: {
          job: { recruiterId },
          status: "HIRED",
        },
      }),
    ]);

  return { totalJobs, activeApplications, interviewsScheduled, hires };
};

export const getRecentJobsForRecruiter = async (recruiterId, limit = 5) => {
  return prisma.job.findMany({
    where: { recruiterId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      _count: {
        select: { jobApplications: true },
      },
    },
  });
};
