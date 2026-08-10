import { app } from "@/app";
import { connectDB } from "@/config/db";
import { env } from "@/config/env";

await connectDB();

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
