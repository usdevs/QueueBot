import fp from 'fastify-plugin'
import {type FastifyInstance, type FastifyPluginAsync} from 'fastify'
import type {SSEReplyInterface} from "@fastify/sse";
import type {QueueConfigModel} from "./generated/prisma/models/QueueConfig.js";

enum PayloadType {
    CONFIG = "CFG",
    LIST = "LST",
}

export class QueueHandler {

    private clients: SSEReplyInterface[]
    private cacheConfig: QueueConfigModel | undefined;
    private fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.clients = [];
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
        }).then((result) => {
            this.notify(PayloadType.CONFIG, result);
            this.cacheConfig = result;
            return result;
        });
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

    addConnection(conn: SSEReplyInterface): void {
        this.clients.push(conn);
    }

    private notify(type: PayloadType, data: any) : void {
        this.clients = this.clients.filter((conn: SSEReplyInterface) => conn.isConnected);
        const payload = {type, data};
        this.clients.forEach((conn: SSEReplyInterface) => {
            conn.send({
                id: "1",
                event: 'update',
                data: payload,
            });
        })

    }

    length(): number {
        return this.clients.length;
    }

}

export const queueHandlerPlugin: FastifyPluginAsync = fp(async (fastify, _) => {

    let queueHandler = new QueueHandler(fastify);

    fastify.decorate('queueHandler', queueHandler);
    fastify.addHook('onClose', async (fastify) => {
        // await fastify.prisma.$disconnect()
    });

})

