'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Schema for the input
const AnnotationGeneratorInputSchema = z.object({
  selectedVerse: z.string().describe('The verse selected by the user.'),
  previousVerses: z.array(z.string()).describe('The five verses preceding the selected one.'),
  bookTitle: z.string().describe('The title of the book.'),
  authorName: z.string().describe('The name of the author.'),
});
export type AnnotationGeneratorInput = z.infer<typeof AnnotationGeneratorInputSchema>;

// Schema for the output
const AnnotationGeneratorOutputSchema = z.object({
  annotation: z.string().describe('The AI-generated explanation of the verse.'),
});
export type AnnotationGeneratorOutput = z.infer<typeof AnnotationGeneratorOutputSchema>;

// Genkit flow to generate an annotation
const annotationGeneratorFlow = ai.defineFlow(
  {
    name: 'annotationGeneratorFlow',
    inputSchema: AnnotationGeneratorInputSchema,
    outputSchema: AnnotationGeneratorOutputSchema,
  },
  async ({ selectedVerse, previousVerses, bookTitle, authorName }) => {
    const context = previousVerses.join('\n');

    const prompt = `
        You are a theological assistant. Your task is to provide a clear and concise explanation for a selected verse from a book.
        Use the provided context to inform your explanation.

        Book Title: ${bookTitle}
        Author: ${authorName}

        Previous Verses (context):
        ---
        ${context}
        ---

        Verse to Explain:
        ---
        ${selectedVerse}
        ---

        Please provide your explanation for the selected verse as a JSON object with a single key "annotation". The explanation should be in the same language as the selected verse.
      `;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      response_format: { type: 'json_object' },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from Groq API');
    }

    let structuredOutput;
    try {
      structuredOutput = JSON.parse(responseContent);
    } catch (error) {
      console.error('Failed to parse JSON response from AI:', error);
      throw new Error('AI did not return valid JSON.');
    }

    const parsed = AnnotationGeneratorOutputSchema.safeParse(structuredOutput);

    if (!parsed.success) {
      console.error('AI output parsing error:', parsed.error);
      throw new Error('Failed to parse AI output into the expected schema.');
    }

    return parsed.data;
  }
);

/**
 * Invokes the annotation generation flow.
 * @param input The input data for the annotation generator.
 * @returns A promise that resolves to the annotation generation output.
 */
export async function generateAnnotation(input: AnnotationGeneratorInput): Promise<AnnotationGeneratorOutput> {
  return await annotationGeneratorFlow(input);
}
