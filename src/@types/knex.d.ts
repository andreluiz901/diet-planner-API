import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      username: string;
      email: string;
      password: string;
      created_at: date;
      age: number;
      start_weight?: number;
      current_weight?: number;
      goal_weight?: number;
      goal: string;
    };
  }
}

declare module "knex";
