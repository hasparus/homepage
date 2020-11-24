import { Global } from "@emotion/react";
import { lighten } from "@theme-ui/color";
import React from "react";
import { css, useColorMode } from "theme-ui";

import {
  ColorModes,
  colorModes,
} from "../../lib/theme-ui-preset-hasparus-homepage/colorModes";
import { assert } from "../../lib/util";

export function ColorModeSpecificStyleTweaks() {
  const colorMode = useColorMode()[0] as ColorModes;

  if (process.env.NODE_ENV === "development") {
    assert(colorMode in colorModes);
  }

  const styles =
    colorMode === "dark"
      ? css({
          html: {
            "--scrollbar-color": "255, 255, 255",
          },
          ".night-owl-no-italics.vscode-highlight": {
            backgroundColor: lighten("background", 0.03),
          } as {},
        })
      : {};

  return <Global styles={styles} />;
}
