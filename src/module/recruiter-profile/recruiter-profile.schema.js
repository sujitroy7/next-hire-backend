import z from "zod";

export const updateRecruiterProfileSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(1, "First Name is required")
      .nullable()
      .optional(),
    lastName: z.string().min(1, "Last Name is required").optional(),
    about: z.string().nullable().optional(),
    publicEmail: z.string().email().nullable().optional(),
    publicPhone: z.string().nullable().optional(),
    linkedinUrl: z.string().url().nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});
