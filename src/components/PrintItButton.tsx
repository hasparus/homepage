/** @jsx jsx */
import { jsx, useColorMode } from "theme-ui";
import { useEffect, useState, useRef } from "react";

import { ColorModes, fontSize } from "../gatsby-plugin-theme-ui";
import { Button } from "./Button";

function useWindowPrint(options: {
  onBeforePrint: () => void;
  onAfterPrint: () => void;
}) {
  type State = "Ready" | "Printing" | "Printed";
  const [state, setState] = useState<State>("Ready");

  const onAfterCurrentPrint = useRef<() => void>();
  useEffect(() => {
    switch (state) {
      case "Ready":
        break;
      case "Printing":
        window.print();
        break;
      case "Printed":
        if (onAfterCurrentPrint.current) {
          onAfterCurrentPrint.current();
        }
        setState("Ready");
        break;
      default: {
        const _: never = state;
        throw new Error("switch is not exhaustive");
      }
    }
  }, [state, setState]);

  useEffect(() => {
    window.addEventListener("afterprint", () => {
      setState("Printed");
    });
  }, []);

  return function print() {
    options.onBeforePrint();
    onAfterCurrentPrint.current = options.onAfterPrint;
    setState("Printing");
  };
}

export function PrintItButton() {
  const [colorMode, setColorMode] = useColorMode<ColorModes>();
  const print = useWindowPrint({
    onBeforePrint: () => setColorMode("light"),
    onAfterPrint: () => setColorMode(colorMode),
  });

  return (
    <Button
      onClick={print}
      sx={{ fontSize: fontSize.small, bg: "muted", px: "0.5em" }}
    >
      Print it 🖨
    </Button>
  );
}
