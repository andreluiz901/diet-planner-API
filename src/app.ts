import fastfy from "fastify";

export const app = fastfy();

app.get("/", () => {
  return "hello world";
});

app.listen(3010, () => {
  console.log("Server running!");
});
