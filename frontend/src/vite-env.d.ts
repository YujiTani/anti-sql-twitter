/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly API_URL: string;
  // ...ここに追加していく
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
