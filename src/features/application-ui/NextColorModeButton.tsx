/** @jsx jsx */

import { keys } from "fp-ts/lib/Record";
import { jsx, useColorMode } from "theme-ui";

import { Button, ButtonProps } from "../../lib/reusable-ui/Button";
import {
  ColorModes,
  colorModes,
} from "../../lib/theme-ui-preset-hasparus-homepage/colorModes";

export interface NextColorModeButtonProps extends ButtonProps {}
export const NextColorModeButton = ({
  children,
  ...rest
}: NextColorModeButtonProps) => {
  const [colorMode, setColorMode] = useColorMode();

  const modes = keys(colorModes);
  const nextColorMode = modes[
    (modes.indexOf(colorMode as ColorModes) + 1) % modes.length
  ]!;

  return (
    <Button
      variant="clear"
      onClick={(e) => {
        // iOS safari scrolls a bit down on double tap of this button
        // we'd like to prevent it
        e.preventDefault();

        setColorMode(nextColorMode);
      }}
      title={`change color mode to "${nextColorMode}"`}
      {...rest}
      sx={{
        px: "0.5em",
        color: "text092",
        ":hover, :focus": {
          bg: "muted",
          color: "text",
        },
        ...rest.sx,
      }}
    >
      {children || colorMode}
    </Button>
  );
};
