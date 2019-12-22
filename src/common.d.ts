export interface GatsbyPageProps {
  location: import("@reach/router").WindowLocation;
  navigate: import("@reach/router").NavigateFn;
  pageContext: unknown;
  pageResources: unknown;
  path: string;
  pathContext: unknown;
  url: string;
}
