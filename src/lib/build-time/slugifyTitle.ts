import slugify from "slugify";

export const slugifyTitle = (title: string) =>
  slugify(title, {
    lower: true,
    // default value minus `/`
    remove: /[^/\w\s$*_+~.()'"!\-:@]+/g,
  }).replace(/\./g, "-");
