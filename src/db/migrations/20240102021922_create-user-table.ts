import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.text("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.integer("age").notNullable();
    table.integer("start_weight");
    table.integer("current_weight");
    table.integer("weight_goal");
    table.enum("goal", ["LOSE", "GAIN"]).defaultTo("LOSE").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
