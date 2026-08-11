import { z } from "zod";
import { dateRangeQuerySchema, paginationQuerySchema } from "./common";

export const doctorInputSchema = z.object({
  name: z.string().min(1),
  specialization: z.string().min(1),
  hospital: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
});

export const doctorUpdateSchema = doctorInputSchema.partial();

export const listDoctorsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1).optional(),
  specialization: z.string().trim().min(1).optional(),
  ...dateRangeQuerySchema.shape,
});

export type DoctorInput = z.infer<typeof doctorInputSchema>;
export type DoctorUpdateInput = z.infer<typeof doctorUpdateSchema>;
export type ListDoctorsQuery = z.infer<typeof listDoctorsQuerySchema>;
