import { FastifyInstance } from "fastify";
import { dbKnex } from "../../database";
import { randomUUID } from "crypto";
import { z } from "zod";
import { findOneByEmail, findOneByUsername } from "./users.services";

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

    const users = dbKnex("users")
      .insert({
        id: randomUUID(),
        name,
        username,
        email,
        password,
        age,
        current_weight,
        start_weight: current_weight,
        goal_weight,
        goal,
      })
      .returning("*");

    return users;
  });

  app.get("/", async (req, reply) => {
    const users = dbKnex("users");

    return users;
  });
}
