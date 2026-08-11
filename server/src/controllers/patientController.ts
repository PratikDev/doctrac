import { idParamSchema, paginationQuerySchema } from "@doctrac/shared/schemas/common";
import { patientInputSchema, patientUpdateSchema, listPatientsQuerySchema } from "@doctrac/shared/schemas/patient";
import type { Request, Response } from "express";
import { ApiError } from "@/middleware/errorHandler";
import { Doctor } from "@/models/Doctor";
import { Patient } from "@/models/Patient";
import { buildDateRangeFilter } from "@/utils/dateRange";
import { buildPaginationMeta } from "@/utils/pagination";

async function requireDoctor(doctorId: string) {
  const exists = await Doctor.exists({ _id: doctorId });
  if (!exists) {
    throw new ApiError(404, "Doctor not found");
  }
}

// -- Nested under a doctor --------------------------------------------------

export async function addPatientToDoctor(req: Request, res: Response) {
  const doctorId = idParamSchema.parse(req.params.id);
  await requireDoctor(doctorId);

  const input = patientInputSchema.parse(req.body);
  const patient = await Patient.create({ ...input, doctor: doctorId });
  res.status(201).json(patient);
}

export async function listPatientsForDoctor(req: Request, res: Response) {
  const doctorId = idParamSchema.parse(req.params.id);
  await requireDoctor(doctorId);

  const { page, limit } = paginationQuerySchema.parse(req.query);
  const filter = { doctor: doctorId };

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Patient.countDocuments(filter),
  ]);

  res.json({ patients, pagination: buildPaginationMeta(total, page, limit) });
}

export async function deletePatientFromDoctor(req: Request, res: Response) {
  const doctorId = idParamSchema.parse(req.params.id);
  const patientId = idParamSchema.parse(req.params.patientId);

  const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
  if (!patient) {
    throw new ApiError(404, "Patient not found for this doctor");
  }

  await patient.deleteOne();
  res.status(204).send();
}

// -- Dedicated patient endpoints ---------------------------------------------

export async function listPatients(req: Request, res: Response) {
  const { page, limit, search, condition, startDate, endDate } = listPatientsQuerySchema.parse(req.query);

  const filter: Record<string, unknown> = {
    ...buildDateRangeFilter(startDate, endDate),
    ...(condition ? { condition } : {}),
    ...(search ? { $text: { $search: search } } : {}),
  };

  const projection = search ? { score: { $meta: "textScore" } } : undefined;
  const sort: Record<string, 1 | -1 | { $meta: string }> = search
    ? { score: { $meta: "textScore" } }
    : { createdAt: -1 };

  const [patients, total] = await Promise.all([
    Patient.find(filter, projection)
      .populate("doctor", "name specialization")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Patient.countDocuments(filter),
  ]);

  res.json({ patients, pagination: buildPaginationMeta(total, page, limit) });
}

export async function updatePatient(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  const input = patientUpdateSchema.parse(req.body);
  if (input.doctor) {
    await requireDoctor(input.doctor);
  }

  const patient = await Patient.findByIdAndUpdate(id, input, { new: true });
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  res.json(patient);
}

export async function deletePatient(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  res.status(204).send();
}
