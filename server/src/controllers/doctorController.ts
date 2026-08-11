import { idParamSchema } from "@doctrac/shared/schemas/common";
import { doctorInputSchema, doctorUpdateSchema, listDoctorsQuerySchema } from "@doctrac/shared/schemas/doctor";
import type { Request, Response } from "express";
import { ApiError } from "@/middleware/errorHandler";
import { Doctor } from "@/models/Doctor";
import { buildDateRangeFilter } from "@/utils/dateRange";
import { buildPaginationMeta } from "@/utils/pagination";

export async function createDoctor(req: Request, res: Response) {
  const input = doctorInputSchema.parse(req.body);
  const doctor = await Doctor.create(input);
  res.status(201).json(doctor);
}

export async function listDoctors(req: Request, res: Response) {
  const { page, limit, search, specialization, startDate, endDate } = listDoctorsQuerySchema.parse(req.query);

  const filter: Record<string, unknown> = {
    ...buildDateRangeFilter(startDate, endDate),
    ...(specialization ? { specialization } : {}),
    ...(search ? { $text: { $search: search } } : {}),
  };

  const projection = search ? { score: { $meta: "textScore" } } : undefined;
  const sort: Record<string, 1 | -1 | { $meta: string }> = search
    ? { score: { $meta: "textScore" } }
    : { createdAt: -1 };

  const [doctors, total] = await Promise.all([
    Doctor.find(filter, projection)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Doctor.countDocuments(filter),
  ]);

  res.json({ doctors, pagination: buildPaginationMeta(total, page, limit) });
}

export async function getDoctor(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res.json(doctor);
}

export async function updateDoctor(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  const input = doctorUpdateSchema.parse(req.body);
  const doctor = await Doctor.findByIdAndUpdate(id, input, { new: true });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res.json(doctor);
}

export async function deleteDoctor(req: Request, res: Response) {
  const id = idParamSchema.parse(req.params.id);
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res.status(204).send();
}
