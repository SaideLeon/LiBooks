if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import '@/ai/flows/dynamic-background-image.ts';
import '@/ai/flows/annotation-generator.ts';