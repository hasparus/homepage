/** @jsx jsx */
import { ComponentProps } from "react";
import { jsx, Styled as s } from "theme-ui";

import { fontSize } from "../theme-ui-preset-hasparus-homepage/tokens";

const FOOTNOTE_ID_PREFIX = "footnote-";
const REVERSE = "rev-";

interface FootnoteProps extends Omit<ComponentProps<"div">, "id"> {
  number: number;
}

export function Footnote({ number, children, ...rest }: FootnoteProps) {
  return (
    <div
      id={FOOTNOTE_ID_PREFIX + number}
      sx={{
        display: ["flex", "flex", "block"],
        my: 1,
        p: { margin: 0, ml: [1, 1, 0] },
        fontSize: fontSize.small,
      }}
      {...rest}
    >
      <s.a
        href={`#${REVERSE}${FOOTNOTE_ID_PREFIX}${number}`}
        sx={{
          position: ["initial", "initial", "absolute"],
          transform: ["0", "0", "translateX(-1.5rem)"],
        }}
      >
        [{number}]
      </s.a>{" "}
      {children}
    </div>
  );
}

interface FootnoteAnchorProps
  extends Omit<ComponentProps<"sup">, "children"> {
  number: number;
}

Footnote.A = ({ number, ...rest }: FootnoteAnchorProps) => (
  <sup {...rest}>
    <s.a
      id={`${REVERSE}${FOOTNOTE_ID_PREFIX}${number}`}
      href={`#${FOOTNOTE_ID_PREFIX}${number}`}
      sx={{
        color: "inherit",
        textDecoration: "none",
        "&:hover": { color: "primary" },
        "&:target": { backgroundColor: "primary", color: "background" },
      }}
    >
      [{number}]
    </s.a>
  </sup>
);
