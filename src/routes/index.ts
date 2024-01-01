import { app } from "../app";
import { userRoutes } from "../modules/users/users.controllers";
import { mealsRoutes } from "../modules/meals/meals.controllers";

app.register(userRoutes, {
  prefix: "users",
});

app.register(mealsRoutes, {
  prefix: "meals",
});
