/** @jsx jsx */
import { filter, collect, keys } from "fp-ts/lib/Record";
import { pipe } from "fp-ts/lib/pipeable";
import { Styled as s, jsx, useColorMode } from "theme-ui";
import { last } from "lodash";
import { theme, ColorModes, colorModes, Header, Root, Button } from "../components";
import { isString, contrastingTextColor } from "../utils";

function copyToClipboard(value: string | number) {
  window.navigator.clipboard.writeText(String(value)).then(() => {
    window.alert(`copied ${value} to clipboard`);
  });
}

const ColorSquareList = (props: React.ComponentProps<"ul">) => (
  <ul
    sx={{
      listStyle: "none",
      display: "flex",
      flexWrap: "wrap",
      padding: 0,
    }}
    {...props}
  />
);

const CopyableText: React.FC<{ children: React.ReactText }> = ({
  children,
}) => (
  <Button
    sx={{
      cursor: "copy",
    }}
    onClick={() => copyToClipboard(children)}
  >
    {children}
  </Button>
);

type ThemeHeadingProps = {
  as: "h1" | "h2" | "h3" | "h4" | "h5";
};
const ThemeHeading: React.FC<ThemeHeadingProps> = ({ as }) => {
  const H = s[as];

  const { fontSize } = theme.styles[as];
  const fontSizeIndex =
    typeof fontSize === "number" ? fontSize : last(fontSize)!;

  return (
    <H>
      {as} {theme.fonts.heading.split(",")[0].slice(1, -1)}{" "}
      {theme.fontSizes[fontSizeIndex]}px
    </H>
  );
};

type ColorSquareProps = {
  name: string;
  value: string;
};

const ColorSquare: React.FC<ColorSquareProps> = ({ name, value }) => {
  return (
    <li
      key={name}
      sx={{
        boxSizing: "border-box",
        width: 200,
        height: 200,
        p: "1em",
        bg: name,
        color: contrastingTextColor(value),
      }}
    >
      <CopyableText>{name}</CopyableText>: <CopyableText>{value}</CopyableText>
    </li>
  );
};

const ThemePage = () => {
  const [colorMode, setColorMode] = useColorMode<ColorModes>();

  return (
    <Root>
      <Header showHome />
      <s.h1>Theme</s.h1>
      {keys(colorModes).map(colorModeName => (
        <Button
          key={colorModeName}
          sx={{
            bg: "highlight",
            p: 1,
            mr: 2,
          }}
          onClick={() => setColorMode(colorModeName)}
        >
          {colorModeName}
        </Button>
      ))}
      <section>
        <s.h2>Colors</s.h2>
        <ColorSquareList>
          {pipe(
            colorModes[colorMode],
            filter(isString),
            collect((colorName, colorValue) => (
              <ColorSquare name={colorName} value={colorValue} />
            ))
          )}
        </ColorSquareList>
      </section>
      <section>
        <s.h2>Typography</s.h2>
        <ThemeHeading as="h1" />
        <ThemeHeading as="h2" />
        <ThemeHeading as="h3" />
        <ThemeHeading as="h4" />
        <ThemeHeading as="h5" />
      </section>
    </Root>
  );
};

export default ThemePage;
