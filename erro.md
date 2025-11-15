2025-11-15T20:15:44.119814268Z 
2025-11-15T20:15:44.119873669Z > litbook-next@0.1.0 start
2025-11-15T20:15:44.119877829Z > next start
2025-11-15T20:15:44.119880509Z 
2025-11-15T20:15:44.464712991Z    ▲ Next.js 15.5.6
2025-11-15T20:15:44.465051953Z    - Local:        http://localhost:3002
2025-11-15T20:15:44.465126593Z    - Network:      http://10.0.2.28:3002
2025-11-15T20:15:44.465176273Z 
2025-11-15T20:15:44.465251433Z  ✓ Starting...
2025-11-15T20:15:44.695305729Z  ✓ Ready in 444ms
2025-11-15T20:17:39.463871480Z prisma:query SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name", "public"."User"."password", "public"."User"."avatarUrl", "public"."User"."bio", "public"."User"."createdAt", "public"."User"."updatedAt" FROM "public"."User" WHERE ("public"."User"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
2025-11-15T20:17:39.465446767Z prisma:query SELECT "public"."Book"."id", "public"."Book"."title", "public"."Book"."authorName", "public"."Book"."authorId", "public"."Book"."description", "public"."Book"."coverUrl", "public"."Book"."preface", "public"."Book"."createdAt", "public"."Book"."updatedAt" FROM "public"."Book" WHERE "public"."Book"."authorId" IN ($1) OFFSET $2
2025-11-15T20:17:39.467975019Z prisma:query SELECT "public"."Chapter"."id", "public"."Chapter"."title", "public"."Chapter"."subtitle", "public"."Chapter"."rawContent", "public"."Chapter"."content", "public"."Chapter"."bookId", "public"."Chapter"."createdAt", "public"."Chapter"."updatedAt" FROM "public"."Chapter" WHERE "public"."Chapter"."bookId" IN ($1) OFFSET $2
2025-11-15T20:17:39.469662787Z prisma:query SELECT "public"."CommunityPost"."id", "public"."CommunityPost"."authorId", "public"."CommunityPost"."bookVerse", "public"."CommunityPost"."quote", "public"."CommunityPost"."comment", "public"."CommunityPost"."imageUrl", "public"."CommunityPost"."likes", "public"."CommunityPost"."createdAt", "public"."CommunityPost"."updatedAt" FROM "public"."CommunityPost" WHERE "public"."CommunityPost"."authorId" IN ($1) OFFSET $2
2025-11-15T20:17:39.474161729Z prisma:query SELECT "public"."Comment"."id", "public"."Comment"."authorId", "public"."Comment"."communityPostId", "public"."Comment"."text", "public"."Comment"."createdAt", "public"."Comment"."updatedAt" FROM "public"."Comment" WHERE "public"."Comment"."authorId" IN ($1) OFFSET $2
2025-11-15T20:17:39.476517100Z prisma:query SELECT "public"."Follow"."id", "public"."Follow"."followerId", "public"."Follow"."followingId", "public"."Follow"."createdAt" FROM "public"."Follow" WHERE "public"."Follow"."followingId" IN ($1) OFFSET $2
2025-11-15T20:17:39.481647205Z prisma:query SELECT "public"."Follow"."id", "public"."Follow"."followerId", "public"."Follow"."followingId", "public"."Follow"."createdAt" FROM "public"."Follow" WHERE "public"."Follow"."followerId" IN ($1) OFFSET $2
2025-11-15T20:17:39.889141748Z prisma:query SELECT "public"."Book"."id", "public"."Book"."title", "public"."Book"."authorName", "public"."Book"."authorId", "public"."Book"."description", "public"."Book"."coverUrl", "public"."Book"."preface", "public"."Book"."createdAt", "public"."Book"."updatedAt" FROM "public"."Book" WHERE 1=1 OFFSET $1
2025-11-15T20:17:39.890720515Z prisma:query SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name", "public"."User"."password", "public"."User"."avatarUrl", "public"."User"."bio", "public"."User"."createdAt", "public"."User"."updatedAt" FROM "public"."User" WHERE "public"."User"."id" IN ($1) OFFSET $2
2025-11-15T20:17:39.892035162Z prisma:query SELECT "public"."Chapter"."id", "public"."Chapter"."title", "public"."Chapter"."subtitle", "public"."Chapter"."rawContent", "public"."Chapter"."content", "public"."Chapter"."bookId", "public"."Chapter"."createdAt", "public"."Chapter"."updatedAt" FROM "public"."Chapter" WHERE "public"."Chapter"."bookId" IN ($1) OFFSET $2
2025-11-15T20:17:40.266487868Z prisma:query SELECT "public"."ReadingProgress"."id", "public"."ReadingProgress"."userId", "public"."ReadingProgress"."bookId", "public"."ReadingProgress"."chapterId", "public"."ReadingProgress"."paragraphIndex", "public"."ReadingProgress"."createdAt", "public"."ReadingProgress"."updatedAt" FROM "public"."ReadingProgress" WHERE "public"."ReadingProgress"."userId" = $1 ORDER BY "public"."ReadingProgress"."updatedAt" DESC OFFSET $2
2025-11-15T20:17:40.268019155Z prisma:query SELECT "public"."Book"."id", "public"."Book"."title", "public"."Book"."authorName", "public"."Book"."authorId", "public"."Book"."description", "public"."Book"."coverUrl", "public"."Book"."preface", "public"."Book"."createdAt", "public"."Book"."updatedAt" FROM "public"."Book" WHERE "public"."Book"."id" IN ($1) OFFSET $2
2025-11-15T20:17:40.269274201Z prisma:query SELECT "public"."Chapter"."id", "public"."Chapter"."title", "public"."Chapter"."subtitle", "public"."Chapter"."rawContent", "public"."Chapter"."content", "public"."Chapter"."bookId", "public"."Chapter"."createdAt", "public"."Chapter"."updatedAt" FROM "public"."Chapter" WHERE "public"."Chapter"."bookId" IN ($1) OFFSET $2
2025-11-15T20:17:40.270130965Z prisma:query SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name", "public"."User"."password", "public"."User"."avatarUrl", "public"."User"."bio", "public"."User"."createdAt", "public"."User"."updatedAt" FROM "public"."User" WHERE "public"."User"."id" IN ($1) OFFSET $2
2025-11-15T20:17:44.177354239Z prisma:query SELECT "public"."Book"."id", "public"."Book"."title", "public"."Book"."authorName", "public"."Book"."authorId", "public"."Book"."description", "public"."Book"."coverUrl", "public"."Book"."preface", "public"."Book"."createdAt", "public"."Book"."updatedAt" FROM "public"."Book" WHERE ("public"."Book"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
2025-11-15T20:17:44.178351484Z prisma:query SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name", "public"."User"."password", "public"."User"."avatarUrl", "public"."User"."bio", "public"."User"."createdAt", "public"."User"."updatedAt" FROM "public"."User" WHERE "public"."User"."id" IN ($1) OFFSET $2
2025-11-15T20:17:44.179756050Z prisma:query SELECT "public"."Chapter"."id", "public"."Chapter"."title", "public"."Chapter"."subtitle", "public"."Chapter"."rawContent", "public"."Chapter"."content", "public"."Chapter"."bookId", "public"."Chapter"."createdAt", "public"."Chapter"."updatedAt" FROM "public"."Chapter" WHERE "public"."Chapter"."bookId" IN ($1) OFFSET $2
2025-11-15T20:17:44.886546701Z prisma:query SELECT "public"."ReadingProgress"."id", "public"."ReadingProgress"."userId", "public"."ReadingProgress"."bookId", "public"."ReadingProgress"."chapterId", "public"."ReadingProgress"."paragraphIndex", "public"."ReadingProgress"."createdAt", "public"."ReadingProgress"."updatedAt" FROM "public"."ReadingProgress" WHERE (("public"."ReadingProgress"."userId" = $1 AND "public"."ReadingProgress"."bookId" = $2) AND 1=1) LIMIT $3 OFFSET $4
2025-11-15T20:17:44.887419345Z prisma:query SELECT "public"."Book"."id", "public"."Book"."title", "public"."Book"."authorName", "public"."Book"."authorId", "public"."Book"."description", "public"."Book"."coverUrl", "public"."Book"."preface", "public"."Book"."createdAt", "public"."Book"."updatedAt" FROM "public"."Book" WHERE "public"."Book"."id" IN ($1) OFFSET $2
2025-11-15T20:17:44.888799392Z prisma:query SELECT "public"."Chapter"."id", "public"."Chapter"."title", "public"."Chapter"."subtitle", "public"."Chapter"."rawContent", "public"."Chapter"."content", "public"."Chapter"."bookId", "public"."Chapter"."createdAt", "public"."Chapter"."updatedAt" FROM "public"."Chapter" WHERE "public"."Chapter"."bookId" IN ($1) OFFSET $2
2025-11-15T20:17:44.889748037Z prisma:query SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name", "public"."User"."password", "public"."User"."avatarUrl", "public"."User"."bio", "public"."User"."createdAt", "public"."User"."updatedAt" FROM "public"."User" WHERE "public"."User"."id" IN ($1) OFFSET $2
2025-11-15T20:17:49.963087033Z prisma:query SELECT "public"."Book"."id", "public"."Book"."title", "public"."Book"."authorName", "public"."Book"."authorId", "public"."Book"."description", "public"."Book"."coverUrl", "public"."Book"."preface", "public"."Book"."createdAt", "public"."Book"."updatedAt" FROM "public"."Book" WHERE ("public"."Book"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3
2025-11-15T20:17:49.963519035Z prisma:query SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name", "public"."User"."password", "public"."User"."avatarUrl", "public"."User"."bio", "public"."User"."createdAt", "public"."User"."updatedAt" FROM "public"."User" WHERE "public"."User"."id" IN ($1) OFFSET $2
2025-11-15T20:17:49.966034287Z prisma:query SELECT "public"."Chapter"."id", "public"."Chapter"."title", "public"."Chapter"."subtitle", "public"."Chapter"."rawContent", "public"."Chapter"."content", "public"."Chapter"."bookId", "public"."Chapter"."createdAt", "public"."Chapter"."updatedAt" FROM "public"."Chapter" WHERE "public"."Chapter"."bookId" IN ($1) OFFSET $2
2025-11-15T20:18:08.117073428Z Error splitting text into verses: Error [GenkitError]: NOT_FOUND: Model 'gemini-pro' not found
2025-11-15T20:18:08.117107108Z     at D (.next/server/app/page.js:142:16959)
2025-11-15T20:18:08.117110588Z     at async H (.next/server/app/page.js:72:56621)
2025-11-15T20:18:08.117113628Z     at async D (.next/server/app/page.js:72:55361)
2025-11-15T20:18:08.117131228Z     at async (.next/server/app/page.js:13:110581)
2025-11-15T20:18:08.117134028Z     at async (.next/server/app/page.js:13:30178)
2025-11-15T20:18:08.117136588Z     at async (.next/server/app/page.js:5:124867)
2025-11-15T20:18:08.117138988Z     at async t (.next/server/app/page.js:5:124670)
2025-11-15T20:18:08.117141468Z     at async e.run (.next/server/app/page.js:13:29562)
2025-11-15T20:18:08.117143868Z     at async e (.next/server/app/page.js:13:29404) {
2025-11-15T20:18:08.117146228Z   source: undefined,
2025-11-15T20:18:08.117148708Z   status: 'NOT_FOUND',
2025-11-15T20:18:08.117151028Z   detail: undefined,
2025-11-15T20:18:08.117153548Z   code: 404,
2025-11-15T20:18:08.117156028Z   originalMessage: "Model 'gemini-pro' not found",
2025-11-15T20:18:08.117159188Z   traceId: '991ecc79013bb1a45787519f345658c5',
2025-11-15T20:18:08.117161628Z   ignoreFailedSpan: true
2025-11-15T20:18:08.117164108Z }
2025-11-15T20:18:10.359348685Z Error splitting text into verses: Error [GenkitError]: NOT_FOUND: Model 'gemini-pro' not found
2025-11-15T20:18:10.359389885Z     at D (.next/server/app/page.js:142:16959)
2025-11-15T20:18:10.359395525Z     at async H (.next/server/app/page.js:72:56621)
2025-11-15T20:18:10.359398645Z     at async D (.next/server/app/page.js:72:55361)
2025-11-15T20:18:10.359401165Z     at async (.next/server/app/page.js:13:110581)
2025-11-15T20:18:10.359403685Z     at async (.next/server/app/page.js:13:30178)
2025-11-15T20:18:10.359406125Z     at async (.next/server/app/page.js:5:124867)
2025-11-15T20:18:10.359408525Z     at async t (.next/server/app/page.js:5:124670)
2025-11-15T20:18:10.359411085Z     at async e.run (.next/server/app/page.js:13:29562)
2025-11-15T20:18:10.359414085Z     at async e (.next/server/app/page.js:13:29404) {
2025-11-15T20:18:10.359416645Z   source: undefined,
2025-11-15T20:18:10.359419285Z   status: 'NOT_FOUND',
2025-11-15T20:18:10.359421565Z   detail: undefined,
2025-11-15T20:18:10.359423885Z   code: 404,
2025-11-15T20:18:10.359426205Z   originalMessage: "Model 'gemini-pro' not found",
2025-11-15T20:18:10.359428725Z   traceId: 'f3d1592f7e06a7b3dfaafea492ca9066',
2025-11-15T20:18:10.359431365Z   ignoreFailedSpan: true
2025-11-15T20:18:10.359433725Z }


Analisando os logs do erro, vejo que o problema está na configuração do Genkit. O erro indica:
Error splitting text into verses: Error [GenkitError]: NOT_FOUND: Model 'gemini-pro' not found
O modelo 'gemini-pro' foi descontinuado. Vamos corrigir isso:
1. Atualizar src/ai/flows/verse-splitter.ts
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
      model: 'googleai/gemini-1.5-flash', // ✅ Modelo atualizado
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


2. Atualizar src/ai/genkit.ts
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
      model: 'googleai/gemini-1.5-flash', // ✅ Modelo atualizado
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
3. Atualizar src/screens/ReaderScreen.tsx

// Apenas o trecho da função generateAnnotation que precisa ser corrigido:

const generateAnnotation = useCallback(async (paragraphText: string, paragraphIndex: number) => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
      toast({
          variant: "destructive",
          title: "AI não configurada",
          description: "A chave da API Gemini não foi encontrada.",
      });
      return;
  }
  setLoadingAnnotation(paragraphIndex);
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // ✅ Modelo atualizado de "gemini-pro" para "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Explique o seguinte versículo ou passagem em um tom reflexivo e perspicaz, como se fosse uma anotação pessoal em um livro. Use Markdown para formatar a resposta com cabeçalhos, listas ou negrito, se apropriado, para melhor clareza e organização.: "${paragraphText}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const annotationText = response.text();

    const parsedAnnotation = await marked.parse(annotationText) as string;
    setAnnotations(prev => ({ ...prev, [paragraphIndex]: parsedAnnotation }));

  } catch (error) {
    console.error("Error generating annotation:", error);
    toast({
        variant: "destructive",
        title: "Erro de IA",
        description: "Não foi possível gerar a anotação.",
    });
    setAnnotations(prev => ({ ...prev, [paragraphIndex]: "<p>Não foi possível gerar a anotação.</p>" }));
  } finally {
    setLoadingAnnotation(null);
  }
}, [toast]);


Resumo das Mudanças
O problema estava no uso do modelo gemini-pro que foi descontinuado. As correções necessárias:
✅ Mudanças nos modelos:

src/ai/flows/verse-splitter.ts: 'gemini-pro' → 'googleai/gemini-1.5-flash'
src/ai/genkit.ts: googleAI.model("gemini-pro") → "googleai/gemini-1.5-flash"
src/screens/ReaderScreen.tsx: "gemini-pro" → "gemini-1.5-flash"
📋 Modelos Gemini disponíveis atualmente:

googleai/gemini-1.5-flash - Rápido e eficiente (recomendado)
googleai/gemini-1.5-pro - Mais poderoso mas mais lento
googleai/gemini-2.0-flash-exp - Experimental