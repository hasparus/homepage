/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import { Styled as s, jsx } from "theme-ui";

import { BlogPostsQuery } from "./__generated__/BlogPostsQuery";
import { Header, Root, theme } from "../components";
import { BlogpostDetails } from "../components/BlogpostDetails";
import { Seo } from "../components/Seo";

const IndexPage = () => {
  const { allMdx } = useStaticQuery<BlogPostsQuery>(graphql`
    query BlogPostsQuery {
      allMdx(
        filter: { fields: { isHidden: { ne: true }, route: { glob: "/*" } } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        nodes {
          frontmatter {
            title
            spoiler
            date
          }
          fields {
            route
            readingTime
          }
        }
      }
    }
  `);

  return (
    <Root>
      <Seo titleTemplate="%s" />
      <Header />
      <s.h1 sx={{ mb: [0, 2], mt: [0, 4] }}>haspar.us</s.h1>
      <s.p>
        Howdy! I'm Piotr Monwid-Olechnowicz and this is my personal blog.
      </s.p>
      <main>
        {allMdx.nodes.map((node, i) => {
          const { frontmatter, fields } = node!;
          const { title, spoiler, date } = frontmatter || {};

          return (
            <article key={i}>
              <header>
                <s.h3
                  sx={{
                    marginBottom: "0.4375rem",
                    marginTop: "3rem",
                    color: "text",
                  }}
                >
                  <Link
                    to={fields!.route!}
                    sx={{
                      ...theme.styles.a,
                      color: "currentColor",
                    }}
                  >
                    {title}
                  </Link>
                </s.h3>
                <BlogpostDetails
                  date={date}
                  readingTime={fields!.readingTime}
                />
              </header>
              <s.p sx={{ mt: 1 }}>{spoiler}</s.p>
            </article>
          );
        })}
      </main>
    </Root>
  );
};

// eslint-disable-next-line import/no-default-export
export default IndexPage;
