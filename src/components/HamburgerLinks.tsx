/** @jsx jsx */

import { jsx } from "theme-ui";
import { ComponentProps, forwardRef } from "react";

const strokeWidth = 1;
const boldStroke = strokeWidth * 1.25;

interface HamburgerLinksProps extends ComponentProps<"div"> {
  menuId: string;
  bunColor?: string;
  meatColor?: string;
}
export const  HamburgerLinks = forwardRef<HTMLDivElement, HamburgerLinksProps>(
  function HamburgerLinks(
    { menuId, bunColor = "sandybrown", meatColor = "brown", ...rest },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="group"
        sx={{
          position: "relative",
          marginLeft: "auto",
          marginTop: "-8px",
          [`#${menuId}:target ~ &`]: {
            "> a > svg": {
              ".HamburgerLinks__BunTop": {
                transform: "rotate(-45deg) translate(9%, 5%)",
                strokeWidth: boldStroke,
                // won't work on iOS Safari
                d: 'path("M 0 4 A 1 0, 0 0 1, 10 4 Z")',
                // specific to iOS devices
                "@supports (-webkit-overflow-scrolling: touch)": {
                  opacity: 0,
                  transform: "rotateZ(-45deg) translate(9%, 5%)",
                },
              },
              ".HamburgerLinks__Meat": {
                strokeWidth: strokeWidth / 3,
                opacity: 0,
                d: 'path("M 4 6 L 4 6")',
                transformOrigin: "50% 50% 0",
                transform: "rotate(-45deg) translate(0, -20%)",
              },
              ".HamburgerLinks__BunBottom": {
                transform: "rotate(45deg) translate(-2%, -21%)",
              },
            },
            ":hover > a:first-of-type > svg": {
              transform: "none",
              ".HamburgerLinks__BunTop": {
                transform: "rotate(-45deg)",
              },
              ".HamburgerLinks__BunBottom": {
                transform: "rotate(45deg)",
              },
            },
          },
        }}
        {...rest}
      >
        <a
          aria-label="open menu"
          href={`#${menuId}`}
          sx={{ display: "flex", padding: "8px" }}
        >
          <svg
            viewBox="-1 -1 12 12"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            sx={{
              width: 32,
              height: 32,
              transition: "transform 150ms ease-out",
              ":focus, :hover": {
                transform: "scaleY(0.8)",
              },
              "> *": {
                transition:
                  "transform 250ms ease-out, " +
                  "stroke-width 250ms ease-out, " +
                  "opacity 250ms linear, " +
                  "d 200ms linear",
              },
              ".HamburgerLinks__BunBottom, .HamburgerLinks__BunTop": {
                transformOrigin: "50% 50% 0",
              },
            }}
          >
            <path
              className="HamburgerLinks__BunTop"
              d="M 0 4 A 1 0.6, 0 0 1, 10 4 Z"
              sx={{
                stroke: bunColor,
                fill: bunColor,
              }}
            />
            <path
              className="HamburgerLinks__Meat"
              d="M 0 6 L 10 6"
              strokeWidth={boldStroke}
              sx={{
                stroke: meatColor,
              }}
            />
            <line
              className="HamburgerLinks__BunBottom"
              x1="0"
              y1="8.25"
              x2="10"
              y2="8.25"
              strokeWidth={boldStroke}
              sx={{
                stroke: bunColor,
              }}
            />
          </svg>
        </a>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
        <a
          aria-label="close menu"
          href="#"
          sx={{
            display: "none",
            [`#${menuId}:target ~ div > &`]: {
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              width: "100%",
              display: "block",
            },
          }}
        />
      </div>
    );
  }
);
