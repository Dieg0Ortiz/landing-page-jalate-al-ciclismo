/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_BACKEND_URL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  // Agrega más variables según necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}