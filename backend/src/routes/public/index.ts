import type {FastifyPluginAsync} from "fastify";

// dummy example endpoint
// TODO: remove later
const route: FastifyPluginAsync = async (fastify, _) => {

    fastify.get('/', {sse: true}, async (request, reply) => {
        // get number of admins

        reply.sse.keepAlive();
        fastify.queueHandler.addConnection(reply.sse, true);

        await reply.sse.send({ data: 'Connected'})

    });

};

export default route;