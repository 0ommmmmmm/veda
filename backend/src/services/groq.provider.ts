import Groq from 'groq-sdk';
import { env } from '../config/env';

let client: Groq | null = null;

function getClient(): Groq {
  if (!env.GROQ_API_KEY?.trim()) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  if (!client) {
    client = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return client;
}

function stripMarkdownFences(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('```')) {
    return trimmed;
  }
  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

export async function generateJsonCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const groq = getClient();
  const response = await groq.chat.completions.create({
    model: env.GROQ_MODEL,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error('Groq returned empty response');
  }

  return stripMarkdownFences(content);
}
