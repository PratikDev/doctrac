import { z } from "zod";
import { dateRangeQuerySchema, paginationQuerySchema } from "./common";

// Generic, country-agnostic: optional leading +, digits, and common separators.
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

export const doctorInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required").transform(val => val.toLowerCase()),
  hospital: z.string().min(1, "Hospital is required"),
  phone: z.string().regex(PHONE_REGEX, "Enter a valid phone number"),
  email: z.email("Enter a valid email address"),
});

export const doctorUpdateSchema = doctorInputSchema.partial();

export const listDoctorsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1, "Search can't be empty").optional(),
  specialization: z.string().trim().min(1, "Specialization can't be empty").optional().transform(val => val?.toLowerCase()),
  ...dateRangeQuerySchema.shape,
});

export type DoctorInput = z.infer<typeof doctorInputSchema>;
export type DoctorUpdateInput = z.infer<typeof doctorUpdateSchema>;
export type ListDoctorsQuery = z.infer<typeof listDoctorsQuerySchema>;
