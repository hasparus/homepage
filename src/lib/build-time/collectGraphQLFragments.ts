// @ts-expect-error no defs
import GatsbyParser from "gatsby/dist/query/file-parser";
import glob from "glob";
import path from "path";

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
    .filter((item: any) => item.doc && item.doc.kind === "Document")
    .flatMap((file: any) => {
      type Definition = {
        kind: string;
        name: { value: string };
        loc: {
          start: number;
          end: number;
          source: {
            body: string;
          };
        };
      };

      const fragments: Definition[] =
        file.doc.definitions.filter(
          (def: Definition) => def.kind === "FragmentDefinition"
        ) || [];

      return fragments
        .filter((fragment) =>
          fragmentsNamesToExtract.includes(fragment.name.value)
        )
        .map(({ loc: { start, end, source: { body } } }) =>
          body.slice(start, end)
        );
    })
    .join("\n");
};
