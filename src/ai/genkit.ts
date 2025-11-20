import openAI from '@genkit-ai/compat-oai';
import { genkit, z } from 'genkit';

// Inicializa o Genkit com o provedor OpenAI
export const ai = genkit({
  plugins: [
    openAI({
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
});

// Exemplo de fluxo que poderás adaptar
export const simpleFlow = ai.defineFlow(
  {
    name: 'simpleFlow',
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.object({ response: z.string() }),
  },
  async ({ text }) => {
    const result = await ai.generate({
      model: 'gpt-4o',
      prompt: `Responda ao seguinte texto: ${text}`,
    });

    return { response: result.text };
  }
);