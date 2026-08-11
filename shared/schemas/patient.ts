import { z } from "zod";
import { dateRangeQuerySchema, paginationQuerySchema } from "./common";

export const patientInputSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().int().min(0),
  gender: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  condition: z.string().min(1),
});

export const patientUpdateSchema = patientInputSchema.partial().extend({
  doctor: z.string().min(1).optional(),
});

export const listPatientsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1).optional(),
  condition: z.string().trim().min(1).optional(),
  ...dateRangeQuerySchema.shape,
});

export type PatientInput = z.infer<typeof patientInputSchema>;
export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;
export type ListPatientsQuery = z.infer<typeof listPatientsQuerySchema>;
