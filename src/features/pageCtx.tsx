import React, { createContext, memo, ReactNode, useContext } from "react";

export interface GatsbyPageProps {
  location: import("@reach/router").WindowLocation;
  navigate: import("@reach/router").NavigateFn;
  pageContext: unknown;
  pageResources: unknown;
  path: string;
  pageContext: unknown;
  url: string;
}

interface PageCtxValue
  extends Pick<GatsbyPageProps, "location" | "pageContext"> {}

const Context = createContext<PageCtxValue>({
  get location() {
    throw new Error(
      "trying to consume pageContext outside of the Provider"
    );
  },
} as any);

const { Provider, Consumer } = Context;

const MemoizedProvider = memo(
  ({ value, children }: { children: ReactNode; value: PageCtxValue }) => (
    <Provider value={value}>{children}</Provider>
  )
);

export const pageCtx = {
  Consumer,
  useContext() {
    return useContext(Context);
  },
  wrapPageElement({
    element,
    props,
  }: {
    element: ReactNode;
    props: GatsbyPageProps;
  }) {
    return <MemoizedProvider value={props}>{element}</MemoizedProvider>;
  },
};
