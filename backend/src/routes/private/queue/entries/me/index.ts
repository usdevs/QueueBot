import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const route: FastifyPluginAsyncZod = async (fastify) => {

  /**
   * DELETE /queue/entries/me
   * Delete the user from the queue
   */
  fastify.delete("/", async (request, reply) => {
    await fastify.prisma.queue
      .delete({
        where: { telegram_id: request.userId! },
      })
      .then(() => {
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
    const entries = await fastify.prisma.queue.findMany({
      orderBy: { timeCreated: "asc" },
      select: { telegram_id: true },
    });

    const index = entries.findIndex((e) => e.telegram_id === userId);

    // User not in queue
    if (index === -1) {
      reply.code(400);
      throw new Error("User not in queue");
    }

    // index = number of people ahead (0 means you're first)
    return reply.code(200).send({
      ahead: index,
    });
  });

};

export default route;
