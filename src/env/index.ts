import { config } from "dotenv";
import z from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test", override: true });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3010),
  JWT_SECRET_KEY: z.string(),
});

export const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.log("Invalid Enviroment Variable Error!", _env.error.format());

  throw new Error("Invalid Enviroment Variable");
}

export const env = envSchema.parse(process.env);
