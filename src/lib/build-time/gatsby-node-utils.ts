import { Node as GatsbyNodeNode } from "gatsby";

export declare namespace buildTime {
  type OverwrittenFields = "parent" | "children" | "internal" | "id";
  export interface File
    extends Omit<GatsbyTypes.File, OverwrittenFields>,
      GatsbyNodeNode {}
  export interface Mdx
    extends Omit<GatsbyTypes.Mdx, OverwrittenFields>,
      GatsbyNodeNode {}
  export interface Node
    extends Omit<GatsbyTypes.Node, OverwrittenFields>,
      GatsbyNodeNode {}
  export interface SitePage
    extends Omit<GatsbyTypes.SitePage, OverwrittenFields>,
      GatsbyNodeNode {}
}

export function isMdx(node: buildTime.Node): node is buildTime.Mdx {
  return node.internal.type === "Mdx";
}
