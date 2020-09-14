export const fontSize = {
  base: "21px",
  small: [0, 1],
  normal: [1, 2],
};

const systemFont =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, ' +
  'Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", ' +
  '"Droid Sans", "Helvetica Neue", sans-serif';

export const typography = {
  fonts: {
    monospace:
      "'Fira Code', 'Hack', 'Hasklig', 'Dank Mono', 'Inconsolata', 'Menlo', 'Consolas', monospace",
    body: systemFont,
    heading: systemFont,
    // 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
    // 'Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", ' +
    // '"Droid Sans", "Helvetica Neue", sans-serif',
  },
  /**
   * minor third 1.200
   * @see https://type-scale.com/
   */
  fontSizes: Object.assign(
    [
      "0.694rem",
      "0.833rem",
      "1rem",
      "1.5rem",
      "1.563rem",
      "1.953rem",
      "2.441rem",
      "3.052rem",
      "3.815rem",
      "4.678rem",
    ],
    { "-1": "0.579rem" }
  ),
  fontWeights: {
    body: 400,
    heading: 800,
    bold: 600,
  },
  lineHeights: {
    body: 1.65,
    heading: 1.25,
    monospace: 1.5,
  },
};
