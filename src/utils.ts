import { AssertionError } from "assert";
import { flow } from "fp-ts/lib/function";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function RGB(color: string): RGB {
  let r: number;
  let g: number;
  let b: number;
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
            .map(ch => ch + ch)
            .join("");
    [r, g, b] = col
      .match(/(\w\w)(\w\w)(\w\w)/)!
      .slice(1, 4)
      .map(x => Number(`0x${x}`));
  } else {
    throw new Error(`color ${color} not handled`);
  }

  return { r, g, b } as RGB;
}

export const isString = (x: unknown): x is string => typeof x === "string";

/**
 * @example
 * contrastingTextColor("#fff") === "black";
 */
export const isRGBDark = ({ r, g, b }: RGB) => {
  /**
   * @see http://alienryderflex.com/hsp.html
   * @see https://medium.com/the-mvp/finally-a-definitive-way-to-make-gradients-beautiful-6b27af88f5f
   */
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return hsp <= 125;
};

export const isColorDark = flow(RGB, isRGBDark);

export const contrastingTextColor = (color: string) => {
  return isColorDark(color) ? "white" : "black";
};

export function copyToClipboard(value: string | number) {
  window.navigator.clipboard.writeText(String(value)).then(() => {
    // eslint-disable-next-line no-alert
    window.alert(`copied ${value} to clipboard`);
  });
}

export function panic(message: string) {
  throw new Error(message);
}

export const randomElement = <T>(xs: T[]): T =>
  xs[Math.floor(Math.random() * xs.length)];

export function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError({ message });
  }
}
