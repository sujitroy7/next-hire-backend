import z from "zod";

export const ApplicationStatusEnum = z.enum([
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
]);

export const createJobApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
  }),
});

export const updateJobApplicationStatusSchema = z.object({
  body: z.object({
    status: ApplicationStatusEnum,
  }),
  params: z.object({
    applicationId: z.string().uuid(),
  }),
});

export const getCandidateApplicationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(["appliedAt", "status"]).default("appliedAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    status: ApplicationStatusEnum.optional(),
    jobId: z.string().uuid().optional(),
  }),
});

export const getJobApplicationsSchema = z.object({
  params: z.object({
    jobId: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(["appliedAt", "status"]).default("appliedAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    status: ApplicationStatusEnum.optional(),
  }),
});
