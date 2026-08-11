import type { Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "@/middleware/errorHandler";
import { Doctor } from "@/models/Doctor";
import { buildDateRangeFilter, dateRangeQuerySchema } from "@/utils/dateRange";
import { buildPaginationMeta, paginationQuerySchema } from "@/utils/pagination";

const doctorInputSchema = z.object({
  name: z.string().min(1),
  specialization: z.string().min(1),
  hospital: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
});

const listDoctorsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1).optional(),
  specialization: z.string().trim().min(1).optional(),
  ...dateRangeQuerySchema.shape,
});

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
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res.json(doctor);
}

export async function updateDoctor(req: Request, res: Response) {
  const input = doctorInputSchema.partial().parse(req.body);
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, input, { new: true });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res.json(doctor);
}

export async function deleteDoctor(req: Request, res: Response) {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res.status(204).send();
}
