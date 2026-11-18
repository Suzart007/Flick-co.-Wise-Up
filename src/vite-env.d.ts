/// <reference types="vite/client" />

interface ImportMetaEnv {
  // URL base da API Java (sem barra no final). Definida no .env ou na Vercel.
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
