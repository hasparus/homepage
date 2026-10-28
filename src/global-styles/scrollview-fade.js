// ponytail: @hasparus/tailwind exports only `require`, which Vite can't resolve; drop once it exports `default`.
import { createRequire } from "node:module";

export default createRequire(import.meta.url)(
  "@hasparus/tailwind/scrollview-fade",
).default;
