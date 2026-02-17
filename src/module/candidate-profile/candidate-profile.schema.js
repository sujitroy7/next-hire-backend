import z from "zod";

const prepareUrl = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.string().url().optional(),
);

const stripHtml = (value) => value?.replace(/<[^>]*>?/gm, "") ?? "";

export const createCandidateProfileSchema = z.object({
  body: z.object({
    userId: z.string(),
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    headline: z.string().nullable().optional(),
    bio: z
      .string()
      .nullable()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          const plainTextLength = stripHtml(value).length;
          return plainTextLength <= 500;
        },
        { message: "Bio must be at most 500 characters" },
      ),
    publicPhone: z.string().nullable().optional(),
    publicEmail: z.string().email().nullable().optional(),
    linkedinUrl: prepareUrl,
    websiteUrl: prepareUrl,
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
    linkedinUrl: prepareUrl,
    websiteUrl: prepareUrl,
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    isOpenToWork: z.boolean().optional(),
    experiences: z
      .array(
        z.object({
          id: z.string().optional(),
          companyName: z.string().min(1, "Company Name is required"),
          jobTitle: z.string().min(1, "Role is required"),
          startDate: z.string().datetime(),
          endDate: z.string().datetime().nullable().optional(),
          description: z.string().nullable().optional(),
          location: z.string().nullable().optional(),
        }),
      )
      .optional(),
  }),
});
