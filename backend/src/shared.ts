import {type FastifyReply, type FastifyRequest} from "fastify";

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {

    if (request.userId == null) {
        reply.code(401);
        throw new Error("Missing user id");
    }

    await request.server.prisma.admin.findFirst({where: {telegram_id: request.userId}}).then((user) => {
        if (user == null) {
            reply.code(403);
            throw new Error("Endpoint requires administrator privileges");
        }
    }).catch((e) => {
        reply.code(500);
        throw new Error(e.message);
    });
}