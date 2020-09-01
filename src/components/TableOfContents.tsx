/** @jsx jsx */
import { Styled as s, jsx } from "theme-ui";

import { pageCtx } from "./pageCtx";
import { MdxPostPageContext } from "../../gatsby-node-ts";

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
      sx={{ border: t => `6px solid ${t.colors?.highlight}`, px: 3 }}
    >
      <s.h3 id="table-of-contents" sx={{ my: "0.5em" }}>
        Table of Contents
      </s.h3>
      <s.ul>
        {tableOfContents.items.map(({ url, title, items }, i) => (
          <s.li key={i}>
            {url && <s.a href={url}>{title!}</s.a>}
            {items && items.length !== 0 && (
              <ul>
                {items.map((x, j) => (
                  <li key={j}>
                    {x.url && <s.a href={x.url}>{x.title!}</s.a>}
                  </li>
                ))}
              </ul>
            )}
          </s.li>
        ))}
      </s.ul>
    </section>
  );
}
