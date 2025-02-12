// lib/db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./lib/db/schema";

const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql, { schema });

// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL || "",
  },
  verbose: true,
  strict: true,
});
