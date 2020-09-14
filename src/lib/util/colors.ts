import { flow } from "fp-ts/lib/function";

import { assert } from "./assert";

function colorToInt(color: number): number {
  return Math.round(color * 255);
}

/**
 * I have copied an internal helper from polished like a bandit and changed few lines.
 * https://github.com/styled-components/polished/blob/master/src/internalHelpers/_hslToRgb.js
 */
export function hslToRgb(
  hue: number,
  saturation: number,
  lightness: number
): RGB {
  if (saturation === 0) {
    // achromatic
    const x = colorToInt(lightness);
    return { r: x, g: x, b: x };
  }

  // formulae from https://en.wikipedia.org/wiki/HSL_and_HSV
  const huePrime = (((hue % 360) + 360) % 360) / 60;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = secondComponent;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = secondComponent;
    green = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma;
    blue = secondComponent;
  } else if (huePrime >= 3 && huePrime < 4) {
    green = secondComponent;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = secondComponent;
    blue = chroma;
  } else if (huePrime >= 5 && huePrime < 6) {
    red = chroma;
    blue = secondComponent;
  }

  const lightnessModification = lightness - chroma / 2;
  return {
    r: colorToInt(red + lightnessModification),
    g: colorToInt(green + lightnessModification),
    b: colorToInt(blue + lightnessModification),
  };
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}
export function RGB(color: string): RGB {
  let r: number | undefined;
  let g: number | undefined;
  let b: number | undefined;
  if (color.startsWith("hsl")) {
    const [hs, ss, ls] = color
      .match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/)!
      .slice(1, 4);

    assert(hs && ss && ls);

    const h = Number(hs);
    const s = parseInt(ss, 10) / 100;
    const l = parseInt(ls, 10) / 100;
    return hslToRgb(h, s, l);
  }
  if (color.startsWith("rgb")) {
    [r, g, b] = color
      .match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)!
      .slice(1, 4)
      .map(Number);
  } else if (color.startsWith("#")) {
    const col =
      color.length === 7
        ? color.slice(1)
        : color
            .match(/#(\w)(\w)(\w)/)!
            .slice(1, 4)
            .map((ch) => ch + ch)
            .join("");
    [r, g, b] = col
      .match(/(\w\w)(\w\w)(\w\w)/)!
      .slice(1, 4)
      .map((x) => Number(`0x${x}`));
  } else {
    throw new Error(`color ${color} not handled`);
  }
  return { r, g, b } as RGB;
}

/**
 * @example
 * contrastingTextColor("#fff") === "black";
 */
export const isRGBDark = ({ r, g, b }: RGB) => {
  /**
   * @see http://alienryderflex.com/hsp.html
   * @see https://medium.com/the-mvp/finally-a-definitive-way-to-make-gradients-beautiful-6b27af88f5f
   */
  const hsp = Math.sqrt(
    0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
  );
  return hsp <= 125;
};

export const isColorDark = flow(RGB, isRGBDark);

export const contrastingTextColor = (color: string) => {
  return isColorDark(color) ? "white" : "black";
};
