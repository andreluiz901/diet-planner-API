import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
} from "vitest";
import { app } from "../../app";
import request from "supertest";
import { execSync } from "child_process";

describe("Meals Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new meal", async () => {
    const newUser = await request(app.server)
      .post("/users")
      .send({
        name: "name of user",
        username: "valid_",
        email: "valid@email.com",
        password: "validPassword@123",
        confirm_password: "validPassword@123",
        age: 22,
        current_weight: 100,
        goal_weight: 80,
        goal: "LOSE",
      })
      .expect(201);

    const loggedInUser = await request(app.server)
      .post("/auth/signIn")
      .send({
        email: "valid@email.com",
        password: "validPassword@123",
      })
      .expect(200);

    const newMeal = await request(app.server)
      .post("/meals")
      .set("Authorization", `Bearer ${loggedInUser.body.access_token}`)
      .send({
        name: "refeição de hoje",
        description: "batata doce com frango",
        date_hour: "2024-01-02T03:24:00",
        is_on_diet: true,
      })
      .expect(201);

    expect(newMeal.body.data[0]).toEqual(
      expect.objectContaining({
        name: "refeição de hoje",
        description: "batata doce com frango",
        date_hour: "2024-01-02T06:24:00.000Z",
        is_on_diet: 1,
      })
    );

    expect(newMeal.body.data[0].id).toBeTypeOf("string");
    expect(newMeal.body.data[0].user_id).toBeTypeOf("string");
  });

  it("should be able to a user update  meal", async () => {
    const newUser = await request(app.server)
      .post("/users")
      .send({
        name: "name of user",
        username: "valid_",
        email: "valid@email.com",
        password: "validPassword@123",
        confirm_password: "validPassword@123",
        age: 22,
        current_weight: 100,
        goal_weight: 80,
        goal: "LOSE",
      })
      .expect(201);

    const loggedInUser = await request(app.server)
      .post("/auth/signIn")
      .send({
        email: "valid@email.com",
        password: "validPassword@123",
      })
      .expect(200);

    const newMeal = await request(app.server)
      .post("/meals")
      .set("Authorization", `Bearer ${loggedInUser.body.access_token}`)
      .send({
        name: "refeição de hoje",
        description: "batata doce com frango",
        date_hour: "2024-01-02T03:24:00",
        is_on_diet: true,
      })
      .expect(201);

    const updatedMeal = await request(app.server)
      .put(`/meals/${newMeal.body.data[0].id}`)
      .set("Authorization", `Bearer ${loggedInUser.body.access_token}`)
      .send({
        name: "refeição updated",
        description: "modified",
        date_hour: "2024-01-01T08:24:00",
        is_on_diet: false,
      });

    expect(updatedMeal.body).toEqual(
      expect.objectContaining({
        id: newMeal.body.data[0].id,
        name: "refeição updated",
        description: "modified",
        date_hour: new Date("2024-01-01T08:24:00").toISOString(),
        is_on_diet: 0,
        user_id: newUser.body.data.id,
      })
    );
  });
});
