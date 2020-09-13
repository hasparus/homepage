import { Node as GatsbyNodeNode } from "gatsby";

import * as generated from "../../../../__generated__/global";

type OverwrittenFields = 'parent' | 'children' | 'internal' | 'id';
export interface File extends Omit<generated.File, OverwrittenFields>, GatsbyNodeNode { }
export interface Mdx extends Omit<generated.Mdx, OverwrittenFields>, GatsbyNodeNode { }
export interface Node extends Omit<generated.Node, OverwrittenFields>, GatsbyNodeNode { }
export type MdxFile = File & Mdx;
