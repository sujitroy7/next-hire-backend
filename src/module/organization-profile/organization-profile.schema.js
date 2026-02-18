import z from "zod";
import {
  employeeCounts,
  organizationTypes,
} from "../../constants/organization.js";

const addressSchema = z
  .object({
    streetLine1: z.string().min(5, {
      message: "Address must be at least 5 characters.",
    }),
    streetLine2: z.string().optional(),
    city: z.string().min(2, {
      message: "City must be at least 2 characters.",
    }),
    state: z.string().min(2, {
      message: "State must be at least 2 characters.",
    }),
    postalCode: z.string().min(5, {
      message: "Postal code must be at least 5 characters.",
    }),
    country: z.string().min(2, {
      message: "Country must be at least 2 characters.",
    }),
  })
  .optional();

export const createOrganizationProfileSchema = z.object({
  body: z.object({
    userId: z.string(),
    name: z.string().min(1, "Name is required"),
    about: z.string().nullable().optional(),
    isActive: z.boolean().default(true),
    isVerified: z.boolean().default(false),
    organizationType: z.enum(organizationTypes, "Invalid organization type"),
    employeeCount: z.enum(employeeCounts, "Invalid employee count"),
    publicEmail: z.email().nullable().optional(),
    publicPhone: z.string().nullable().optional(),
    websiteUrl: z.url().nullable().optional(),
    linkedinUrl: z.url().nullable().optional(),
    logoUrl: z.url().nullable().optional(),
    galleryImages: z.array(z.url()).optional(),
    address: addressSchema,
  }),
});

export const updateOrganizationProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    about: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    organizationType: z
      .enum(organizationTypes, "Invalid organization type")
      .nullable()
      .optional(),
    employeeCount: z
      .enum(employeeCounts, "Invalid employee count")
      .nullable()
      .optional(),
    publicEmail: z.email().nullable().optional(),
    publicPhone: z.string().nullable().optional(),
    websiteUrl: z.url().nullable().optional(),
    linkedinUrl: z.url().nullable().optional(),
    logoUrl: z.url().nullable().optional(),
    galleryImages: z.array(z.url()).optional(),
    address: addressSchema,
  }),
});
