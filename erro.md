ound
2025-11-20T22:26:30.539685180Z     at D (.next/server/app/page.js:139:14385)
2025-11-20T22:26:30.539692300Z     at async H (.next/server/app/page.js:93:51322)
2025-11-20T22:26:30.539715020Z     at async D (.next/server/app/page.js:93:50062)
2025-11-20T22:26:30.539718100Z     at async (.next/server/app/page.js:13:31473)
2025-11-20T22:26:30.539720620Z     at async (.next/server/app/page.js:37:34580)
2025-11-20T22:26:30.539723460Z     at async (.next/server/app/page.js:5:122681)
2025-11-20T22:26:30.539726180Z     at async t (.next/server/app/page.js:5:122484)
2025-11-20T22:26:30.539728740Z     at async e.run (.next/server/app/page.js:37:33964)
2025-11-20T22:26:30.539731860Z     at async e (.next/server/app/page.js:37:33806) {
2025-11-20T22:26:30.539734500Z   source: undefined,
2025-11-20T22:26:30.539736780Z   status: 'NOT_FOUND',
2025-11-20T22:26:30.539739140Z   detail: undefined,
2025-11-20T22:26:30.539741460Z   code: 404,
2025-11-20T22:26:30.539743780Z   originalMessage: "Model 'openai/gpt-oss-20b' not found",
2025-11-20T22:26:30.539746300Z   traceId: '2b9929931554e19f17405a53f20397e0',
2025-11-20T22:26:30.539748700Z   ignoreFailedSpan: true
2025-11-20T22:26:30.539750980Z }
2025-11-20T22:26:36.944836524Z Error splitting text into verses: Error [GenkitError]: NOT_FOUND: Model 'openai/gpt-oss-20b' not found
2025-11-20T22:26:36.944877005Z     at D (.next/server/app/page.js:139:14385)
2025-11-20T22:26:36.944882685Z     at async H (.next/server/app/page.js:93:51322)
2025-11-20T22:26:36.944885965Z     at async D (.next/server/app/page.js:93:50062)
2025-11-20T22:26:36.944888605Z     at async (.next/server/app/page.js:13:31473)
2025-11-20T22:26:36.944891045Z     at async (.next/server/app/page.js:37:34580)
2025-11-20T22:26:36.944893525Z     at async (.next/server/app/page.js:5:122681)
2025-11-20T22:26:36.944895925Z     at async t (.next/server/app/page.js:5:122484)
2025-11-20T22:26:36.944898285Z     at async e.run (.next/server/app/page.js:37:33964)
2025-11-20T22:26:36.944900805Z     at async e (.next/server/app/page.js:37:33806) {
2025-11-20T22:26:36.944903285Z   source: undefined,
2025-11-20T22:26:36.944906045Z   status: 'NOT_FOUND',
2025-11-20T22:26:36.944908405Z   detail: undefined,
2025-11-20T22:26:36.944910685Z   code: 404,
2025-11-20T22:26:36.944913605Z   originalMessage: "Model 'openai/gpt-oss-20b' not found",
2025-11-20T22:26:36.944916645Z   traceId: '22e4e24f60f901cd29c022d75dacf429',
2025-11-20T22:26:36.944919125Z   ignoreFailedSpan: true
2025-11-20T22:26:36.944921525Z }



tente seguir essa sintax 100%, mas adaptando para floxos desse projecto atual.
a baixo esta o codigo que deu certo:
'use server';

/**
 * @fileOverview A flow for handling chat conversations with an AI assistant.
 *
 * - chat - A function that takes conversation history and a new prompt and returns the AI's response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  prompt: z.string().describe('The user\'s latest message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(
  input: ChatInput
): Promise<ChatOutput> {
  const systemPrompt = `You are a helpful financial assistant. Your goal is to provide accurate and helpful advice on personal finance topics. The user is interacting with you through a chat interface. Keep your responses concise and easy to understand.`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...input.history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: input.prompt },
  ];

  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: 'openai/gpt-oss-20b',
  });

  const responseContent = chatCompletion.choices[0]?.message?.content;
  if (!responseContent) {
    throw new Error('No response from Groq API');
  }

  return { response: responseContent };
}
