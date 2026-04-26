import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { defineConfig, env } from "prisma/config";

const myenv = dotenv.config({ path: '.env.database' })
dotenvExpand.expand(myenv)

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
