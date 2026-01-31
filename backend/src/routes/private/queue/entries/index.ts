import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {isAdmin} from "../../../../shared.js";
import {adjectives, animals, uniqueNamesGenerator} from "unique-names-generator";
import {z} from "zod";

const route: FastifyPluginAsyncZod = async (fastify) => {

    /**
     * GET /queue/entries
     * Returns the entire queue ordered from first to last (admin-only)
     */
    fastify.get(
        "/",
        {preHandler: isAdmin,},
        async (_request, reply) => {

            try {
                const entries = await fastify.prisma.queue.findMany({
                    orderBy: {timeCreated: "asc"},
                });
                return reply.code(200).send({entries});
            } catch (e: any) {
                reply.code(500);
                throw new Error("Failed to fetch queue entries");
            }

        }
    );

    fastify.delete("/:targetId", {
        preHandler: isAdmin, schema: {
            params: z.object({
                targetId: z.string()
            }),
        },
    }, async (request, reply) => {
        await fastify.prisma.queue
            .delete({
                where: {telegram_id: request.params.targetId},
            })
            .then( async () => {

                try {
                    const entries = await fastify.prisma.queue.findMany({
                        orderBy: {timeCreated: "asc"},
                    });
                    return reply.code(200).send({entries});
                } catch (e: any) {
                    reply.code(500);
                    throw new Error("Failed to fetch updated queue entries");
                }

            })
            .catch((e: any) => {
                // Prisma "record not found" error code (user not in queue)
                if (e?.code === "P2025") {
                    reply.code(400);
                    throw new Error("User not in queue");
                }

                reply.code(500);
                throw new Error(e?.message ?? "Failed to remove user");
            });
    })

    /**
     * POST /queue/entries
     * Adds the user to the queue
     */
    fastify.post(
        "/",
        async (request, reply) => {
            const userId = request.userId!;

            // Queue must exist and be open
            if (!(await fastify.getQueueConfig()).isOpen) {
                reply.code(400);
                throw new Error("Queue is closed");
            }

            // Prevent duplicate entries
            const alreadyInQueue = await fastify.prisma.queue.findUnique({
                where: {telegram_id: userId},
            });

            if (alreadyInQueue) {
                reply.code(409);
                throw new Error("User already in queue");
            }

            const name = uniqueNamesGenerator({
                dictionaries: [adjectives, animals], // colors can be omitted here as not used
                length: 2
            });

            // Add user to queue
            await fastify.prisma.queue.create({
                data: {
                    name: name,
                    telegram_id: userId,
                    timeCreated: new Date(),
                },
            });

            // Compute position and number of people ahead (for frontend)
            const allEntries = await fastify.prisma.queue.findMany({
                orderBy: {timeCreated: "asc"},
                select: {telegram_id: true},
            });

            const position =
                allEntries.findIndex((e) => e.telegram_id === userId) + 1;

            return reply.code(201).send({
                joined: true,
                position,
                ahead: position - 1,
                name: name,
            });
        }
    );

};

export default route;
