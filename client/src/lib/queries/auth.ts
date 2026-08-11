import type { UserDTO } from "@doctrac/shared/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";

export function useMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => apiClient.get<UserDTO>("/api/auth/me"),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => apiClient.post<void>("/api/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
