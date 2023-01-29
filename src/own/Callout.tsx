import { JSX, splitProps } from "solid-js";

export interface CalloutProps extends JSX.HTMLAttributes<HTMLDivElement> {
  icon?: string;
}

export function Callout(props: CalloutProps) {
  const [own, rest] = splitProps(props, ["icon"]);

  return (
    <div
      style={{
        "--icon": `'${own.icon}'`,
      }}
      classList={{
        "bg-gray-100 dark:bg-gray-800/60 rounded py-2 px-3 text-sm relative":
          true,
        [`relative after:content-[var(--icon)] after:absolute after:top-2 after:right-3 after:text-base`]:
          !!own.icon,
      }}
      {...rest}
    />
  );
}
