export const isString = (x: unknown): x is string => typeof x === "string";

/**
 * @param color 6 or 3 letter hex
 * @example
 * contrastingTextColor("#fff") === "black";
 */

export const isColorDark = (color: string) => {
  const col =
    color.length === 7
      ? color.slice(1)
      : color
          .match(/#(\w)(\w)(\w)/)!
          .slice(1, 4)
          .map(ch => ch + ch)
          .join("");

  const [r, g, b] = col
    .match(/(\w\w)(\w\w)(\w\w)/)!
    .slice(1, 4)
    .map(x => Number(`0x${x}`));

  /**
   * @see http://alienryderflex.com/hsp.html
   * @see https://medium.com/the-mvp/finally-a-definitive-way-to-make-gradients-beautiful-6b27af88f5f
   */
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return hsp <= 125;
};

export const contrastingTextColor = (color: string) => {
  return isColorDark(color) ? "white" : "black";
};

export function copyToClipboard(value: string | number) {
  window.navigator.clipboard.writeText(String(value)).then(() => {
    window.alert(`copied ${value} to clipboard`);
  });
}
