import z from "zod";

export const createCandidateProfileSchema = z.object({
  body: z.object({
    userId: z.string(),
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    headline: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
    publicPhone: z.string().nullable().optional(),
    publicEmail: z.string().email().nullable().optional(),
    linkedinUrl: z.string().url().nullable().optional(),
    websiteUrl: z.string().url().nullable().optional(),
    isActive: z.boolean().default(true),
    isVerified: z.boolean().default(true), // Defaulting to true as per schema model default
    isOpenToWork: z.boolean().default(true),
  }),
});

export const updateCandidateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First Name is required").optional(),
    lastName: z.string().min(1, "Last Name is required").optional(),
    headline: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
    publicPhone: z.string().nullable().optional(),
    publicEmail: z.string().email().nullable().optional(),
    linkedinUrl: z.string().url().nullable().optional(),
    websiteUrl: z.string().url().nullable().optional(),
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    isOpenToWork: z.boolean().optional(),
  }),
});
