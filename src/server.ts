import cookie from "@fastify/cookie";
import fastify from "fastify";

import { env } from "./env";
import { usersRoutes } from "./routes/users";

const app = fastify();

app.register(cookie);

app.addHook("preHandler", async (request, reply) => {
  console.log(`Received ${request.method} request for ${request.url}`);
});

app.register(usersRoutes);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
});
