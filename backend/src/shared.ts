import {type FastifyReply, type FastifyRequest} from "fastify";

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {

    if (request.userId == null) {
        return reply.code(401).send({"error": "Missing user id"});
    }

    await request.server.prisma.organiser.findFirst({where: {telegram_id: request.userId!}}).then((user) => {
        if (user == null) {
            return reply.code(401).send({"error": "Endpoint requires administrator privileges"});
        }
    });
}