import { createMemo, JSX, splitProps } from "solid-js";

export interface CalloutProps extends JSX.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  unwrapChildP?: boolean;
}

export function Callout(props: CalloutProps) {
  const [own, rest] = splitProps(props, ["icon", "unwrapChildP", "children"]);

  const children = createMemo(() => {
    if (own.unwrapChildP) {
      if (typeof own.children !== "object" || !own.children) {
        return own.children;
      }

      if (
        "t" in own.children &&
        (own.children.t as string).startsWith("<astro-slot><p>")
      ) {
        return {
          t: (own.children.t as string)
            .replace("<astro-slot><p>", "<astro-slot>")
            .replace("</p></astro-slot>", "</astro-slot>"),
        } as any as JSX.Element;
      }

      if ("type" in own.children && own.children.type === "p") {
        return (own.children as any as { props: { children: JSX.Element } })
          .props.children;
      }
    }

    return own.children;
  });

  return (
    <div
      style={{
        "--icon": `'${own.icon}'`,
      }}
      classList={{
        "bg-gray-100 dark:bg-gray-800/60 rounded py-2 px-3 relative max-w-contained text-sm":
          true,
        [`relative pr-8 after:content-[var(--icon)] after:absolute after:top-2 after:right-3 after:text-base`]:
          !!own.icon,
        "after:leading-[1.2]": own.unwrapChildP && !!own.icon,
      }}
      {...rest}
    >
      {children()}
    </div>
  );
}
