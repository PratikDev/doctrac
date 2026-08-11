import { Schema, model } from "mongoose";

export interface IDoctor {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    hospital: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

// Full-text search across name/specialization/hospital.
doctorSchema.index({ name: "text", specialization: "text", hospital: "text" });
// Exact-match "other relevant filter".
doctorSchema.index({ specialization: 1 });
// Date-wise filter + default recency sort/pagination.
doctorSchema.index({ createdAt: -1 });

export const Doctor = model<IDoctor>("Doctor", doctorSchema);
