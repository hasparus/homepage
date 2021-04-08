import React from "react";
import { Themed as Th } from "theme-ui";

export function Annotation({
  children,
  type,
}: {
  children: React.ReactNode;
  type: string;
}) {
  return (
    <Th.code>
      {children}
      <sup>&nbsp;{type}</sup>
    </Th.code>
  );
}
