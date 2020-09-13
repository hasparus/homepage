import { CreateResolversArgs } from "gatsby";


export const createResolvers = (args: CreateResolversArgs) => {
  args.createResolvers({
    MdxFrontmatter: {
      // TODO: Consider `isHidden`.
      private: {
        type: `Boolean`,
        resolve(source: any, _args: any, _context: any, _info: any) {
          // console.log({ source })
          if (source.private == null) {
            return false;
          }
          return source.private;
        },
      },
    },
  });
};
