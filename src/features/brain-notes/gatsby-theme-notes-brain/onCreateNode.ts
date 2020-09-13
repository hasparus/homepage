import { GatsbyNode } from "gatsby";
import { urlResolve } from 'gatsby-core-utils';
import * as path from 'path';

import { getNodeTitle } from "../../../lib/build-time/getTitle";
import { NotesBrainThemeOptions,parseOptions } from "./parseOptions";
import { File, MdxFile, Node } from './types';

function isFile(node: Node): node is File {
  return node.internal.type === 'File'
}

function shouldHandleFile(
  node: File,
  { extensions, mediaTypes, contentPath }: NotesBrainThemeOptions,
): node is MdxFile {
  return (
    (extensions.includes(node.ext!) ||
      mediaTypes.includes(node.internal.mediaType!)) &&
    node.sourceInstanceName === contentPath
  );
}


export const onCreateNode: GatsbyNode['onCreateNode'] = async ({
  node,
  actions,
  loadNodeContent,
}, options) => {
  const { createNodeField } = actions;
  const opts = parseOptions(options)

  console.log('[notes-brain!!] onCreateNode', node.id)

  if (isFile(node) && shouldHandleFile(node, opts)) {
    
    createNodeField({
      node,
      name: 'slug',
      value: urlResolve(
       opts.basePath,
        path.parse(node.relativePath).dir,
        node.name
      ),
    });
    createNodeField({
      node,
      name: 'title',
      // ???
      value: getNodeTitle(node as unknown as Mdx, await loadNodeContent(node)),
    });
  }
};
