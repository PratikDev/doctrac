import type { DoctorInput, DoctorUpdateInput } from "@doctrac/shared/schemas/doctor";
import type { DoctorDTO, DoctorListResponse } from "@doctrac/shared/types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { buildQueryString } from "@/lib/build-query-string";
import { queryClient } from "@/lib/query-client";

export interface DoctorsListParams {
  page: number;
  search?: string;
  specialization?: string;
  startDate?: string;
  endDate?: string;
}

export function useDoctorsQuery(params: DoctorsListParams) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => apiClient.get<DoctorListResponse>(`/api/doctors${buildQueryString({ limit: 10, ...params })}`),
    placeholderData: keepPreviousData,
  });
}

function invalidateDoctors() {
  queryClient.invalidateQueries({ queryKey: ["doctors"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
}

export function useCreateDoctorMutation() {
  return useMutation({
    mutationFn: (input: DoctorInput) => apiClient.post<DoctorDTO>("/api/doctors", input),
    onSuccess: () => {
      invalidateDoctors();
      toast.success("Doctor added");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to add doctor");
    },
  });
}

export function useUpdateDoctorMutation() {
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DoctorUpdateInput }) =>
      apiClient.patch<DoctorDTO>(`/api/doctors/${id}`, input),
    onSuccess: () => {
      invalidateDoctors();
      toast.success("Doctor updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update doctor");
    },
  });
}

export function useDeleteDoctorMutation() {
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/api/doctors/${id}`),
    onSuccess: () => {
      invalidateDoctors();
      toast.success("Doctor deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete doctor");
    },
  });
}
