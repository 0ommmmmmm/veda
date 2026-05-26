import OpenAI from 'openai';
import { env } from '../config/env';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!env.OPENAI_API_KEY?.trim()) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return client;
}

export async function generateJsonCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned empty response');
  }

  return content;
}
