export const formatTitle = (title: string | null) =>
  title?.replace(/-/g, "\u2011" /* non-breaking hyphen */);
