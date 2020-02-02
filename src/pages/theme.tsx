/** @jsx jsx */
import { filter, collect, keys } from "fp-ts/lib/Record";
import { last } from "lodash";
import { Link } from "gatsby";
import { pipe } from "fp-ts/lib/pipeable";
import { Styled as s, jsx, useColorMode } from "theme-ui";

import {
  theme,
  ColorModes,
  colorModes,
  Header,
  Root,
  Button,
  PostSocialPreview,
} from "../components";
import { isString, contrastingTextColor, copyToClipboard } from "../lib";

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

  const fontSize = theme.styles[as].fontSize as number | number[];
  const fontSizeIndex =
    typeof fontSize === "number" ? fontSize : last(fontSize)!;

  return (
    <H>
      {as} {theme.fonts.heading.split(",")[0]}{" "}
      {theme.fontSizes[fontSizeIndex]}
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
      <CopyableText>{name}</CopyableText>:{" "}
      <CopyableText>{value}</CopyableText>
    </li>
  );
};

const ThemePage = () => {
  const [colorModeName, setColorMode] = useColorMode<ColorModes>();

  const currentColorMode = colorModes[colorModeName];

  return (
    <Root>
      <Header />
      <s.h1>Theme</s.h1>
      {keys(colorModes).map(colorMode => (
        <Button
          key={colorMode}
          sx={{
            bg: "highlight",
            color: contrastingTextColor(currentColorMode.highlight),
            p: 1,
            mr: 2,
          }}
          onClick={() => setColorMode(colorMode)}
        >
          {colorMode}
        </Button>
      ))}
      <section>
        <s.h2>Colors</s.h2>
        <ColorSquareList>
          {pipe(
            currentColorMode,
            filter(isString),
            collect((colorName, colorValue) => (
              <ColorSquare
                key={colorName}
                name={colorName}
                value={colorValue}
              />
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
      <section>
        <s.h2>Links</s.h2>
        <ul>
          <li>
            <Link sx={{ color: "primary" }} to="/syntax-test.hidden">
              Syntax Highlighting Example
            </Link>
          </li>
        </ul>
      </section>
      <section>
        <s.h2>Blogpost Social Preview</s.h2>
        <PostSocialPreview
          sx={{
            border: "1px solid currentColor",
            width: 880,
            height: 440,
            maxWidth: "100%",
          }}
          post={{
            fields: {
              isHidden: false,
              readingTime: 5,
              route: "/you-deserve-more-than-proptypes",
            },
            frontmatter: {
              title: "You Deserve More than PropTypes",
              date: "2019-11-17T15:00:03Z",
              spoiler: "Use static typing instead. It does wonders.",
            },
          }}
        />
      </section>
    </Root>
  );
};

// eslint-disable-next-line import/no-default-export
export default ThemePage;
