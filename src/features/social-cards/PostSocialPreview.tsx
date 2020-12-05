/** @jsx jsx */
import { curveMonotoneX } from "@vx/curve";
import { Group } from "@vx/group";
import { genDateValue } from "@vx/mock-data";
import { DateValue } from "@vx/mock-data/lib/generators/genDateValue";
import { scaleLinear, scaleTime } from "@vx/scale";
import { LinePath } from "@vx/shape";
import { extent, max } from "d3-array";
import { ComponentProps } from "react";
import { jsx, Themed as th } from "theme-ui";

import { assert } from "../../lib/util/assert";
import { PostDetails } from "../blog/PostDetails";

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
    <svg opacity="0.65" {...props}>
      {xMax > 8 &&
        series.map((dateValue, i) => {
          return (
            <Group key={`lines-${i}`} top={5 + (i * yMax) / 2}>
              <LinePath
                data={dateValue}
                x={(d) => xScale(x(d))}
                y={(d) => yScale(y(d))}
                strokeWidth={3}
                curve={i % 2 === 0 ? curveMonotoneX : undefined}
                sx={{
                  stroke: "muted",
                }}
              />
            </Group>
          );
        })}
    </svg>
  );
};

interface PostSocialImageProps extends ComponentProps<"article"> {
  post: Pick<GatsbyTypes.Mdx, "fields" | "frontmatter">;
}
export function PostSocialPreview({ post, ...rest }: PostSocialImageProps) {
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
      <th.h1 sx={{ fontSize: [9, 9, 9], color: "text", mt: 0, mb: 3 }}>
        {title}
      </th.h1>
      <PostDetails
        date={date!}
        readingTime={readingTime}
        sx={{
          fontSize: [6, 6, 6],
          fontWeight: "bold",
        }}
      />
    </article>
  );
}
