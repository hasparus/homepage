import type { JSX } from "solid-js";

import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";

export interface LinkCardProps extends JSX.HTMLAttributes<HTMLAnchorElement> {}

export function LinkCard(props: LinkCardProps) {
  return (
    <a
      class="hover:translate--px group relative flex w-fit flex-col items-center gap-2 overflow-hidden rounded-sm border border-gray-200 bg-gray-50 pb-2 shadow-sm transition duration-75 ease-out hover:shadow-none dark:border-gray-700 dark:bg-gray-800"
      {...props}
    >
      {props.children}
      <ExternalLinkIcon class="absolute right-2 top-2 z-10 size-4 opacity-60" />
    </a>
  );
}
