import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_LIVEKIT_URL': JSON.stringify(env.VITE_LIVEKIT_URL || 'wss://tinycase-7gtrfdpg.livekit.cloud'),
        'import.meta.env.VITE_LIVEKIT_API_URL': JSON.stringify(env.VITE_LIVEKIT_API_URL || 'http://localhost:3000/api/livekit'),
        'import.meta.env.VITE_USE_LIVEKIT_SANDBOX': JSON.stringify(env.VITE_USE_LIVEKIT_SANDBOX || 'false'),
        'import.meta.env.VITE_LIVEKIT_SANDBOX_ID': JSON.stringify(env.VITE_LIVEKIT_SANDBOX_ID || 'tnycase-hackathon-mwlvrf'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
