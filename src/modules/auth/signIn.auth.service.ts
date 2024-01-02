import jwt from "jsonwebtoken";
import { env } from "../../env";
import { FastifyReply, FastifyRequest } from "fastify";

export async function jwtSignIn(payload: any) {
  return await jwt.sign(payload, env.JWT_SECRET_KEY, { expiresIn: "2h" });
}

export async function authorization(req: FastifyRequest, reply: FastifyReply) {
  const authorization = req.headers.authorization;
  if (!authorization) return reply.status(403).send("User not allowed.");

  const bearer = authorization.split(" ");
  const token = bearer[1];
  if (!bearer || !token) return reply.status(403).send("User not allowed.");

  const userData: any = await jwt.verify(token, env.JWT_SECRET_KEY);

  req.id = userData.id;
}
