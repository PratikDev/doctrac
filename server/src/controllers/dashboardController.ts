import type { Request, Response } from "express";
import { Doctor } from "@/models/Doctor";
import { Patient } from "@/models/Patient";

const MONTHS_OF_HISTORY = 6;

function lastNMonthLabels(n: number): string[] {
  const labels: string[] = [];
  const cursor = new Date();
  cursor.setDate(1);

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth() - i, 1);
    labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  return labels;
}

export async function getDashboardStats(_req: Request, res: Response) {
  const monthLabels = lastNMonthLabels(MONTHS_OF_HISTORY);
  const rangeStart = new Date(`${monthLabels[0]}-01T00:00:00.000Z`);

  const [totalDoctors, totalPatients, patientsPerDoctor, patientsByMonthRaw] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Doctor.aggregate([
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "doctor",
          as: "patients",
        },
      },
      { $project: { _id: 0, doctorId: "$_id", doctorName: "$name", count: { $size: "$patients" } } },
      { $sort: { count: -1 } },
    ]),
    Patient.aggregate([
      { $match: { createdAt: { $gte: rangeStart } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const countsByMonth = new Map(patientsByMonthRaw.map((row) => [row._id as string, row.count as number]));
  const patientsByMonth = monthLabels.map((month) => ({ month, count: countsByMonth.get(month) ?? 0 }));

  res.json({ totalDoctors, totalPatients, patientsPerDoctor, patientsByMonth });
}
