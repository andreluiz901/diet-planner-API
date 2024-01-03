import { FastifyInstance } from "fastify";
import { dbKnex } from "../../database";
import { randomUUID } from "crypto";
import { z } from "zod";
import { findOneByEmail, findOneByUsername } from "./users.services";
import { encryptString } from "../../utils/encrypt-utils";
import { authorization } from "../auth/signIn.auth.service";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", async (req, reply) => {
    const createUserBodySchema = z
      .object({
        name: z.string(),
        username: z.string(),
        email: z.string().email(),
        password: z
          .string()
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,20}$/,
            "A senha precisa conter entre 8 a 20 caracteres, contendo 1 maiúsculo, 1 minúsuclo, 1 numeral e 1 especial (!@#$%&*)"
          ),
        confirm_password: z.string(),
        age: z.number(),
        current_weight: z.number().optional(),
        start_weight: z.number().optional(),
        goal_weight: z.number().optional(),
        goal: z.enum(["LOSE", "GAIN"]).default("LOSE"),
      })
      .refine(
        (values) => {
          return values.password === values.confirm_password;
        },
        { message: "Passwords must match!", path: ["confirm_password"] }
      );

    const {
      name,
      age,
      username,
      email,
      password,
      current_weight,
      start_weight,
      goal_weight,
      goal,
    } = createUserBodySchema.parse(req.body);

    if (await findOneByEmail(email)) {
      return reply.status(400).send({ message: "email já em uso!" });
    }

    if (await findOneByUsername(username)) {
      return reply.status(400).send({ message: "username já em uso!" });
    }

    const hashedPassword = await encryptString(password);

    const responseCreatedUser = await dbKnex("users")
      .insert({
        id: randomUUID(),
        name,
        username,
        email,
        password: hashedPassword,
        age,
        current_weight,
        start_weight: current_weight,
        goal_weight,
        goal,
      })
      .returning("*");

    return reply.status(201).send({ data: responseCreatedUser[0] });
  });

  app.get("/", async (req, reply) => {
    const users = dbKnex("users");

    return users;
  });

  app.get("/:id", async (req, reply) => {
    const { id }: any = req.params;

    const user: any = await dbKnex("users").where({ id }).first();

    if (user) {
      const { password: _, ...userData } = user;

      return reply.status(200).send(userData);
    }

    return reply.status(404).send();
  });

  app.get("/summary", { preHandler: authorization }, async (req, reply) => {
    const userId = req.id;

    const userMeals = await dbKnex("meals").select().where({ user_id: userId });

    const meals_on_diet = await dbKnex("meals")
      .select()
      .where({ user_id: userId })
      .andWhere({ is_on_diet: true })
      .count();
    const meals_off_diet = await dbKnex("meals")
      .select()
      .where({ user_id: userId })
      .andWhere({ is_on_diet: false })
      .count();

    const streaks: any = await dbKnex("meals")
      .select("date_hour", "is_on_diet")
      .where({ user_id: userId })
      .groupBy("date_hour")
      .count("* as count");

    let streak = 0;
    let best_streak = 0;
    for (let item of streaks) {
      console.log(item);
      if (streak > best_streak) best_streak = streak;
      if (item.is_on_diet) streak += item.count;
      if (!item.is_on_diet) streak = 0;
    }

    return reply.status(200).send({
      meals_count: userMeals.length,
      meals_on_diet: meals_on_diet[0]["count(*)"],
      meals_off_diet: meals_off_diet[0]["count(*)"],
      best_streak,
    });
  });
}
