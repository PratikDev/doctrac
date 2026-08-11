import { GENDER_OPTIONS } from "@doctrac/shared/schemas/patient";
import "dotenv/config";
import mongoose from "mongoose";
import { z } from "zod";
import { Doctor } from "@/models/Doctor";
import { Patient } from "@/models/Patient";

const seedEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: readonly T[]): T {
  const item = items[randomInt(0, items.length - 1)];
  if (item === undefined) throw new Error("randomItem called with an empty array");
  return item;
}

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const DOCTOR_SEED = [
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
];

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen",
];
const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin",
];
const CONDITIONS = [
  "Hypertension", "Type 2 Diabetes", "Asthma", "Migraine", "Arthritis",
  "Anxiety Disorder", "Seasonal Allergies", "Eczema", "Hypothyroidism",
  "Acid Reflux", "Insomnia", "Chronic Back Pain",
];

async function seedData() {
  const { MONGODB_URI } = seedEnvSchema.parse(process.env);
  await mongoose.connect(MONGODB_URI);

  const existingDoctors = await Doctor.countDocuments();
  if (existingDoctors > 0) {
    console.log(`Clearing ${existingDoctors} existing doctor(s) and their patients...`);
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
  }

  const doctors = DOCTOR_SEED.map(({ days, ...doctor }) => {
    const createdAt = daysAgo(days);
    return {
      _id: new mongoose.Types.ObjectId(),
      ...doctor,
      // Bypassing the raw driver skips doctorInputSchema's lowercase transform,
      // so specialization has to be normalized here to match what the API filter expects.
      specialization: doctor.specialization.toLowerCase(),
      createdAt,
      updatedAt: createdAt,
    };
  });

  // Bypass Mongoose's auto-timestamps so the staggered `createdAt` values
  // above (needed to exercise date-range filtering/pagination) stick.
  await Doctor.collection.insertMany(doctors);

  let patientCounter = 0;
  const patients = doctors.flatMap((doctor) => {
    const patientCount = randomInt(0, 6);
    return Array.from({ length: patientCount }, () => {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      patientCounter += 1;
      const createdAt = randomDateBetween(doctor.createdAt, new Date());

      return {
        name: `${firstName} ${lastName}`,
        age: randomInt(1, 90),
        gender: randomItem(GENDER_OPTIONS),
        phone: `+1 555-1${String(patientCounter).padStart(3, "0")}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${patientCounter}@doctrac.test`,
        condition: randomItem(CONDITIONS),
        doctor: doctor._id,
        createdAt,
        updatedAt: createdAt,
      };
    });
  });

  if (patients.length > 0) {
    await Patient.collection.insertMany(patients);
  }

  console.log(`Seeded ${doctors.length} doctors and ${patients.length} patients.`);
  await mongoose.disconnect();
}

seedData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
