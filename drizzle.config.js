import { defineConfig } from 'drizzle-kit';
import dotenv from "dotenv";
import findConfig from "find-config";

dotenv.config({path:findConfig('.env')});

export default defineConfig({
  schema: './src/schemas/schema.js',
  out: './drizzle',
  dialect: 'postgresql', 
  dbCredentials: {
    url:process.env.DB_STR
  },
});