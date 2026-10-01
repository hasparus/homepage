import { defineConfig } from "@playwright/test";

const hostedTarget = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  ...(hostedTarget
    ? { testMatch: "**/agent-protocols.spec.ts" }
    : {
        testIgnore: "**/agent-protocols.spec.ts",
        webServer: {
          command: "pnpm preview",
          url: "http://localhost:4321",
          reuseExistingServer: !process.env.CI,
        },
      }),
  testDir: "./e2e",
  snapshotPathTemplate:
    "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: "html",
  outputDir: hostedTarget ? "test-results/hosted" : "test-results/local",
  use: {
    baseURL: hostedTarget || "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: hostedTarget
    ? [{ name: "protocol" }]
    : [
        {
          name: "desktop",
          use: { viewport: { width: 1280, height: 720 } },
        },
        {
          name: "mobile",
          use: { viewport: { width: 375, height: 667 } },
        },
      ],
});
