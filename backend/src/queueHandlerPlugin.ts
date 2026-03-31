import fp from 'fastify-plugin'
import {type FastifyInstance, type FastifyPluginAsync} from 'fastify'
import type {SSEReplyInterface} from "@fastify/sse";
import type {QueueConfigModel} from "./generated/prisma/models/QueueConfig.js";
import type {QueueModel} from "./generated/prisma/models/Queue.js";

enum PayloadType {
    CONFIG = "CFG",
    LIST = "LST",
}

export class QueueHandler {

    private users: SSEReplyInterface[]
    private admins: SSEReplyInterface[]
    private cacheConfig: QueueConfigModel | undefined;
    private cacheEntries: QueueModel[] | undefined;
    private fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.users = [];
        this.admins = [];
        this.fastify = fastify;
        this.getQueueConfig();
    }

    public async updateQueue(transform: Promise<any>): Promise<QueueModel[]> {
        return transform.then(async (_) => {
            this.cacheEntries = await this.fastify.prisma.queue.findMany({
                orderBy: {timeCreated: "asc"},
            });
            this.notify({type: PayloadType.LIST, data: null}, true);
            this.notify({type: PayloadType.LIST, data: null}, false);
            return this.cacheEntries;
        });
    }

    public async getQueueEntries(): Promise<QueueModel[]> {
        if (this.cacheEntries != null) {
            return this.cacheEntries!;
        }
        try {
            this.cacheEntries = await this.fastify.prisma.queue.findMany({
                orderBy: {timeCreated: "asc"},
            });
        } catch (_) {
            throw new Error("Failed to fetch queue entries");
        }
        return this.cacheEntries;
    }

    // QueueConfig should only be modified through this function to ensure synchronization
    public async updateQueueConfig(config: QueueConfigModel): Promise<QueueConfigModel> {
        return this.fastify.prisma.queueConfig.update({
            where: {
                id: config.id
            },
            data: config
        }).then((result) => {
            this.notify({type: PayloadType.CONFIG, data: result}, true);
            this.notify({type: PayloadType.CONFIG, data: result}, false);
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

    public addConnection(conn: SSEReplyInterface, isAdmin: boolean): void {
        if (isAdmin) {
            this.admins.push(conn);
        } else {
            this.users.push(conn);
        }
    }

    private notify(payload: any, admin: boolean) : void {

        this.users = this.users.filter((conn: SSEReplyInterface) => conn.isConnected);
        this.admins = this.admins.filter((conn: SSEReplyInterface) => conn.isConnected);

        (admin ? this.admins : this.users).forEach((conn: SSEReplyInterface) => {
            conn.send({
                id: "1",
                event: 'update',
                data: payload,
            });
        })

    }

}

export const queueHandlerPlugin: FastifyPluginAsync = fp(async (fastify, _) => {

    let queueHandler = new QueueHandler(fastify);

    fastify.decorate('queueHandler', queueHandler);

})

