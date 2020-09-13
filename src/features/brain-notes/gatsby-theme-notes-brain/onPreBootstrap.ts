import * as fs from "fs";
import { copyFile } from 'fs-extra';
import { GatsbyNode } from "gatsby";
import * as path from "path";

import { parseOptions } from "./parseOptions";


export const onPreBootstrap: GatsbyNode["onPreBootstrap"] = async (
  { store },
  themeOptions
) => {
  console.log('onPreBootstrap!!!!')

  const { program } = store.getState();
  const { noteTemplatePath, contentPath } = parseOptions(themeOptions)

  if (!noteTemplatePath) {
    throw new Error('[notes-digital-garden-theme] noteTemplatePath is missing');
  }

  if (contentPath) {
    const dir = path.isAbsolute(contentPath)
      ? contentPath
      : path.join(program.directory, contentPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  else {
    throw new Error('[notes-digital-garden-theme] contentPath is missing');
  }

  await copyFile(
    path.join(__dirname, "./fragments/garden-fragments.js"),
    `${program.directory}/.cache/fragments/garden-fragments.js`
  );
  // TODO
  // await copyFile(
  //   path.join(__dirname, "./fragments/file-graph.fragment"),
  //   path.join(__dirname, "./src/use-graph-data.js")
  // );
};
