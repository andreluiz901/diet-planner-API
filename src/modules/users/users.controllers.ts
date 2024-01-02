import { FastifyInstance } from "fastify";
import { dbKnex } from "../../database";
import { randomUUID } from "crypto";
import { z } from "zod";
import { findOneByEmail, findOneByUsername } from "./users.services";
import { encryptString } from "../../utils/encrypt-utils";

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
}
