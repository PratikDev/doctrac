import { Schema, Types, model } from "mongoose";

export interface IPatient {
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  condition: string;
  doctor: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    condition: { type: String, required: true, trim: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  },
  { timestamps: true }
);

// Full-text search across name/condition.
patientSchema.index({ name: "text", condition: "text" });
// Exact-match condition filter.
patientSchema.index({ condition: 1 });
// Listing a doctor's patients, sorted/paginated by recency.
patientSchema.index({ doctor: 1, createdAt: -1 });
// Date-wise filter + default recency sort on the dedicated patients page.
patientSchema.index({ createdAt: -1 });

export const Patient = model<IPatient>("Patient", patientSchema);
