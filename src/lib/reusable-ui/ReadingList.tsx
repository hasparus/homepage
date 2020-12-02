/** @jsx jsx */

import { jsx, Themed as th } from "theme-ui";
import { toArray } from "fp-ts/lib/Record";
import { fromCompare, ordString } from "fp-ts/lib/Ord";
import { ComponentPropsWithoutRef } from "react";
import { sort } from "fp-ts/lib/Array";
import { MDXProvider } from "@mdx-js/react";
import dedent from "dedent";

import { ReadingList as Reading } from "../../../content/assets/reading";
import { fontSize } from "../../gatsby-plugin-theme-ui/tokens";

interface ReadingListProps extends ComponentPropsWithoutRef<"ul"> {
  list: Reading;
}

export const ReadingList = ({ list, ...rest }: ReadingListProps) => {
  const alphabeticalOrder = fromCompare<[string, Reading.Article[]]>(
    (a, b) => ordString.compare(a[0].toLowerCase(), b[0].toLowerCase())
  );
  const first = (x: Reading.Article) => (typeof x === "string" ? x : x[0]);
  const ordArticle = fromCompare<Reading.Article>((a, b) =>
    ordString.compare(first(a), first(b))
  );

  const sortEntries = sort(alphabeticalOrder);
  const sortArticles = sort(ordArticle);

  const entries = toArray(list);

  return (
    <th.ul
      sx={{
        m: 0,
        fontFamily: "monospace",
        fontSize: fontSize.small,
        a: {
          wordWrap: "break-word",
        },
      }}
      {...rest}
    >
      {sortEntries(entries).map(([author, articles]) => (
        <th.li key={author}>
          {author}
          <th.ul>
            {sortArticles(articles).map((article, i) => {
              if (typeof article === "string") {
                return (
                  <th.li key={i} sx={{ my: 2 }}>
                    <th.a href={article}>
                      {article.replace(/^https:\/\/|\/$/g, "")}
                    </th.a>
                  </th.li>
                );
              }
              const [text, link, commentary] = article;
              return (
                <th.li
                  key={i}
                  sx={{
                    my: 2,
                    p: { fontSize: fontSize.small },
                  }}
                >
                  <th.a href={link}>{text}</th.a>
                  {commentary &&
                    (typeof commentary === "string" ? (
                      <th.p>{dedent(commentary)}</th.p>
                    ) : (
                      <div
                        sx={{
                          fontFamily: "text",
                          ul: { listStyle: "none", my: "1em" },
                        }}
                      >
                        <MDXProvider>{jsx(commentary)}</MDXProvider>
                      </div>
                    ))}
                </th.li>
              );
            })}
          </th.ul>
        </th.li>
      ))}
    </th.ul>
  );
};
