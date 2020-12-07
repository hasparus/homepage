import { Node as GatsbyNodeNode } from "gatsby";

import type * as g from "../../../graphql-types";

export declare namespace buildTime {
  type OverwrittenFields = "parent" | "children" | "internal" | "id";
  export interface File
    extends Omit<g.File, OverwrittenFields>,
      GatsbyNodeNode {}
  export interface Mdx
    extends Omit<g.Mdx, OverwrittenFields>,
      GatsbyNodeNode {}
  export interface Node
    extends Omit<g.Node, OverwrittenFields>,
      GatsbyNodeNode {}
  export interface SitePage
    extends Omit<g.SitePage, OverwrittenFields>,
      GatsbyNodeNode {}
}

export function isMdx(node: buildTime.Node): node is buildTime.Mdx {
  return node.internal.type === "Mdx";
}
