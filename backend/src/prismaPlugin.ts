import fp from 'fastify-plugin'
import type {FastifyPluginAsync} from 'fastify'
import {PrismaClient} from "./generated/prisma/client.js";
import {PrismaNeon} from "@prisma/adapter-neon";

const prismaPlugin: FastifyPluginAsync = fp(async (fastify, _) => {

    const prisma = new PrismaClient({
        log: [{ level: 'error', emit: 'event' }],
        adapter: new PrismaNeon({
            connectionString: `${process.env.DATABASE_URL}`,
        }),
    })

    await prisma.$connect()

    // make prisma client accessible through fastify instance
    fastify.decorate('prisma', prisma)
    fastify.addHook('onClose', async (fastify) => {
        await fastify.prisma.$disconnect()
    });

})

export default prismaPlugin