import { FastifyInstance } from "fastify";
import { authorization } from "../auth/signIn.auth.service";
import { dbKnex } from "../../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";

export async function mealsRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: authorization }, async (req, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date_hour: z.string(),
      is_on_diet: z.boolean(),
    });

    const userId = req.id;

    const { name, description, date_hour, is_on_diet } =
      createMealBodySchema.parse(req.body);
    const mealDate = new Date(date_hour).toISOString();
    const newMeal = await dbKnex("meals")
      .insert({
        id: randomUUID(),
        name,
        description,
        date_hour: mealDate,
        is_on_diet,
        user_id: userId,
      })
      .returning("*");

    return reply.status(201).send({ data: newMeal });
  });
}
