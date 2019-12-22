import React, { createContext, memo, ReactNode, useContext } from "react";
import { GatsbyPageProps } from "../common";

interface PageCtxValue {
  location: import("@reach/router").WindowLocation;
}

const Context = createContext<PageCtxValue>({
  get location() {
    throw new Error("trying to consume pageContext outside of the Provider");
  },
} as any);

const { Provider, Consumer } = Context;

const MemoizedProvider = memo(
  ({ location, children }: PageCtxValue & { children: ReactNode }) => (
    <Provider value={{ location }}>{children}</Provider>
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
    return (
      <MemoizedProvider location={props.location}>{element}</MemoizedProvider>
    );
  },
};
