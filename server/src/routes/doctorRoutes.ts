import { Router } from "express";
import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  listDoctors,
  updateDoctor,
} from "@/controllers/doctorController";
import { requireAuth } from "@/middleware/requireAuth";

export const doctorRoutes = Router();

doctorRoutes.use(requireAuth);

doctorRoutes.post("/", createDoctor);
doctorRoutes.get("/", listDoctors);
doctorRoutes.get("/:id", getDoctor);
doctorRoutes.patch("/:id", updateDoctor);
doctorRoutes.delete("/:id", deleteDoctor);
