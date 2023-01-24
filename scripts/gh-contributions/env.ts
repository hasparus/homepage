import nextEnv from "@next/env";

export const __dirname = new URL(".", import.meta.url).pathname;

nextEnv.loadEnvConfig(`${__dirname}../..`);

export const VERBOSE = (process.env.DEBUG || "").includes("contributions");
