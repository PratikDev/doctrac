import { z } from "zod";
import { dateRangeQuerySchema, paginationQuerySchema } from "./common";

export const patientInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number("Age is required").int("Age must be a whole number").min(0, "Age can't be negative"),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.email("Enter a valid email address"),
  condition: z.string().min(1, "Condition is required"),
});

export const patientUpdateSchema = patientInputSchema.partial().extend({
  doctor: z.string().min(1, "Select a doctor").optional(),
});

export const listPatientsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1, "Search can't be empty").optional(),
  condition: z.string().trim().min(1, "Condition can't be empty").optional(),
  ...dateRangeQuerySchema.shape,
});

export type PatientInput = z.infer<typeof patientInputSchema>;
export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;
export type ListPatientsQuery = z.infer<typeof listPatientsQuerySchema>;
