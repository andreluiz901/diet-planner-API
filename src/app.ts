import fastfy from "fastify";
import { userRoutes } from "./modules/users/users.controllers";
import { mealsRoutes } from "./modules/meals/meals.controllers";
import { authRoutes } from "./modules/auth/signIn.auth.controller";

export const app = fastfy();

app.addHook("preHandler", async (req, reply) => {
  console.log(`[${req.method}] ${req.url}`);
});

app.register(userRoutes, {
  prefix: "users",
});

app.register(mealsRoutes, {
  prefix: "meals",
});

app.register(authRoutes, {
  prefix: "auth",
});
