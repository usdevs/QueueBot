import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
const route: FastifyPluginAsyncZod = async (fastify, _) => {

    fastify.get('/info', async (request, reply) => {
        const config = (await fastify.queueHandler.getQueueConfig());
        return reply.code(200).send({
            status: config.isOpen, venue: config.venue,
            eventName: config.eventName, positionBeforePing: config.positionBeforePing
        });
    });

};

export default route;
