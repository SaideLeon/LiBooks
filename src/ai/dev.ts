if (process.env.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');
  config();
}

import '@/ai/flows/dynamic-background-image.ts';