/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import { toArray } from "fp-ts/lib/Record";
import { fromCompare, ordString } from "fp-ts/lib/Ord";
import { ComponentPropsWithoutRef } from "react";
import { sort } from "fp-ts/lib/Array";

import { ReadingList as Reading } from "../../content/assets/reading";

interface ReadingListProps extends ComponentPropsWithoutRef<"ul"> {
  list: Reading;
}
export const ReadingList = ({ list, ...rest }: ReadingListProps) => {
  const alphabeticalOrder = fromCompare<[string, Reading.Article[]]>((a, b) =>
    ordString.compare(a[0].toLowerCase(), b[0].toLowerCase())
  );
  const first = (x: Reading.Article) => (typeof x === "string" ? x : x[0]);
  const ordArticle = fromCompare<Reading.Article>((a, b) =>
    ordString.compare(first(a), first(b))
  );

  const sortEntries = sort(alphabeticalOrder);
  const sortArticles = sort(ordArticle);

  const entries = toArray(list);

  return (
    <s.ul
      sx={{
        m: 0,
        fontFamily: "monospace",
        a: {
          wordWrap: "break-word",
        },
      }}
      {...rest}
    >
      {sortEntries(entries).map(([author, articles]) => (
        <s.li key={author}>
          {author}
          <s.ul>
            {sortArticles(articles).map((article, i) => {
              if (typeof article === "string") {
                return (
                  <s.li key={i}>
                    <s.a href={article}>
                      {article.replace(/^https:\/\/|\/$/g, "")}
                    </s.a>
                  </s.li>
                );
              }
              const [text, link, commentary] = article;

              return (
                <s.li key={i}>
                  <s.a href={link}>{text}</s.a>
                  {commentary && <s.p sx={{ mt: 0, mb: 2 }}>{commentary}</s.p>}
                </s.li>
              );
            })}
          </s.ul>
        </s.li>
      ))}
    </s.ul>
  );
};
