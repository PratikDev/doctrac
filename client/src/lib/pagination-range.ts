export type PaginationRangeItem = number | "ellipsis";

/** Windowed page list: first, last, current +/-1, with ellipses for gaps. */
export function getPaginationRange(current: number, total: number): PaginationRangeItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...items].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  const result: PaginationRangeItem[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const value = sorted[i];
    if (value === undefined) continue;
    if (i > 0) {
      const previous = sorted[i - 1];
      if (previous !== undefined && value - previous > 1) {
        result.push("ellipsis");
      }
    }
    result.push(value);
  }

  return result;
}
