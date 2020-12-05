import type { buildTime } from "../../../lib/build-time/gatsby-node-utils";

export type MdxFile = buildTime.File & buildTime.Mdx;
