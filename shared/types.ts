import type { GENDER_OPTIONS } from "./schemas/patient";

export type Gender = (typeof GENDER_OPTIONS)[number];

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface DoctorDTO {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientDoctorRefDTO {
  _id: string;
  name: string;
  specialization: string;
}

export interface PatientDTO {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  condition: string;
  // Nested/plain endpoints return the raw id; the dedicated list endpoint
  // populates this with { _id, name, specialization }.
  doctor: string | PatientDoctorRefDTO;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStatsDTO {
  totalDoctors: number;
  totalPatients: number;
  patientsPerDoctor: { doctorId: string; doctorName: string; count: number }[];
  patientsByMonth: { month: string; count: number }[];
}

export interface DoctorListResponse {
  doctors: DoctorDTO[];
  pagination: PaginationMeta;
}

export interface PatientListResponse {
  patients: PatientDTO[];
  pagination: PaginationMeta;
}
