import process from "node:process";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./lib/db/schema.ts",
	dbCredentials: {
		url: process.env.TEST_DATABASE_URL!,
	},
});
