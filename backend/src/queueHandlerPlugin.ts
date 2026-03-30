import fp from 'fastify-plugin'
import {type FastifyInstance, type FastifyPluginAsync} from 'fastify'
import type {SSEReplyInterface} from "@fastify/sse";
import type {QueueConfigModel} from "./generated/prisma/models/QueueConfig.js";

export class QueueHandler {

    private sseConnections: SSEReplyInterface[]
    private cacheConfig: QueueConfigModel | undefined;
    private fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.sseConnections = [];
        this.fastify = fastify;
        this.getQueueConfig();
    }

    // QueueConfig should only be modified through this function to ensure synchronization
    public async updateQueueConfig(config: QueueConfigModel): Promise<QueueConfigModel> {
        return this.fastify.prisma.queueConfig.update({
            where: {
                id: config.id
            },
            data: config
        }).then((result) => this.cacheConfig = result);
    }

    // QueueConfig should only be accessed through this function to reduce calls to DB
    // force if true forces a db fetch
    public async getQueueConfig(force?: boolean): Promise<QueueConfigModel> {
        if (this.cacheConfig != null && !force) {
            return this.cacheConfig!;
        }
        await this.fastify.prisma.queueConfig.findFirst().then((queueConfig) => {
            if (queueConfig == null) {
                throw new Error("No queue configured");
            } else {
                this.cacheConfig = queueConfig;
            }
        });
        return this.cacheConfig!;
    }

    add(conn: SSEReplyInterface): void {
        this.sseConnections.push(conn);
        this.sseConnections = this.sseConnections.filter((conn: SSEReplyInterface) => conn.isConnected);
    }

    private notify() : void {}

    length(): number {
        return this.sseConnections.length;
    }

}

export const queueHandlerPlugin: FastifyPluginAsync = fp(async (fastify, _) => {

    let queueHandler = new QueueHandler(fastify);

    fastify.decorate('queueHandler', queueHandler);
    fastify.addHook('onClose', async (fastify) => {
        // await fastify.prisma.$disconnect()
    });

})

