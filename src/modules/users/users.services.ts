import { dbKnex } from "../../database";

export async function findOneByEmail(email: string) {
  return await dbKnex("users").where({ email }).first();
}

export async function findOneByUsername(username: string) {
  return await dbKnex("users").where({ username }).first();
}
