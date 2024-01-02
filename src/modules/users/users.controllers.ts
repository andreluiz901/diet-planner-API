import { FastifyInstance } from "fastify";
import { dbKnex } from "../../database";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", async (req, reply) => {
    const users = dbKnex("sqlite_schema");

    return users;
  });
}
