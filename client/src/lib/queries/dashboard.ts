import type { DashboardStatsDTO } from "@doctrac/shared/types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => apiClient.get<DashboardStatsDTO>("/api/dashboard/stats"),
  });
}
