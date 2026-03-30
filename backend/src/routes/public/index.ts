import type {FastifyPluginAsync} from "fastify";

// dummy example endpoint
// TODO: remove later
const route: FastifyPluginAsync = async (fastify, _) => {

    fastify.get('/', {sse: true}, async (request, reply) => {
        // get number of admins

        reply.sse.keepAlive();
        fastify.queueHandler.add(reply.sse);

        reply.sse.onClose(() => {
            console.log('Connection closed')
        })

        await reply.sse.send({ data: 'Connected' + fastify.queueHandler.length()})

        // fastify.prisma.admin.count().then((count) => console.log(count));

    });

};

export default route;