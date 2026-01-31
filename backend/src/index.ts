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
import queueConfigPlugin from "./queueConfigPlugin.js";

const JWT_SECRET = process.env.JWT_SECRET!;

const fastify = Fastify({
    logger: process.env.NODE_ENV === "development",
}).withTypeProvider<ZodTypeProvider>();

// tell fastify to use zod for type validation
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

await fastify.register(cors, {
    origin: true, // set this to frontend url for production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'User-Id'],
    credentials: true,
});

// SSE
// await fastify.register(fastifySSE);

const authHook = async (request: FastifyRequest, reply: FastifyReply) => {

    const secret = new TextEncoder().encode(
        JWT_SECRET
    );

    if (request.headers.authorization == undefined) {
            reply.code(400);
            throw new Error("Missing JWT");
    }
    const { payload } = await jose.jwtVerify(request.headers.authorization!, secret).catch((_) => {
        reply.code(401);
        throw new Error("Unauthorized");
    });

    request.userId = payload.userId as string;

};

// Init sql db connection
fastify.register(prismaPlugin);
// Register customs plugins
fastify.register(queueConfigPlugin);

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
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start();
