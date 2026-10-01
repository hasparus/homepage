import { spawn } from "node:child_process";

const argument = process.argv[2];
if (!argument)
  throw new Error(
    "Usage: pnpm verify:agents https://your-deployment.vercel.app",
  );
const target = new URL(argument);
if (!["http:", "https:"].includes(target.protocol))
  throw new Error("The test target must be an HTTP or HTTPS URL.");
const tests = spawn(
  "pnpm",
  [
    "exec",
    "playwright",
    "test",
    "e2e/agent-protocols.spec.ts",
    "--reporter=line",
  ],
  {
    stdio: "inherit",
    env: { ...process.env, PLAYWRIGHT_BASE_URL: target.origin },
  },
);
tests.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});
tests.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
