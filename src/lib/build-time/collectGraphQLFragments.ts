import path from "path";

import GatsbyParser from "gatsby/dist/query/file-parser";
import glob from "glob";
import type { FragmentDefinitionNode } from "graphql";

import { assert } from "../util";

/**
 * Collect all graphql fragments from a directory
 * @see https://github.com/gatsbyjs/gatsby/issues/12155#issuecomment-618424527
 */
export const collectGraphQLFragments = async (
  dirname: string,
  fragmentsNamesToExtract: string[]
): Promise<string> => {
  const parser = new GatsbyParser();
  const files = glob.sync(path.resolve(dirname, "**/*.js"));
  const result = await parser.parseFiles(files);

  return result
    .filter((item) => item.doc && item.doc.kind === "Document")
    .flatMap((file) => {
      const fragments =
        file.doc.definitions.filter(
          (def): def is FragmentDefinitionNode =>
            def.kind === "FragmentDefinition"
        ) || [];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fragments
        .filter((fragment) =>
          fragmentsNamesToExtract.includes(fragment.name.value)
        )
        .map(({ loc }) => {
          assert(
            loc !== undefined,
            "`fragment.loc` is undefined. Check your GraphQL files."
          );

          const {
            start,
            end,
            source: { body },
          } = loc;

          return body.slice(start, end);
        });
    })
    .join("\n");
};
