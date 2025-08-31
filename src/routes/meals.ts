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

  app.put(
    "/:id",
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const updateMealParamsSchema = z.object({
        id: z.uuid(),
      });

      const updateMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        isOnDiet: z.boolean().optional(),
        mealTime: z.iso.datetime().optional(),
      });

      const { name, description, isOnDiet, mealTime } = updateMealBodySchema.parse(request.body);

      const { id } = updateMealParamsSchema.parse(request.params);

      const { userId } = request.cookies;

      await knex("meals")
        .where({ id, user_id: userId })
        .update({
          name,
          description,
          is_on_diet: isOnDiet,
          meal_time: mealTime ? new Date(mealTime).toISOString() : undefined,
          updated_at: new Date().toISOString(),
        });

      return reply.status(204).send();
    }
  );
}
