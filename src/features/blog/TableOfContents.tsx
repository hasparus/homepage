/** @jsx jsx */
import { jsx, Themed as th } from "theme-ui";

import { MdxPostPageContext } from "../../../gatsby-node";
import { pageCtx } from "../pageCtx";

export function TableOfContents() {
  // unsafe
  const { pageContext } = pageCtx.useContext();
  if (!pageContext) {
    return null;
  }

  const { tableOfContents } = pageContext as MdxPostPageContext;

  if (!tableOfContents.items || tableOfContents.items.length === 0) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(
        `tableOfContents.items is empty (${JSON.stringify(
          tableOfContents.items
        )})`
      );
    }
    return null;
  }
  return (
    <section
      sx={{
        border: (t) => `6px solid ${t.colors?.highlight}`,
        p: 3,
        pt: 2,
      }}
    >
      <th.h3
        id="table-of-contents"
        sx={{
          fontSize: 1,
          textTransform: "uppercase",
          letterSpacing: 3,
          color: "text092",
        }}
      >
        Table of Contents
      </th.h3>
      <th.ul sx={{ m: 0, mt: 1 }}>
        {tableOfContents.items.map(({ url, title, items }, i) => (
          <th.li key={i}>
            {url && <th.a href={url}>{title!}</th.a>}
            {items && items.length !== 0 && (
              <ul>
                {items.map((x, j) => (
                  <li key={j}>
                    {x.url && <th.a href={x.url}>{x.title!}</th.a>}
                  </li>
                ))}
              </ul>
            )}
          </th.li>
        ))}
      </th.ul>
    </section>
  );
}
