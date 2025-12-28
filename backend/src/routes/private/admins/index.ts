import {isAdmin} from "../../../shared.js";
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {z} from 'zod';

const route: FastifyPluginAsyncZod = async (fastify, _) => {

    fastify.get('/', {preHandler: isAdmin}, async (request, reply) => {
        await fastify.prisma.admin.findMany().then((admins) => {
            return reply.code(200).send(admins);
        }).catch((err) => {
            return reply.code(500).send({error: err.message});
        });
    });

    fastify.post('/:targetId', {
        schema: {
            params: z.object({
                targetId: z.coerce.number()
            }),
        },
        preHandler: isAdmin}, async (request, reply) => {

        const {targetId} = request.params;



    });

};

export default route;