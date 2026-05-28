export interface GenerationOptions {
  framework: 'html-tailwind' | 'react-tailwind' | 'vanilla' | 'vue-tailwind' | 'svelte-tailwind' | 'nextjs-tailwind';
  style: 'modern' | 'dark' | 'playful' | 'minimalist' | 'cyberpunk';
  customInstructions: string;
  targetLanguage: string;
  threeJsEnabled: boolean;
  developerOptions: {
    temperature: number;
    cssVarSetup: 'tailwind' | 'bootstrap' | 'custom-css';
    engineMode: 'interactive' | 'commented' | 'lean';
    customHeaders: string;
  };
}

export interface GenerationResult {
  id: string;
  code: string;
  frameworkCode: string;
  explanation: string;
  timestamp: string;
  options: GenerationOptions;
  imageUrl?: string;
}

export interface RefinementMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
