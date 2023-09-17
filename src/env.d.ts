/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference path="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * - `https://localhost:3000/` in development
   * - `https://${branch-name}--hasparus.vercel.app/` in preview
   * - `https://hasparus.vercel.app/` in production
   *
   * @see import.meta.env.SITE for the canonical URL
   */
  readonly PUBLIC_URL: string;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

interface Window {
  // Vercel Analytics
  va?: unknown;
  vaq?: unknown[];
}
