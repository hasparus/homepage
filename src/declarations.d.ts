declare module "gatsby-plugin-mdx";
declare module "gatsby-source-filesystem/create-file-node";
declare module "@mdx-js/react";

// For Theme UI alpha.
declare module "@theme-ui/mdx";
declare module "@theme-ui/color-modes" {
  export function useColorMode<T>(): [T, (val: T | ((_: T) => T)) => void];
  export const InitializeColorMode: () => JSX.Element;
}
