import type { PatientInput, PatientUpdateInput } from "@doctrac/shared/schemas/patient";
import type { PatientDTO, PatientListResponse } from "@doctrac/shared/types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { buildQueryString } from "@/lib/build-query-string";
import { queryClient } from "@/lib/query-client";

function invalidatePatients() {
  // Broad invalidation on purpose: a patient mutation can affect the dedicated
  // patients list, any doctor's nested patients list (incl. a reassignment's
  // old/new doctor), and dashboard stats. Cheaper to over-invalidate than to
  // track exactly which doctor-scoped lists are stale.
  queryClient.invalidateQueries({ queryKey: ["patients"] });
  queryClient.invalidateQueries({ queryKey: ["doctorPatients"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
}

export function useDoctorPatientsQuery(doctorId: string, page: number) {
  return useQuery({
    queryKey: ["doctorPatients", doctorId, { page }],
    queryFn: () =>
      apiClient.get<PatientListResponse>(`/api/doctors/${doctorId}/patients${buildQueryString({ page, limit: 10 })}`),
    placeholderData: keepPreviousData,
  });
}

export interface PatientsListParams {
  page: number;
  search?: string;
  condition?: string;
  startDate?: string;
  endDate?: string;
}

export function usePatientsQuery(params: PatientsListParams) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => apiClient.get<PatientListResponse>(`/api/patients${buildQueryString({ limit: 10, ...params })}`),
    placeholderData: keepPreviousData,
  });
}

export function useAddPatientMutation() {
  return useMutation({
    mutationFn: ({ doctorId, input }: { doctorId: string; input: PatientInput }) =>
      apiClient.post<PatientDTO>(`/api/doctors/${doctorId}/patients`, input),
    onSuccess: () => {
      invalidatePatients();
      toast.success("Patient added");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to add patient");
    },
  });
}

export function useUpdatePatientMutation() {
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PatientUpdateInput }) =>
      apiClient.patch<PatientDTO>(`/api/patients/${id}`, input),
    onSuccess: () => {
      invalidatePatients();
      toast.success("Patient updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update patient");
    },
  });
}

export function useDeletePatientFromDoctorMutation() {
  return useMutation({
    mutationFn: ({ doctorId, patientId }: { doctorId: string; patientId: string }) =>
      apiClient.delete<void>(`/api/doctors/${doctorId}/patients/${patientId}`),
    onSuccess: () => {
      invalidatePatients();
      toast.success("Patient deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete patient");
    },
  });
}

export function useDeletePatientMutation() {
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/api/patients/${id}`),
    onSuccess: () => {
      invalidatePatients();
      toast.success("Patient deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete patient");
    },
  });
}
