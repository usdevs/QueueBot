import {z} from 'zod';
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { isAdmin } from "../../../../shared.js";

const route: FastifyPluginAsyncZod = async (fastify) => {

  /**
   * GET /queue/entries
   * Returns the entire queue ordered from first to last (admin-only)
   */
  fastify.get(
    "/",
    { preHandler: isAdmin }, // only admins can call this endpoint
    async (_request, reply) => {
      try {
        const entries = await fastify.prisma.queue.findMany({
          orderBy: { timeCreated: "asc" },
        });

        return reply.code(200).send({ entries });
      } catch (e: any) {
        reply.code(500);
        throw new Error("Failed to fetch queue entries");
      }
    }
  );

  /**
   * POST /queue/entries
   * Adds the user to the queue
   */
  fastify.post(
    "/",
    async (request, reply) => {
      const userId = request.userId!;

      // 1) Queue must exist and be open
      const config = await fastify.prisma.queueConfig.findFirst();
      if (!config || !config.isOpen) {
        reply.code(500);
        throw new Error("No queue configured");
      }

      // 2) Prevent duplicate entries
      const alreadyInQueue = await fastify.prisma.queue.findUnique({
        where: { telegram_id: userId },
      });

      if (alreadyInQueue) {
        reply.code(409);
        throw new Error("User already in queue");
      }

      // 3) Add user to queue
      await fastify.prisma.queue.create({
        data: {
          telegram_id: userId,
          timeCreated: new Date(),
        },
      });

      // 4) Compute position and number of people ahead (for frontend)
      const allEntries = await fastify.prisma.queue.findMany({
        orderBy: { timeCreated: "asc" },
        select: { telegram_id: true },
      });

      const position =
        allEntries.findIndex((e) => e.telegram_id === userId) + 1;

      return reply.code(201).send({
        joined: true,
        position,
        ahead: position - 1,
      });
    }
  );

};

export default route;
