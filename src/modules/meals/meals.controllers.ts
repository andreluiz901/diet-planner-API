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

  app.put("/:id", { preHandler: authorization }, async (req, reply) => {
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date_hour: z.string(),
      is_on_diet: z.boolean(),
    });

    const { id }: any = req.params;
    const userId = req.id;

    const { name, description, date_hour, is_on_diet } =
      updateMealBodySchema.parse(req.body);

    const mealUpdated = await dbKnex("meals")
      .update({
        name,
        description,
        date_hour: new Date(date_hour).toISOString(),
        is_on_diet,
      })
      .where({ id })
      .andWhere({ user_id: userId })
      .returning("*");

    return reply.status(201).send(mealUpdated[0]);
  });

  app.delete("/:id", { preHandler: authorization }, async (req, reply) => {
    const { id }: any = req.params;
    const userId = req.id;

    const mealDeleted = await dbKnex("meals")
      .delete()
      .where({ id })
      .andWhere({ user_id: userId })
      .returning("*");

    return reply.status(201).send(mealDeleted[0]);
  });

  app.get("/", { preHandler: authorization }, async (req, reply) => {
    const userId = req.id;

    const userMeals = await dbKnex("meals").select().where({ user_id: userId });

    return reply.status(201).send(userMeals);
  });

  app.get("/:id", { preHandler: authorization }, async (req, reply) => {
    const userId = req.id;
    const { id }: any = req.params;
    const userMeals = await dbKnex("meals")
      .select()
      .where({ user_id: userId })
      .andWhere({ id });

    return reply.status(201).send(userMeals);
  });
}
