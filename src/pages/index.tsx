/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import { Styled, jsx, SxProps } from "theme-ui";

import { BlogPostsQuery } from "./__generated__/BlogPostsQuery";

const Index = () => {
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
    <Styled.root>
      <Styled.h1>Hello world!</Styled.h1>
      <Styled.p>Lorem ipsum dolor sit amet</Styled.p>
      <ol>
        {allMdx.nodes.map((node, i) => {
          const { timeToRead, frontmatter, fields } = node!;

          return (
            <article key={i}>
              <header>
                {/* I'm not exactly sure that it's always a file */}
                <Link to={fields!.route!}>
                  <strong>{frontmatter!.title}</strong>
                </Link>
                <small sx={{ fontSize: 0 }}>
                  {frontmatter!.date} · {timeToRead!} min read
                </small>
              </header>
            </article>
          );
        })}
      </ol>
    </Styled.root>
  );
};

export default Index;
