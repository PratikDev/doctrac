import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import "dotenv/config";
import mongoose from "mongoose";
import { z } from "zod";

const seedEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  ADMIN_NAME: z.string().min(1, "ADMIN_NAME is required"),
  ADMIN_EMAIL: z.email("ADMIN_EMAIL must be a valid email"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters"),
});

async function seedAdmin() {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = seedEnvSchema.parse(process.env);

  await mongoose.connect(MONGODB_URI);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const email = ADMIN_EMAIL.toLowerCase();

  const user = await User.findOneAndUpdate(
    { email },
    { name: ADMIN_NAME, email, passwordHash },
    { upsert: true, new: true }
  );

  console.log(`Admin user ready: ${user.email}`);
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
