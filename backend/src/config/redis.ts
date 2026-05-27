import Redis from 'ioredis';
import { env } from './env';

export const redisConnection = env.REDIS_URL?.trim()
  ? new Redis(env.REDIS_URL.trim(), { maxRetriesPerRequest: null })
  : new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      maxRetriesPerRequest: null,
    });

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});
