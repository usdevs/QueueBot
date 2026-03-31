import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {isAdmin} from "../../../../../shared.js";

const route: FastifyPluginAsyncZod = async (fastify) => {

  fastify.get('/subscribe', {sse: true}, async (request, reply) => {
    reply.sse.keepAlive();
    fastify.queueHandler.addConnection(reply.sse, false);
    await reply.sse.send({ data: 'Connected'})
  });

  /**
   * DELETE /queue/entries/me
   * Delete the user from the queue
   */
  fastify.delete("/", async (request, reply) => {

    await fastify.queueHandler.updateQueue(fastify.prisma.queue
        .delete({
          where: { telegram_id: request.userId! },
        })).then(() => {
        return reply.code(200).send({ left: true });
      })
      .catch((e: any) => {
        // Prisma "record not found" error code (user not in queue)
        if (e?.code === "P2025") {
          reply.code(400);
          throw new Error("User not in queue");
        }

        reply.code(500);
        throw new Error(e?.message ?? "Failed to leave queue");
      });
  });

  /**
   * GET /queue/entries/me
   * Get the number of people ahead of user
   */
  fastify.get("/", async (request, reply) => {
    const userId = request.userId;

    // Queue must exist and be open
    const config = await fastify.prisma.queueConfig.findFirst();
    if (!config || !config.isOpen) {
      reply.code(500);
      throw new Error("No queue configured");
    }

    // Fetch queue in order and locate the user
    const entries = await fastify.queueHandler.getQueueEntries();

    const index = entries.findIndex((e) => e.telegram_id === userId);

    // index = number of people ahead (0 means you're first), (-1 means not in queue)
    return reply.code(200).send({
      name: index == -1 ? undefined : entries[index]!.name,
      ahead: index == -1 ? entries.length : index,
    });
  });

};

export default route;
