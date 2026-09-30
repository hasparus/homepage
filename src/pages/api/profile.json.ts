import type { APIRoute } from "astro";
import { profile } from "../../lib/agents/content";

export const GET: APIRoute = () => Response.json(profile);
