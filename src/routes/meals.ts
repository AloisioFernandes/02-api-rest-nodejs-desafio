import { FastifyInstance } from "fastify";
import z from "zod";
import { knex } from "../database";
import { checkUserIdExists } from "../middlewares/check-user-id-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies;

      const meals = await knex("meals").where({ user_id: userId }).select("*");
      return { meals };
    }
  );

  app.post(
    "/",
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        mealTime: z.iso.datetime(),
      });

      const { name, description, isOnDiet, mealTime } =
        createMealBodySchema.parse(request.body);

      const { userId } = request.cookies;

      await knex("meals").insert({
        id: crypto.randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        meal_time: new Date(mealTime).toISOString(),
        user_id: userId,
      });

      return reply.status(201).send();
    }
  );
}
