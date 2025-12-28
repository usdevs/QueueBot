import type {FastifyPluginAsync} from "fastify";

// dummy example endpoint
// TODO: remove later
const route: FastifyPluginAsync = async (fastify, _) => {

    fastify.get('/', async (request, reply) => {
        // get number of admins
        fastify.prisma.admin.count().then((count) => console.log(count));
    });

};

export default route;