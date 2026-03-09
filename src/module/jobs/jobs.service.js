import { prisma } from "../../config/prisma.js";

export const createJob = async (data) => {
  const {
    recruiterId,
    organizationId,
    title,
    description,
    employmentType,
    salaryMin,
    salaryMax,
    isActive,
    publishedAt,
  } = data;

  return await prisma.job.create({
    data: {
      recruiterId,
      organizationId,
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
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

export const getJobDetailes = async (jobId) => {
  return await prisma.job.findFirst({
    where: {
      id: jobId,
      status: "PUBLISHED",
    },
  });
};

export const updateJob = async (jobId, data) => {
  const {
    title,
    description,
    employmentType,
    salaryMin,
    salaryMax,
    isActive,
    publishedAt,
  } = data;

  return await prisma.job.update({
    data: {
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
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
    isActive,
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
  const normalizedIsActive =
    typeof isActive === "boolean"
      ? isActive
      : typeof isActive === "string"
        ? isActive.toLowerCase() === "true"
        : true;
  const normalizedSalaryMin = Number.isFinite(Number(salaryMin))
    ? Number(salaryMin)
    : undefined;
  const normalizedSalaryMax = Number.isFinite(Number(salaryMax))
    ? Number(salaryMax)
    : undefined;

  const where = {
    status: "PUBLISHED",
    isActive:
      typeof normalizedIsActive === "boolean" ? normalizedIsActive : true,
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
