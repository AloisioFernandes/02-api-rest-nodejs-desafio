import { FastifyInstance } from "fastify";
import z from "zod";
import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    });

    const { name } = createUserBodySchema.parse(request.body);

    const userId = crypto.randomUUID();

    await knex("users").insert({
      id: userId,
      name,
    });

    reply.cookie("userId", userId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send();
  });

  app.get("/users", async (request, reply) => {
    const users = await knex("users").select("*");

    return { users };
  });
}
