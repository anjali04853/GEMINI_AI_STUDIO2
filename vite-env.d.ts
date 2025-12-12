/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIVEKIT_URL?: string;
  readonly VITE_LIVEKIT_API_URL?: string;
  readonly VITE_USE_LIVEKIT_SANDBOX?: string;
  readonly VITE_LIVEKIT_SANDBOX_ID?: string;
  readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

