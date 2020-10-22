import {
  CreateSchemaCustomizationArgs,
  SetFieldsOnGraphQLNodeTypeArgs,
  Node,
  CreateResolversArgs,
} from "gatsby";

// @ts-ignore
import genMDX from "gatsby-plugin-mdx/utils/gen-mdx";

import { MarkdownReferencesPluginOptions, parseOptions } from "./options";
import { generateData } from "./computeInbounds";
import { getCachedNode, getInboundReferences } from "./cache";
import { nonNullable } from "./nonNullable";
import { findReferenceLinkParagraph } from "./findReferenceLinkParagraph";
import { buildTime } from "../../../../lib/build-time/gatsby-node-utils";

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
        resolve: async (node: Node) => {
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
            const inboundReferences = await Promise.all(
              (data[node.id] || [])
                .map((nodeId) => getNode(nodeId))
                .filter(nonNullable)
                .map(async (node) => {
                  debugger;

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

            return inboundReferences;
          }

          return [];
        },
      },
    },
  });
};
