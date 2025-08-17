import fastify from 'fastify';

import { env } from './env';

const app = fastify()

app.addHook('preHandler', async (request, reply) => {
  console.log(`Received ${request.method} request for ${request.url}`);
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
});