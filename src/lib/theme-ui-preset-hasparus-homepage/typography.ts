export const fontSize = {
  base: "22px",
  small: [0, 1],
  normal: [1, 2],
};

export const typography = {
  fonts: {
    monospace:
      "'Fira Code', 'Hack', 'Hasklig', 'Dank Mono', 'Inconsolata', 'Menlo', 'Consolas', monospace",
    body:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
      'Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", ' +
      '"Droid Sans", "Helvetica Neue", sans-serif',
    heading:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
      'Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", ' +
      '"Droid Sans", "Helvetica Neue", sans-serif',
  },
  fontSizes: Object.assign(
    [
      "0.727rem",
      "0.8rem",
      "1rem",
      "1.25rem",
      "1.563rem",
      "1.953rem",
      "2.441rem",
      "3.052rem",
      "3.815rem",
      "4.768rem",
    ],
    { "-1": "0.64rem", "-2": "0.512rem" }
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
