import 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        userId: number;
    }
}

export interface TelegramWebUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    allows_write_to_pm?: boolean;
    photo_url?: string;
}

export interface TelegramWebAppData {
    auth_date: string;
    hash: string;
    signature: string;
    user: TelegramWebUser;
    chat_instance?: string;
    chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel' | undefined;
    start_param?: string;
    can_send_after?: number;
}
