import "dotenv/config";
import knex, { type Knex } from "knex";
import { env } from "./env";

const setupKnex = knex;

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/db/migrations",
  },
};

export const dbKnex = setupKnex(config);
