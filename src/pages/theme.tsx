/** @jsx jsx */
import { pipe } from "fp-ts/lib/pipeable";
import { collect, filter, keys } from "fp-ts/lib/Record";
import { Link } from "gatsby";
import { last } from "lodash";
import { jsx, Styled as s, useColorMode } from "theme-ui";

import { PostSocialPreview } from "../features/social-cards/PostSocialPreview";
import { theme } from "../gatsby-plugin-theme-ui";
import { PageLayout } from "../layouts/PageLayout";
import { Button } from "../lib/reusable-ui";
import {
  ColorModes,
  colorModes,
} from "../lib/theme-ui-preset-hasparus-homepage/colorModes";
import {
  contrastingTextColor,
  copyToClipboard,
  isString,
} from "../lib/util";

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
    sx={{ cursor: "copy", textAlign: "inherit" }}
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
  const [colorModeName, setColorMode] = useColorMode();

  const currentColorMode = colorModes[colorModeName as ColorModes];

  return (
    <PageLayout>
      <s.h1>Theme</s.h1>
      {keys(colorModes).map((colorMode) => (
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
        <div>
          <ThemeHeading as="h1" />
        </div>
        <div>
          <ThemeHeading as="h2" />
        </div>
        <div>
          <ThemeHeading as="h3" />
        </div>
        <div>
          <ThemeHeading as="h4" />
        </div>
        <div>
          <ThemeHeading as="h5" />
        </div>
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
    </PageLayout>
  );
};

export default ThemePage;
