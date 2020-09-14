/** @jsx jsx */
import { alpha } from "@theme-ui/color";
import { ComponentProps, Fragment, ReactNode } from "react";
import { jsx, Styled as s } from "theme-ui";

import { fontSize } from "../theme-ui-preset-hasparus-homepage/tokens";
import { isInViewport } from "../util/isInViewport";

const FOOTNOTE_ID_PREFIX = "footnote-";
const REVERSE = "rev-";

const Brackets = ({ children }: { children: ReactNode }) => (
  <Fragment>
    <span sx={{ opacity: 0.5 }}>[</span>
    {children}
    <span sx={{ opacity: 0.5 }}>]</span>
  </Fragment>
);

interface FootnoteProps extends Omit<ComponentProps<"div">, "id"> {
  number: number;
}

export function Footnote({ number, children, ...rest }: FootnoteProps) {
  const target = `${REVERSE}${FOOTNOTE_ID_PREFIX}${number}`;
  return (
    <div
      id={FOOTNOTE_ID_PREFIX + number}
      sx={{
        display: ["flex", "flex", "block"],
        py: 1,
        px: 2,
        mx: -2,
        "> p": { margin: 0, ml: [1, 1, 0] },
        fontSize: fontSize.small,
        border: "1px dashed transparent",
        ":target": {
          backgroundColor: alpha("highlight", 0.15),
          borderColor: "highlight",
        },
      }}
      {...rest}
    >
      <s.a
        href={`#${target}`}
        onClick={() => {
          setTimeout(() => {
            document.getElementById(target)?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 0);
        }}
        sx={{
          position: ["initial", "initial", "absolute"],
          transform: ["0", "0", "translateX(-1.5rem)"],
        }}
      >
        <Brackets>{number}</Brackets>
      </s.a>{" "}
      {children}
    </div>
  );
}

interface FootnoteAnchorProps
  extends Omit<ComponentProps<"sup">, "children"> {
  number: number;
}

Footnote.A = ({ number, ...rest }: FootnoteAnchorProps) => {
  const target = `${FOOTNOTE_ID_PREFIX}${number}`;
  return (
    <sup {...rest}>
      <s.a
        id={`${REVERSE}${FOOTNOTE_ID_PREFIX}${number}`}
        href={`#${target}`}
        onClick={() => {
          const element = document.getElementById(target);
          if (element && !isInViewport(element)) {
            setTimeout(() => {
              element.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
            }, 0);
          }
        }}
        sx={{
          color: "inherit",
          textDecoration: "none",
          "&:hover": { color: "primary" },
          "&:target": { backgroundColor: "primary", color: "background" },
        }}
      >
        <Brackets>{number}</Brackets>
      </s.a>
    </sup>
  );
};
