/** @jsx jsx */
import { filter, collect } from "fp-ts/lib/Record";
import { pipe } from "fp-ts/lib/pipeable";
import { Styled as s, jsx } from "theme-ui";
import { theme, Root } from "../ui";

const contrastingTextColor = (color: string /* 6 or 3 letter hex */) => {
  const col =
    color.length === 7
      ? color.slice(1)
      : color
          .match(/#(\w)(\w)(\w)/)!
          .slice(1, 4)
          .map(ch => ch + ch)
          .join("");

  console.log({ col });

  const [r, g, b] = col
    .match(/(\w\w)(\w\w)(\w\w)/)!
    .slice(1, 4)
    .map(x => Number(`0x${x}`));

  /**
   * @see http://alienryderflex.com/hsp.html
   * @see https://medium.com/the-mvp/finally-a-definitive-way-to-make-gradients-beautiful-6b27af88f5f
   */
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return hsp > 125 ? "black" : "white";
};

const ThemePage = () => {
  return (
    <Root>
      <s.h1>Theme</s.h1>
      <section>
        <s.h2>Colors</s.h2>
        <ul
          sx={{
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            padding: 0,
          }}
        >
          {pipe(
            theme.colors,
            filter((x): x is string => typeof x === "string"),
            collect((colorName, colorValue) => (
              <li
                key={colorName}
                sx={{ width: 200, height: 200, bg: colorValue }}
              >
                <s.div
                  sx={{
                    color: contrastingTextColor(colorValue),
                  }}
                >
                  {colorName}: {colorValue}
                </s.div>
              </li>
            ))
          )}
        </ul>
      </section>
    </Root>
  );
};

export default ThemePage;
