/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";

interface ListPageHeadingProps {
  children: React.ReactNode;
}
export function ListPageHeading({ children }: ListPageHeadingProps) {
  return (
    <s.h1
      sx={{
        mb: [-2, 2],
        mt: [0, 5],
        fontSize: [7, 8],
        color: "text092",
        transform: "rotate(-2deg)",
        "@supports (-webkit-text-stroke: 1px black)": {
          WebkitTextStrokeWidth: ["1px", "2px"],
          WebkitTextStrokeColor: (t) => `2px ${t.colors?.text}`,
          WebkitTextFillColor: (t) => t.colors?.background,
          textShadow: (t) => {
            const color = t.colors?.gray;
            return `\
              3px 3px 0 ${color},
              -1px -1px 0 ${color},  
              1px -1px 0 ${color},
              -1px 1px 0 ${color},
              1px 1px 0 ${color}`;
          },
        },
      }}
    >
      {children}
    </s.h1>
  );
}

// WebkitTextStroke: "1px black",
// WebkitTextFillColor: "white",
