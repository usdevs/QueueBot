import {type FastifyReply, type FastifyRequest} from "fastify";

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {

    if (request.userId == null) {
        return reply.code(401).send({"error": "Missing user id"});
    }

    await request.server.prisma.admin.findFirst({where: {telegram_id: request.userId}}).then((user) => {
        if (user == null) {
            return reply.code(403).send({"error": "Endpoint requires administrator privileges"});
        }
    }).catch((e) => {
        return reply.code(500).send({"error": e.message});
    });
}