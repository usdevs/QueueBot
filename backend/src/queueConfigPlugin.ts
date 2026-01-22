import fp from 'fastify-plugin'
import type {FastifyPluginAsync} from 'fastify'
import type {QueueConfigModel} from "./generated/prisma/models/QueueConfig.js";

const queueConfigPlugin: FastifyPluginAsync = fp(async (fastify, _) => {

    let cacheConfig: QueueConfigModel | undefined;

    // QueueConfig should only be accessed through this function to reduce calls to DB

    // force if true forces a db fetch
    let getQueueConfig: (force?: boolean) => Promise<QueueConfigModel> = async (force?: boolean) => {
        if (cacheConfig != null && !force) {
            return cacheConfig!;
        }
        await fastify.prisma.queueConfig.findFirst().then((queueConfig) => {
            if (queueConfig == null) {
                throw new Error("No queue configured");
            } else {
                cacheConfig = queueConfig;
            }
        });
        return cacheConfig!;
    }

    fastify.decorate("getQueueConfig", getQueueConfig);

})

export default queueConfigPlugin