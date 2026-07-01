import { createMemo, type JSX, splitProps } from "solid-js";

export interface CalloutProps extends JSX.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  unwrapChildP?: boolean;
}

// Solid's SSR output is an opaque `{ t: htmlString }` template node, and its
// hyperscript output is a `{ type, props }` node — neither is modelled by the
// public `JSX.Element` type, so we narrow to them structurally.
interface SolidSsrNode {
  t: string;
}
interface SolidHyperscriptParagraph {
  type: string;
  props: { children: JSX.Element };
}

function isSsrNode(node: object): node is SolidSsrNode {
  return "t" in node && typeof node.t === "string";
}

function isHyperscriptParagraph(
  node: object,
): node is SolidHyperscriptParagraph {
  return "type" in node && node.type === "p";
}

export function Callout(props: CalloutProps) {
  const [own, rest] = splitProps(props, ["icon", "unwrapChildP", "children"]);

  const children = createMemo(() => {
    if (own.unwrapChildP) {
      const child = own.children;
      if (typeof child !== "object" || !child) {
        return child;
      }

      if (isSsrNode(child) && child.t.startsWith("<astro-slot><p>")) {
        child.t = child.t
          .replace("<astro-slot><p>", "<astro-slot>")
          .replace("</p></astro-slot>", "</astro-slot>");
        return child;
      }

      if (isHyperscriptParagraph(child)) {
        return child.props.children;
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
        "bg-gray-100 dark:bg-gray-800/60 rounded-sm py-2 px-3 relative max-w-container text-sm": true,
        [`relative pr-8 after:content-(--icon) after:absolute after:top-2 after:right-3 after:text-base`]:
          !!own.icon,
        "after:leading-[1.2]": own.unwrapChildP && !!own.icon,
      }}
      {...rest}
    >
      {children()}
    </div>
  );
}
