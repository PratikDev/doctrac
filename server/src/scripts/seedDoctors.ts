import "dotenv/config";
import mongoose from "mongoose";
import { z } from "zod";
import { Doctor } from "@/models/Doctor";

const seedEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

const doctors = [
  { name: "Dr. Alice Chen", specialization: "Cardiology", hospital: "City General Hospital", phone: "+1 555-0101", email: "alice.chen@doctrac.test", days: 150 },
  { name: "Dr. Brian Okafor", specialization: "Neurology", hospital: "St. Mary's Medical Center", phone: "+1 555-0102", email: "brian.okafor@doctrac.test", days: 140 },
  { name: "Dr. Carla Mendes", specialization: "Pediatrics", hospital: "Riverside Children's Hospital", phone: "+1 555-0103", email: "carla.mendes@doctrac.test", days: 130 },
  { name: "Dr. David Kim", specialization: "Orthopedics", hospital: "City General Hospital", phone: "+1 555-0104", email: "david.kim@doctrac.test", days: 120 },
  { name: "Dr. Elena Petrova", specialization: "Dermatology", hospital: "Lakeside Clinic", phone: "+1 555-0105", email: "elena.petrova@doctrac.test", days: 100 },
  { name: "Dr. Farhan Ahmed", specialization: "Cardiology", hospital: "St. Mary's Medical Center", phone: "+1 555-0106", email: "farhan.ahmed@doctrac.test", days: 90 },
  { name: "Dr. Grace Lin", specialization: "Oncology", hospital: "Riverside Children's Hospital", phone: "+1 555-0107", email: "grace.lin@doctrac.test", days: 75 },
  { name: "Dr. Henry Novak", specialization: "Neurology", hospital: "City General Hospital", phone: "+1 555-0108", email: "henry.novak@doctrac.test", days: 60 },
  { name: "Dr. Isabel Rossi", specialization: "Endocrinology", hospital: "Lakeside Clinic", phone: "+1 555-0109", email: "isabel.rossi@doctrac.test", days: 45 },
  { name: "Dr. Jacob Turner", specialization: "Orthopedics", hospital: "St. Mary's Medical Center", phone: "+1 555-0110", email: "jacob.turner@doctrac.test", days: 30 },
  { name: "Dr. Keiko Tanaka", specialization: "Pediatrics", hospital: "City General Hospital", phone: "+1 555-0111", email: "keiko.tanaka@doctrac.test", days: 15 },
  { name: "Dr. Liam O'Brien", specialization: "Dermatology", hospital: "Riverside Children's Hospital", phone: "+1 555-0112", email: "liam.obrien@doctrac.test", days: 5 },
].map(({ days, ...doctor }) => {
  const createdAt = daysAgo(days);
  return { ...doctor, createdAt, updatedAt: createdAt };
});

async function seedDoctors() {
  const { MONGODB_URI } = seedEnvSchema.parse(process.env);
  await mongoose.connect(MONGODB_URI);

  const existing = await Doctor.countDocuments();
  if (existing > 0) {
    console.log(`Clearing ${existing} existing doctor(s)...`);
    await Doctor.deleteMany({});
  }

  // Bypass Mongoose's auto-timestamps so the staggered `createdAt` values
  // above (needed to exercise date-range filtering/pagination) stick.
  await Doctor.collection.insertMany(doctors);

  console.log(`Seeded ${doctors.length} doctors.`);
  await mongoose.disconnect();
}

seedDoctors().catch((err) => {
  console.error("Seeding doctors failed:", err);
  process.exit(1);
});
