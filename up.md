 
Esse guia    é a **documentação oficial de integração do Genkit com Next.js** — e ele explica **a forma correta e atualizada** de inicializar o Genkit, que é **diferente do que o teu projeto estava fazendo** (`initGenkit` foi removido).

👉 O erro no teu build:

```
Type error: Module '"@genkit-ai/core"' has no exported member 'initGenkit'.
```

acontece porque a função `initGenkit` **não existe mais** — ela foi substituída pelo método `genkit()` (da lib `genkit` simples, não `@genkit-ai/core`).

---

### ✅ **Como corrigir teu arquivo `src/ai/genkit.ts`**

Substitui **tudo** o que está dentro de `src/ai/genkit.ts` pelo código abaixo:

```ts
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
    const { response } = await ai.generate({
      model: googleAI.model("googleai/gemini-2.0-flash-exp"),
      prompt: `Responda ao seguinte texto: ${text}`,
    });

    return { response: response.text };
  }
);
```

---

### ⚙️ **E atualiza tuas dependências:**

Executa no terminal:

```bash
npm install genkit @genkit-ai/core @genkit-ai/google-genai @genkit-ai/next zod
```

> 💡 A lib `zod` é usada nos schemas (`z.object()`), então precisa estar instalada.

---

### 💬 **Resumindo:**

| Erro                        | Causa                       | Solução                                                    |
| --------------------------- | --------------------------- | ---------------------------------------------------------- |
| `initGenkit` não encontrado | API antiga                  | Usa `genkit()` no lugar                                    |
| Falha no build do Next.js   | Tipagem e import incorretos | Importa de `"genkit"`, não de `"@genkit-ai/core"`          |
| Prisma warning de OpenSSL   | Falta de lib no container   | `apk add openssl` já resolve (no Dockerfile que te enviei) |

--- 