import {isAdmin} from "../../../../shared.js";
import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {z} from 'zod';

const route: FastifyPluginAsyncZod = async (fastify, _) => {

    fastify.get('/', {preHandler: isAdmin}, async (request, reply) => {
        await fastify.prisma.adminRequester.findMany().then((requesters) => {
            return reply.code(200).send(requesters);
        }).catch((e) => {
            reply.code(500);
            throw new Error(e.message);
        });
    });

    // create new admin request
    fastify.post('/:targetId', {
        schema: {
            params: z.object({
                targetId: z.string()
            }),
            querystring: z.object({
                username: z.string()
            }),
        },}, async (request, reply) => {

        const {targetId} = request.params;
        const {username} = request.query;

        await fastify.prisma.adminRequester.create({data: {telegram_id: targetId, telegram_username: username}}).then(
            (requester) => {
                return reply.code(200).send(requester);
            }
        ).catch((e) => {
            if (e.code == "P2002") {
                reply.code(400);
                throw new Error("Request for user already exists");
            }
            reply.code(500);
            throw new Error(e.message);
        });

    });

    // accepts or reject an admin request
    fastify.patch('/:targetId', {
        schema: {
            params: z.object({
                targetId: z.string()
            }),
            querystring: z.object({
                accepts: z.stringbool()
            })
        },
        preHandler: isAdmin}, async (request, reply) => {

        const {targetId} = request.params;
        const {accepts} = request.query;

        await fastify.prisma.adminRequester.findUnique({ where: {telegram_id: targetId} }).then((requester) => {
            if (requester == null) {
                reply.code(404);
                throw new Error("Requester not found");
            }
        }).catch((e) => {
            reply.code(500);
            throw new Error(e.message);
        });

        await fastify.prisma.$transaction(async (tx) => {
            await tx.adminRequester.delete({where: {telegram_id: targetId}});
            if (accepts) {
                await tx.admin.create({
                    data: {
                        telegram_id: targetId,
                    }
                }).catch((e) => {
                    if (e.code == "P2002") {
                        reply.code(400);
                        throw new Error("User is already admin");
                    }
                });
                return reply.code(200).send({message: "Admin added successfully"});
            } else {
                return reply.code(200).send({message: "Admin request denied"});
            }
        }).catch((e) => {
            reply.code(500);
            throw new Error(e.message);
        });

    });



};

export default route;