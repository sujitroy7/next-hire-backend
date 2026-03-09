import z from "zod";

export const EmploymentTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACTUAL",
]);

export const WorkplaceTypeEnum = z.enum(["REMOTE", "HYBRID", "ON_SITE"]);

export const ExperienceLevelEnum = z.enum([
  "UNDER_1_YEAR",
  "YEARS_1_TO_2",
  "YEARS_2_TO_3",
  "YEARS_3_TO_5",
  "YEARS_5_TO_10",
  "YEARS_10_PLUS",
]);

export const createJobSchema = z
  .object({
    body: z.object({
      title: z
        .string()
        .min(3, "Job title must be at least 3 characters")
        .max(255, "Job title is too long"),
      description: z
        .string()
        .min(10, "Job description must be at least 10 characters"),
      employmentType: EmploymentTypeEnum,
      salaryMin: z.number().int().positive().optional(),
      salaryMax: z.number().int().positive().optional(),
      isActive: z.boolean().optional().default(true),
      publishedAt: z.coerce.date().optional(),
    }),
  })
  .refine(
    (data) => {
      return (
        data.body.salaryMin === undefined ||
        data.body.salaryMax === undefined ||
        data.body.salaryMin <= data.body.salaryMax
      );
    },
    {
      message: "salaryMin cannot be greater than salaryMax",
      path: ["salaryMin"],
    },
  );

export const updateJobSchema = z
  .object({
    body: z.object({
      title: z
        .string()
        .min(3, "Job title must be at least 3 characters")
        .max(255, "Job title is too long")
        .optional(),
      description: z
        .string()
        .min(10, "Job description must be at least 10 characters")
        .optional(),
      employmentType: EmploymentTypeEnum.optional(),
      salaryMin: z.number().int().positive().optional(),
      salaryMax: z.number().int().positive().optional(),
      isActive: z.boolean().optional(),
      publishedAt: z.coerce.date().nullable().optional(),
    }),
    params: z.object({
      jobId: z.string().uuid(),
    }),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "salaryMin cannot be greater than salaryMax",
      path: ["salaryMin"],
    },
  );

export const updateJobStatusSchema = z.object({
  body: z.object({
    status: z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]),
  }),
  params: z.object({
    jobId: z.string().uuid(),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().min(1).max(200).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]).optional(),
  }),
});

export const getCandidateJobsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      sortBy: z
        .enum(["publishedAt", "createdAt", "salaryMin", "salaryMax", "title"])
        .default("publishedAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      employmentType: z
        .preprocess(
          (val) => (typeof val === "string" ? val.split(",") : val),
          z.array(EmploymentTypeEnum).optional(),
        )
        .optional(),
      workplaceType: z
        .preprocess(
          (val) => (typeof val === "string" ? val.split(",") : val),
          z.array(WorkplaceTypeEnum).optional(),
        )
        .optional(),
      experienceLevel: z
        .preprocess(
          (val) => (typeof val === "string" ? val.split(",") : val),
          z.array(ExperienceLevelEnum).optional(),
        )
        .optional(),
      isActive: z
        .preprocess(
          (value) => {
            if (typeof value === "boolean") {
              return value ? "true" : "false";
            }
            if (typeof value === "string") {
              return value.toLowerCase();
            }
            return value;
          },
          z.enum(["true", "false"]).default("true"),
        )
        .transform((value) => value === "true"),
      organizationId: z.string().uuid().optional(),
      recruiterId: z.string().uuid().optional(),
      search: z.string().min(1).max(200).optional(),
      salaryMin: z.coerce.number().int().positive().optional(),
      salaryMax: z.coerce.number().int().positive().optional(),
      publishedFrom: z.coerce.date().optional(),
      publishedTo: z.coerce.date().optional(),
      createdFrom: z.coerce.date().optional(),
      createdTo: z.coerce.date().optional(),
    })
    .refine(
      (data) =>
        data.salaryMin === undefined ||
        data.salaryMax === undefined ||
        data.salaryMin <= data.salaryMax,
      {
        message: "salaryMin cannot be greater than salaryMax",
        path: ["salaryMin"],
      },
    )
    .refine(
      (data) =>
        data.publishedFrom === undefined ||
        data.publishedTo === undefined ||
        data.publishedFrom <= data.publishedTo,
      {
        message: "publishedFrom cannot be after publishedTo",
        path: ["publishedFrom"],
      },
    )
    .refine(
      (data) =>
        data.createdFrom === undefined ||
        data.createdTo === undefined ||
        data.createdFrom <= data.createdTo,
      {
        message: "createdFrom cannot be after createdTo",
        path: ["createdFrom"],
      },
    ),
});

export const jobTitleAutocompleteSchema = z.object({
  query: z.object({
    query: z
      .string()
      .min(1, "Query string is required")
      .max(100, "Query string is too long"),
    limit: z.coerce.number().int().positive().max(50).default(10),
  }),
});
