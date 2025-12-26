import type {FastifyPluginAsync} from "fastify";

const route: FastifyPluginAsync = async (fastify, _) => {

    fastify.get('/', async (request, reply) => {
        // get number of organizers
        fastify.prisma.organiser.count().then((count) => console.log(count));
    });

};

export default route;