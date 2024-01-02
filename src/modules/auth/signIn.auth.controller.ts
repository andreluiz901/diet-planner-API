import { FastifyInstance } from "fastify";
import { z } from "zod";
import { findOneByEmail } from "../users/users.services";
import { compareString } from "../../utils/encrypt-utils";
import { jwtSignIn } from "./signIn.auth.service";

export async function authRoutes(app: FastifyInstance) {
  app.post("/signIn", async (req, reply) => {
    const signInSchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = signInSchema.parse(req.body);

    const userFound = await findOneByEmail(email);

    if (userFound && (await compareString(password, userFound.password))) {
      const { password: _, ...userLogged } = userFound;
      const access_token = await jwtSignIn(userLogged);

      req.headers.authorization = `Bearer ${access_token}`;

      return reply
        .status(200)
        .send({ message: "User Logged in", access_token, data: userLogged });
    }

    return reply.status(403).send({ message: "User os Password invalid" });
  });
}
