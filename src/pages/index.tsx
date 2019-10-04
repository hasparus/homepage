/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import { Styled as s, jsx } from "theme-ui";

import { BlogPostsQuery } from "./__generated__/BlogPostsQuery";
import { Root } from "../ui";

const IndexPage = () => {
  const { allMdx } = useStaticQuery<BlogPostsQuery>(graphql`
    query BlogPostsQuery {
      allMdx {
        nodes {
          timeToRead
          frontmatter {
            title
            spoiler
            date
          }
          fields {
            route
          }
        }
      }
    }
  `);

  return (
    <Root>
      <s.h1>Hello world!</s.h1>
      <s.p>Lorem ipsum dolor sit amet</s.p>
      <main>
        {allMdx.nodes.map((node, i) => {
          const { timeToRead, frontmatter, fields } = node!;
          const { date, title } = frontmatter || {};

          return (
            <article key={i}>
              <header>
                <s.h3 sx={{ marginBottom: "0.4375rem" }}>
                  {/* I'm not exactly sure that it's always a file */}
                  <Link to={fields!.route!} sx={{ textDecoration: "none" }}>
                    {title}
                  </Link>
                </s.h3>
                <small sx={{ fontSize: 0, display: "block" }}>
                  {date &&
                    new Date(date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                  · {timeToRead!} min read
                </small>
              </header>
            </article>
          );
        })}
      </main>
    </Root>
  );
};

export default IndexPage;
