import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {isAdmin} from "../../../shared.js";

const BOT_TOKEN = process.env.BOT_TOKEN;

const route: FastifyPluginAsyncZod = async (fastify, _) => {

    fastify.post('/next', {preHandler: isAdmin}, async (request, reply) => {

        const allEntries = await fastify.prisma.queue.findMany({
            orderBy: {timeCreated: "asc"},
        });

        if (allEntries.length === 0) {
            return reply.code(200).send({entries: []});
        }

        const top = allEntries.shift();
        // remove top user from the queue
        await fastify.prisma.queue.delete({where: {telegram_id: top!.telegram_id}});

        // pings the top n user
        for (let i = 0; i < (await fastify.getQueueConfig()).positionBeforePing; i++) {
            if (allEntries[i] == undefined) {
                break;
            }
            let message;
            if (i == 0) {
                message = `IT'S YOUR TURN NOW!!! Come Quickly to Cendana CR18`
            } else {
                message = `Your turn is coming up! Only ${i} person ahead.\nPlease start making your way to Cendana CR18.`
            }
            const queryString = new URLSearchParams(
                {'chat_id': allEntries[i]!.telegram_id, 'text': message, 'parse_mode': 'Markdown'}).toString();
            // hit Telegram API to send user message
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?${queryString}`, {
                method: 'POST',
            })
        }

        return reply.code(200).send({entries: allEntries});

    });

};

export default route;