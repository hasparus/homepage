import {
  CreateResolversArgs,
  CreateSchemaCustomizationArgs,
  Node,
} from "gatsby";
// @ts-ignore types missing
import genMDX from "gatsby-plugin-mdx/utils/gen-mdx";

import { buildTime } from "../../../../lib/build-time/gatsby-node-utils";
import { nonNullable } from "../../../../lib/util/nonNullable";

import { getCachedNode, getInboundReferences } from "./cache";
import { generateData } from "./computeInbounds";
import { findReferenceLinkParagraph } from "./findReferenceLinkParagraph";
import { MarkdownReferencesPluginOptions, parseOptions } from "./options";

export const createSchemaCustomization = (
  { actions }: CreateSchemaCustomizationArgs,
  _options?: MarkdownReferencesPluginOptions.Input
) => {
  const options = parseOptions(_options);
  actions.createTypes(`
    union ReferenceTarget = ${options.types.join(" | ")}

    type InboundReference {
      node: ReferenceTarget!
      paragraph: String!
    }

    type Mdx {
      outboundReferences: [ReferenceTarget!]!
      inboundReferences: [InboundReference!]!
    }
  `);
};

export const createResolvers = (
  args: CreateResolversArgs,
  opts: MarkdownReferencesPluginOptions.Input
) => {
  const { contentPath, pluginMdxOptions } = parseOptions(opts);

  const processMDX = (node: any) =>
    genMDX({
      ...args,
      node,
      options: pluginMdxOptions,
    });

  const { cache, getNode } = args;

  args.createResolvers({
    Mdx: {
      outboundReferences: {
        type: `[ReferenceTarget!]!`,
        async resolve(node: Node, _: any, ctx: any) {
          let cachedNode = await getCachedNode(cache, node.id, getNode);

          if (!cachedNode || !cachedNode.resolvedOutboundReferences) {
            await generateData(cache, getNode);
            cachedNode = await getCachedNode(cache, node.id, getNode);
          }

          if (cachedNode && cachedNode.resolvedOutboundReferences) {
            return cachedNode.resolvedOutboundReferences
              .map((nodeId) => getNode(nodeId))
              .filter(nonNullable);
          }

          return [];
        },
      },
      inboundReferences: {
        type: `[InboundReference!]!`,
        async resolve(node: Node) {
          let data = await getInboundReferences(cache);

          if (!data) {
            await generateData(cache, getNode);
            data = await getInboundReferences(cache);
          }

          const mdx = node as buildTime.Mdx;
          const ownRoute = mdx.fields!.route.replace(`/${contentPath}`, "");

          if (data) {
            return Promise.all(
              (data[node.id] || [])
                .map((nodeId) => getNode(nodeId))
                .filter(nonNullable)
                .map(async (node) => {
                  const paragraph = await findReferenceLinkParagraph(
                    node,
                    { linkedRoute: ownRoute },
                    { processMDX }
                  );

                  return {
                    node,
                    paragraph,
                  };
                })
            );
          }

          return [];
        },
      },
    },
  });
};
