import * as fs from "fs";
import * as path from "path";

import { copyFile } from "fs-extra";
import { GatsbyNode } from "gatsby";

import { parseOptions } from "./parseOptions";

export const onPreBootstrap: GatsbyNode["onPreBootstrap"] = async (
  { store },
  themeOptions
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const { program } = store.getState() as {
    program: { directory: string };
  };
  parseOptions(themeOptions);
  const { contentPath } = parseOptions(themeOptions);

  const dir = path.isAbsolute(contentPath)
    ? contentPath
    : path.join(program.directory, contentPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
