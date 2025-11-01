/// <reference types="vite/client" />

// Optional: declare specific VITE_ env vars for better typing
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Support JS-only modules without type definitions
declare module 'react-masonry-css';
