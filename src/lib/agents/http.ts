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
  const ranges = accept
    .toLowerCase()
    .split(",")
    .map((range) => {
      const [type = "", ...parameters] = range.trim().split(";");
      const quality = parameters.find((value) => value.trim().startsWith("q="));
      const q = quality ? Number(quality.trim().slice(2)) : 1;
      return {
        type: type.trim(),
        q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0,
      };
    });
  const markdown =
    ranges.find((range) => range.type === "text/markdown")?.q ?? 0;
  const html = ranges.find((range) => range.type === "text/html")?.q ?? 0;
  return markdown > 0 && markdown >= html;
}

export const markdown404 = `# 404: Page not found

There isn't a page at this URL. Try the [site index](https://haspar.us/llms.txt) for articles and developer docs.
`;
