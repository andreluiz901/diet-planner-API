import { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", async (req, reply) => {
    return "hello world";
  });
}

export async function mealsRoutes(app: FastifyInstance) {}
