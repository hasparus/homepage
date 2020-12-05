import * as fs from "fs";
import { copyFile } from "fs-extra";
import { GatsbyNode } from "gatsby";
import * as path from "path";

import { parseOptions } from "./parseOptions";

export const onPreBootstrap: GatsbyNode["onPreBootstrap"] = async (
  { store },
  themeOptions
) => {
  const { program } = store.getState();
  parseOptions(themeOptions);
  const { contentPath } = parseOptions(themeOptions);

  const dir = path.isAbsolute(contentPath)
    ? contentPath
    : path.join(program.directory, contentPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Found two different GraphQL fragments with identical name "GatsbyGardenReferencesOnMdx". Fragment names must be unique
  // await copyFile(
  //   path.join(__dirname, "./fragments/garden-fragments.js"),
  //   `${program.directory}/.cache/fragments/garden-fragments.js`
  // );

  // await copyFile(
  //   path.join(__dirname, "./fragments/file-graph.fragment"),
  //   path.join(__dirname, "./src/use-graph-data.js")
  // );
};
