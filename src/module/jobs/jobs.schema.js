import z from "zod";

export const EmploymentTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACTUAL",
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
    }
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
    }
  );
