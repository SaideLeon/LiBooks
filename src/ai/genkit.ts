import { initGenkit } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/google-genai";

// Inicializa o Genkit com o provedor do Google AI (Gemini)
export const ai = initGenkit({
  plugins: [googleAI()],
  model: "googleai/gemini-1.5-flash", // ou outro modelo que estiver a usar
});
