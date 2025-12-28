import {z} from 'zod';
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {isAdmin} from "../../../shared.js";


const route: FastifyPluginAsyncZod = async (fastify, _) => {

    // get config parameters
    fastify.get('/config', {preHandler: isAdmin}, async (request, reply) => {
        await fastify.prisma.queueConfig.findFirst().then((queueConfig) => {
            if (queueConfig == null) {
                reply.code(500);
                throw new Error("No queue configured");
            }
            return reply.code(200).send(queueConfig);
        })

    });

    // update config parameters
    fastify.patch('/config', {
        preHandler: isAdmin,
        schema: {
            querystring: z.object({
                positionBeforePing: z.coerce.number()
            })}
    }, async (request, reply) => {
        let config = await fastify.prisma.queueConfig.findFirst().then((queueConfig) => queueConfig);

        if (config === null) {
            reply.code(500);
            throw new Error("No queue configured");
        }

        config.positionBeforePing = request.query.positionBeforePing;

        await fastify.prisma.queueConfig.update({
            where: {
                id: config.id
            },
            data: config
        }).then((config) => {
            return reply.code(200).send(config);
        }).catch((e) => {
            reply.code(500);
            throw new Error(e.message);
        });

    });

};

export default route;