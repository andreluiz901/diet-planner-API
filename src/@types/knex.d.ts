import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      created_at: string;
      age: number;
      start_weight: number;
      current_weight: number;
      goal_weight: number;
      goal: string;
    };
  }
}

declare module "knex";
