import mongoose from "mongoose";
import { env } from "@/config/env";

export async function connectDB() {
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");
}
