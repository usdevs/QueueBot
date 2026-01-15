import {z} from 'zod';
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {isAdmin} from "../../../shared.js";


const route: FastifyPluginAsyncZod = async (fastify, _) => {

    /**
    * GET /queue/status
    * Checks if the queue is open
    */
    fastify.get('/status', async (request, reply) => {
        return reply.code(200).send({status: (await fastify.getQueueConfig()).isOpen});
    });

    /**
    * PATCH /queue/status (admin-only)
    * Opens/closes the queue
    */
    fastify.patch('/status', {
        preHandler: isAdmin,
        schema: {
            querystring: z.object({
                open: z.stringbool(),
            })}
        }, async (request, reply) => {
        let config = await fastify.prisma.queueConfig.findFirst().then((queueConfig) => queueConfig);

        if (config === null) {
            reply.code(500);
            throw new Error("No queue configured");
        }

        config.isOpen = request.query.open;

        await fastify.prisma.queueConfig.update({
            where: {
                id: config.id
            },
            data: config
        }).then(async (config) => {
            // update local copy of queueConfig
            await fastify.getQueueConfig(true);
            return reply.code(200).send(config);
        }).catch((e) => {
            reply.code(500);
            throw new Error(e.message);
        });

    });

};

export default route;
