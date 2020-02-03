export const randomElement = <T>(xs: T[]): T =>
  xs[Math.floor(Math.random() * xs.length)];
