import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  AI_PROVIDER: z.enum(['openai', 'mock']).default('mock'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export function isAiGenerationEnabled(): boolean {
  return env.AI_PROVIDER === 'openai' && !!env.OPENAI_API_KEY?.trim();
}

export function getGenerationModeLabel(): string {
  return isAiGenerationEnabled()
    ? `openai (${env.OPENAI_MODEL})`
    : 'mock fallback';
}
