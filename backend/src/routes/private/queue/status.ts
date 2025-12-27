import {z} from 'zod';
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {isAdmin} from "../../../shared.js";


const route: FastifyPluginAsyncZod = async (fastify, _) => {

    // get queue status
    fastify.get('/status', async (request, reply) => {
        await fastify.prisma.queueConfig.findFirst().then((queueConfig) => {
            if (queueConfig === null) {
                return reply.code(500).send({error: 'No queue configured'});
            }
            return reply.code(200).send({status: queueConfig.isOpen});
        })

    });

    // update queue status
    fastify.patch('/status', {
        preHandler: isAdmin,
        schema: {
            querystring: z.object({
                open: z.coerce.boolean(),
            })}
        }, async (request, reply) => {
        let config = await fastify.prisma.queueConfig.findFirst().then((queueConfig) => queueConfig);

        if (config === null) {
            return reply.code(500).send({error: 'No queue configured'});
        }

        config.isOpen = request.query.open;

        await fastify.prisma.queueConfig.update({
            where: {
                id: config.id
            },
            data: config
        }).then((config) => {
            return reply.code(200).send(config);
        }).catch((err) => {
            return reply.code(500).send({error: err.message});
        });

    });

};

export default route;