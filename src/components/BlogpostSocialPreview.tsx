/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import { Group } from "@vx/group";
import { LinePath } from "@vx/shape";
import { curveMonotoneX } from "@vx/curve";
import { genDateValue } from "@vx/mock-data";
import { scaleTime, scaleLinear } from "@vx/scale";
import { extent, max } from "d3-array";

import { DateValue } from "@vx/mock-data/lib/generators/genDateValue";
import { ComponentProps } from "react";
import { assert } from "../lib";
import { Mdx } from "../../__generated__/global";

import { BlogpostDetails } from "./BlogpostDetails";

const LINES_NUMBER = 5 + Math.floor(Math.random() * 4);

function genLines(num: number) {
  return new Array(num).fill(1).map(() => {
    return genDateValue(25);
  });
}

const series = genLines(LINES_NUMBER);
const data = series.reduce((rec, d) => {
  return rec.concat(d);
}, []);

// accessors
const x = (d: DateValue) => d.date;
const y = (d: DateValue) => d.value;

// Shamelessly copied from https://vx-demo.now.sh/lines
const Lines = (props: React.ComponentProps<"svg">) => {
  const xMax = 880;
  const yMax = 440 / (LINES_NUMBER - 3);

  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, x) as any,
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, y)] as any,
  });

  return (
    <svg opacity="0.18" {...props}>
      {xMax > 8 &&
        series.map((dateValue, i) => {
          return (
            <Group key={`lines-${i}`} top={5 + (i * yMax) / 2}>
              <LinePath
                data={dateValue}
                x={d => xScale(x(d))}
                y={d => yScale(y(d))}
                strokeWidth={3}
                curve={i % 2 === 0 ? curveMonotoneX : undefined}
                sx={{
                  stroke: "secondary",
                }}
              />
            </Group>
          );
        })}
    </svg>
  );
};

interface BlogpostSocialImageProps extends ComponentProps<"article"> {
  post: Pick<Mdx, "fields" | "frontmatter">;
}
export function BlogpostSocialPreview({
  post,
  ...rest
}: BlogpostSocialImageProps) {
  assert(post.fields);
  assert(post.frontmatter);

  const {
    fields: { readingTime },
    frontmatter: { date, title },
  } = post;

  return (
    <article
      sx={{
        p: 5,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: "body",
        position: "relative",
      }}
      {...rest}
    >
      <Lines
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
      />
      <s.h1 sx={{ fontSize: [9, 9, 9], color: "text", mt: 0, mb: 3 }}>
        {title}
      </s.h1>
      <BlogpostDetails
        date={date}
        readingTime={readingTime}
        sx={{
          fontSize: [6, 6, 6],
          fontWeight: "bold",
        }}
      />
    </article>
  );
}
