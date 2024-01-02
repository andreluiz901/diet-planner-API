import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import request from "supertest";
import { execSync } from "child_process";

describe("Users Routes", () => {
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

  it("Should be able to create a new user", async () => {
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

    expect(newUser.body.data).toEqual(
      expect.objectContaining({
        name: "name of user",
        username: "valid_",
        email: "valid@email.com",
        age: 22,
        current_weight: 100,
        goal_weight: 80,
        goal: "LOSE",
      })
    );
  });

  it("should be able to identify a user beetween requisitions", async () => {
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

    expect(loggedInUser.body.access_token).toBeTypeOf("string");
  });
});
