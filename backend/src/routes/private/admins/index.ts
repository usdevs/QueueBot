import {isAdmin} from "../../../shared.js";
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {z} from 'zod';

const route: FastifyPluginAsyncZod = async (fastify, _) => {

    fastify.get('/', {preHandler: isAdmin}, async (request, reply) => {
        await fastify.prisma.admin.findMany().then((admins) => {
            return reply.code(200).send(admins);
        }).catch((e) => {
            reply.code(500);
            throw new Error(e.message);
        });
    });

    // remove admin endpoint
    fastify.delete('/:targetId', {
        schema: {
            params: z.object({
                targetId: z.string()
            }),
        },
        preHandler: isAdmin}, async (request, reply) => {

        const {targetId} = request.params;

        await fastify.prisma.admin.findUnique({ where: {telegram_id: targetId} }).then((admin) => {
            if (admin == null) {
                reply.code(404);
                throw new Error("Admin not found");
            }
        }).catch((e) => {
            reply.code(500);
            throw new Error(e.message);
        });


        await fastify.prisma.admin.delete({
            where: {
                telegram_id: targetId,
            }
        }).catch((e) => {
            reply.code(500);
            throw new Error(e.message);
        });

        return reply.code(200).send({message: "Admin removed"});

    });

};

export default route;