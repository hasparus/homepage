export function jsonError(
  status: number,
  code: string,
  message: string,
  hint: string,
  headers?: HeadersInit,
): Response {
  return Response.json(
    { error: { code, message, hint } },
    { status, ...(headers ? { headers } : {}) },
  );
}

export function prefersMarkdown(accept: string): boolean {
  const ranges = new Map<string, number>();
  for (const range of accept.toLowerCase().split(",")) {
    const [type = "", ...parameters] = range.split(";");
    const weight = parameters.find((value) => value.trim().startsWith("q="));
    const value = weight?.trim().slice(2);
    const quality =
      value === undefined
        ? 1
        : /^(0(\.\d{0,3})?|1(\.0{0,3})?)$/.test(value)
          ? Number(value)
          : 0;
    const mediaType = type.trim();
    ranges.set(mediaType, Math.max(ranges.get(mediaType) ?? 0, quality));
  }
  const wildcard = ranges.get("text/*") ?? ranges.get("*/*") ?? 0;
  const markdown = ranges.get("text/markdown") ?? wildcard;
  const html = ranges.get("text/html") ?? wildcard;
  return (
    markdown > 0 &&
    (markdown > html || (markdown === html && ranges.has("text/markdown")))
  );
}

export const markdown404 = `# 404: Page not found

There isn't a page at this URL. Try the [site index](https://haspar.us/llms.txt) for articles and developer docs.
`;
