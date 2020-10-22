import { CreateSchemaCustomizationArgs, PluginOptions } from "gatsby";
import * as path from "path";
import slash from "slash";

import * as g from "../../../__generated__/global";
import packageJson from "../../../package.json";
import { buildTime, isMdx } from "../../lib/build-time/gatsby-node-utils";
import { assert } from "../../lib/util";

const REPO_URL = packageJson.repository.url;
const PROJECT_ROOT = slash(
  path.dirname(require.resolve("../../../package.json"))
);

export const createSchemaCustomization = async (
  {
    actions: { createTypes, createFieldExtension },
    store,
  }: CreateSchemaCustomizationArgs,
  _: PluginOptions
) => {
  createTypes(/*graphql*/ `
    type Mdx implements Node {
      socialLinks: SocialLinks! @socialLinks
    }
  `);

  const { siteUrl } = store.getState().config
    .siteMetadata as g.SiteSiteMetadata;

  createFieldExtension(
    {
      name: "socialLinks",
      extend(_options: unknown, _prevFieldConfig: unknown) {
        return {
          resolve(source: buildTime.Mdx | buildTime.SitePage) {
            const [filePath, route] = isMdx(source)
              ? [source.fileAbsolutePath, source.fields!.route]
              : [source.componentPath, source.path];

            assert(
              filePath && route,
              `filePath (${filePath}) and route (${route}) must be defined`
            );

            const relativePath = filePath.replace(PROJECT_ROOT, "");
            const url = encodeURIComponent(
              slash(path.join(siteUrl!, route))
            );

            return {
              edit: `${REPO_URL}/edit/master/${relativePath}`,
              tweet: `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(
                `.@hasparus`
              )}`,
              discuss: `https://mobile.twitter.com/search?q=${url}`,
            };
          },
        };
      },
    },
    { name: "???" }
  );
};
