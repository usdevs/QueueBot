import Fastify, {type FastifyReply, type FastifyRequest} from 'fastify';
import cors from '@fastify/cors'
import * as jose from 'jose'
import autoLoad from '@fastify/autoload';
import { join } from 'path';
import prismaPlugin from './prismaPlugin.js';
import {
    validatorCompiler,
    serializerCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod';

const JWT_SECRET = process.env.JWT_SECRET!;

const fastify = Fastify({
    logger: process.env.NODE_ENV === "development",
}).withTypeProvider<ZodTypeProvider>();

// tell fastify to use zod for type validation
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'User-Id'],
    credentials: true,
});

const authHook = async (request: FastifyRequest, reply: FastifyReply) => {

    const secret = new TextEncoder().encode(
        JWT_SECRET
    );

    try {

        // bypass auth check during development
        if (request.headers.authorization == undefined) {
            if (process.env.NODE_ENV !== 'development') {
                return reply.code(400).send({"error": "Missing JWT token"});
            }
        }
        const { payload } = await jose.jwtVerify(request.headers.authorization!, secret);

        request.userId = payload.userId as string;

    } catch (error) {
        return reply.code(401).send({"error": "Unauthorized"})
    }

};

// Init sql db connection
fastify.register(prismaPlugin);

fastify.register((fastify) => {

    fastify.addHook("preHandler", authHook);

    fastify.register(autoLoad, {
        dir: join(process.cwd(), 'src/routes/private'),
        routeParams: true
    });

});


fastify.register(autoLoad, {
    dir: join(process.cwd(), 'src/routes/public'),
    routeParams: true
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start();
