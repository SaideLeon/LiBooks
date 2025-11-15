import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";

// Inicializa o Genkit com o provedor Google Gemini
export const ai = genkit({
  plugins: [googleAI()],
});

// Exemplo de fluxo que poderás adaptar
export const simpleFlow = ai.defineFlow(
  {
    name: "simpleFlow",
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.object({ response: z.string() }),
  },
  async ({ text }) => {
    const result = await ai.generate({
      model: googleAI.model("gemini-pro"),
      prompt: `Responda ao seguinte texto: ${text}`,
    });

    return { response: result.text };
  }
);