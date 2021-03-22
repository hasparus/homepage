/** @jsx jsx */
import { jsx, useThemeUI } from "theme-ui";

import {
  ExactTheme,
  ExactThemeFromCtx,
} from "../../gatsby-plugin-theme-ui";
import { ColorMode } from "../../lib/theme-ui-preset-hasparus-homepage";
import { RGB } from "../../lib/util";

type ColorName = keyof ColorMode;

function luminance({ r, g, b }: RGB) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0]! * 0.2126 + a[1]! * 0.7152 + a[2]! * 0.0722;
}

/**
 * @see https://stackoverflow.com/a/9733420/6003547
 */
function contrast(rgb1: RGB, rgb2: RGB) {
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ContrastRatioProps {
  colorNames: [ColorName, ColorName];
}

export function ContrastRatio({ colorNames }: ContrastRatioProps) {
  const theme = useThemeUI().theme as ExactThemeFromCtx;

  const [one, two] = colorNames.map((colorName) =>
    RGB(theme.rawColors[colorName])
  );

  const result = contrast(one!, two!).toFixed(2);

  return (
    <output sx={{ fontWeight: "bold" }}>
      <span sx={{ variant: "styles.p.code" }}>{result}</span>{" "}
      {/* @see https://haspar.us/notes/contrast-triangle */}
      {parseFloat(result) < 3 ? ":(" : ""}
    </output>
  );
}
