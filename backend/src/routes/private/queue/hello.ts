import type {FastifyPluginAsync} from 'fastify';


const route: FastifyPluginAsync = async (fastify, _) => {

    fastify.get('/hello', async (request, reply) => {

        return reply.code(200).send(request.userId);

    });

};

export default route;