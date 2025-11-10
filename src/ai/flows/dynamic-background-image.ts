'use server';

/**
 * @fileOverview Generates a dynamic background image based on the current time of day.
 *
 * - generateBackgroundImage - A function that generates a background image.
 * - GenerateBackgroundImageOutput - The return type for the generateBackgroundImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBackgroundImageOutputSchema = z.object({
  backgroundImage: z
    .string()
    .describe(
      'A background image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type GenerateBackgroundImageOutput = z.infer<typeof GenerateBackgroundImageOutputSchema>;

export async function generateBackgroundImage(): Promise<GenerateBackgroundImageOutput> {
  return generateBackgroundImageFlow();
}

const prompt = ai.definePrompt({
  name: 'generateBackgroundImagePrompt',
  output: {schema: GenerateBackgroundImageOutputSchema},
  prompt: `Generate a background image that matches the current time of day.

Since it is currently {{currentTime}}, generate an image appropriate for that time of day.

The image should be a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.
`,
});

const generateBackgroundImageFlow = ai.defineFlow(
  {
    name: 'generateBackgroundImageFlow',
    outputSchema: GenerateBackgroundImageOutputSchema,
  },
  async () => {
    const currentTime = new Date().toLocaleTimeString();
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `It is ${currentTime}. Generate a background image appropriate for that time of day.`,
    });

    if (!media) {
      throw new Error('no media returned');
    }

    return {backgroundImage: media.url!};
  }
);
