import { z } from "zod";

export const dateRangeQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export function buildDateRangeFilter(startDate?: Date, endDate?: Date) {
  if (!startDate && !endDate) return {};

  const createdAt: Record<string, Date> = {};
  if (startDate) createdAt.$gte = startDate;
  if (endDate) createdAt.$lte = endDate;

  return { createdAt };
}
