import type { JSX } from "solid-js";

export function BoxedText(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      class={`bg-gray-100 dark:bg-gray-800/60 rounded py-2 px-3 text-sm
        relative after:content-['✍️'] after:absolute after:top-2 after:right-3
        after:text-base`}
      {...props}
    />
  );
}
