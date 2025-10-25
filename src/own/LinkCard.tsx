import type { JSX } from "solid-js";

import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";

export function LinkCard(props: JSX.IntrinsicElements["a"]) {
  return (
    <a
      href="https://matryoshka-code.vercel.app/"
      class="hover:translate--px group relative flex w-fit flex-col items-center gap-2 overflow-hidden rounded-sm border border-gray-200 bg-gray-50 pb-2 shadow-sm transition duration-75 ease-out hover:shadow-none dark:border-gray-700 dark:bg-gray-800"
      {...props}
    >
      <img
        width={280}
        class="dark:opacity-90"
        alt="matryoshkas"
        src="https://images-na.ssl-images-amazon.com/images/I/5186qD8N%2BpL._SX466_.jpg"
      />
      <span>https://matryoshka-code.now.sh</span>
      <ExternalLinkIcon class="absolute right-2 top-2 z-10 size-4 opacity-60" />
    </a>
  );
}
