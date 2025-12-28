import {type FastifyPluginAsync} from 'fastify';
import * as jose from "jose";
import {createHmac} from "node:crypto";
import type {TelegramWebAppData, TelegramWebUser} from "../../../types.js";


const BOT_TOKEN = process.env.BOT_TOKEN!;
const JWT_SECRET = process.env.JWT_SECRET!;

async function newJWT(userId: string) {

    const secret = new TextEncoder().encode(
        JWT_SECRET
    );

    return await new jose.SignJWT({userId: userId})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);
}

function parseAuthData(raw: string) : TelegramWebAppData {
    const params = new URLSearchParams(raw);
    return {
        auth_date: params.get('auth_date') ?? '',
        hash: params.get('hash') ?? '',
        signature: params.get('signature') ?? '',
        chat_instance: params.get('chat_instance')!,
        chat_type: params.get('chat_type') as TelegramWebAppData['chat_type'],
        user: JSON.parse(params.get('user') || '{}') as TelegramWebUser
    };
}

function validate(raw: URLSearchParams, appData: TelegramWebAppData, token: string | undefined) {

    if (!appData.hash) throw new Error("Missing hash");

    if (!token) throw new Error("Missing token");

    const dataToCheck: string[] = [];

    for (const [key, value] of raw.entries()) {
        // hash field should not be included
        if (key !== 'hash') {
            dataToCheck.push(`${key}=${value}`);
        }
    }

    dataToCheck.sort(); // Telegram requires alphabetical order

    const dataCheckString = dataToCheck.join('\n');

    const secretKey = createHmac('sha256', 'WebAppData')
        .update(token)
        .digest();

    const calculatedHash = createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    if (calculatedHash !== appData.hash) {
        throw new Error("Invalid signature");
    }

}

const route: FastifyPluginAsync = async (fastify, _) => {

    fastify.get('/', async (request, reply) => {

        // Generate a valid JWT for development purpose
        if (process.env.NODE_ENV === 'development') {
            return reply.code(200).send({token: await newJWT("2202843044")});
        }

        const [authType, authData = ''] = (request.headers.authorization || '').split(' ');

        switch (authType) {
            case 'tma':
                try {
                    const appData = parseAuthData(authData);
                    validate(new URLSearchParams(authData), appData, BOT_TOKEN);
                    return reply.code(200).send({token: await newJWT(appData.user.id.toString())});
                } catch (e: any) {
                    reply.code(500);
                    throw new Error(e.message);
                }
            default:
                reply.code(401);
                throw new Error("Unauthorized");
        }


    });

};

export default route;