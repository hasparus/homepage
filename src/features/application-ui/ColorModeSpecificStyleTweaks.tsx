import { Global } from "@emotion/react";
import { lighten } from "@theme-ui/color";
import React from "react";
import { css, useColorMode } from "theme-ui";

import {
  ColorModes,
  colorModes,
} from "../../lib/theme-ui-preset-hasparus-homepage/colorModes";

export function ColorModeSpecificStyleTweaks() {
  const colorMode = useColorMode()[0] as ColorModes;

  if (process.env.NODE_ENV === "development") {
    if (colorMode && !(colorMode in colorModes)) {
      console.error(
        `colorMode ${colorMode} is expected to be a key of ${JSON.stringify(
          colorModes,
          null,
          2
        )}
        \nDid you leave a color mode name from other ThemeUI app there?`
      );
    }
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
