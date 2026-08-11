import { Router } from "express";
import { deletePatient, listPatients, updatePatient } from "@/controllers/patientController";
import { requireAuth } from "@/middleware/requireAuth";

export const patientRoutes = Router();

patientRoutes.use(requireAuth);

patientRoutes.get("/", listPatients);
patientRoutes.patch("/:id", updatePatient);
patientRoutes.delete("/:id", deletePatient);
