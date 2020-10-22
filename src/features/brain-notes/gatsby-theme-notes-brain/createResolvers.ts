import { CreateResolversArgs } from "gatsby";

import { NotesBrainThemeOptions } from "./parseOptions";

export const createResolvers = (
  args: CreateResolversArgs,
  _options: NotesBrainThemeOptions.Parsed
) => {
  args.createResolvers({
    MdxFrontmatter: {
      isHidden: {
        type: `Boolean`,
        resolve(source: any, _args: any, _context: any, _info: any) {
          if (source.isHidden == null) {
            return false;
          }
          return source.isHidden;
        },
      },
    },
  });
};
