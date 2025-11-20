'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schema for the output: an array of strings (verses).
const VerseSplittingOutputSchema = z.object({
  verses: z.array(z.string()).describe('An array of strings, where each string is a verse.'),
});
export type VerseSplittingOutput = z.infer<typeof VerseSplittingOutputSchema>;

// Schema for the input: a single block of text.
const VerseSplittingInputSchema = z.object({
  text: z.string().describe('The block of text to be split into verses.'),
});

// Genkit flow to split text into verses.
const verseSplitterFlow = ai.defineFlow(
  {
    name: 'verseSplitterFlow',
    inputSchema: VerseSplittingInputSchema,
    outputSchema: VerseSplittingOutputSchema,
  },
  async ({ text }) => {
    const llmResponse = await ai.generate({
      model: "openai/gpt-oss-20b",
      prompt: `
        Analyze the following text and divide it into paragraphs or short sentences, each forming a complete thought.
        Avoid splitting sentences in the middle. Each element in the output array should be a full sentence or a self-contained idea.
        The goal is to format the text for readability, like verses in a poem or scripture, but without breaking the grammatical structure.
        Do not add, remove, or change any words from the original text.

        Return the output as a single JSON object with a key "verses" that contains an array of the verse strings.

        Original text:
        ---
        ${text}
        ---
      `,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const structuredOutput = llmResponse.output();
    if (!structuredOutput) {
      throw new Error('No structured output from AI');
    }

    const parsed = VerseSplittingOutputSchema.safeParse(structuredOutput);

    if (!parsed.success) {
      console.error('AI output parsing error:', parsed.error);
      throw new Error('Failed to parse AI output into the expected schema.');
    }

    return parsed.data;
  }
);

/**
 * Invokes the verse splitting flow.
 * @param text The block of text to split.
 * @returns A promise that resolves to the verse splitting output.
 */
export async function splitTextIntoVerses(text: string): Promise<VerseSplittingOutput> {
  return await verseSplitterFlow({ text });
}
