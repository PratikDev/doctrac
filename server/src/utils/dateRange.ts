export function buildDateRangeFilter(startDate?: Date, endDate?: Date) {
  if (!startDate && !endDate) return {};

  const createdAt: Record<string, Date> = {};
  if (startDate) createdAt.$gte = startDate;
  if (endDate) createdAt.$lte = endDate;

  return { createdAt };
}
