import { z } from "zod";

export const idParamSchema = z.string().min(1, "ID is required");

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int("Page must be a whole number").min(1, "Page must be at least 1").default(1),
  limit: z.coerce
    .number()
    .int("Limit must be a whole number")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit can't exceed 100")
    .default(10),
});

export const dateRangeQuerySchema = z.object({
  startDate: z.coerce.date("Enter a valid start date").optional(),
  endDate: z.coerce.date("Enter a valid end date").optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
