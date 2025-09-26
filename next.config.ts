export default {
  reactStrictMode: true,
  // Since you're using this alongside Astro, configure Next.js to only handle API routes
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
  // Configure for Vercel deployment
  output: "standalone",
};
