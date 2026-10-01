import type { APIRoute } from "astro";
import { openapi } from "../lib/agents/openapi";

export const GET: APIRoute = () => Response.json(openapi);
