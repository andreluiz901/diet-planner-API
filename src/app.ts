import fastfy from "fastify";
import { userRoutes } from "./routes";

export const app = fastfy();

app.register(userRoutes, {
  prefix: "users",
});
