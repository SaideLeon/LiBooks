require('dotenv').config();
import openAI from '@genkit-ai/compat-oai';
import
 { genkit, z } from 'genkit';

// Inicializa o Genkit com o provedor OpenAI
export const ai = genkit({
  plugins: [
    openAI({name: 'groq',
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
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
      model: "openai/gpt-oss-20b",
      prompt: `Responda ao seguinte texto: ${text}`,
    });

    return { response: result.text };
  }
);