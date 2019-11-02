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
        filter: { fields: { isHidden: { ne: true } } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
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
      <Seo titleTemplate="%s" />
      <Header />
      <s.h1 sx={{ mt: 3, mb: 4 }}>haspar.us</s.h1>
      <s.p>
        Howdy! I'm Piotr Monwid-Olechnowicz and this is my personal blog.
      </s.p>
      <main>
        {allMdx.nodes.map((node, i) => {
          const { timeToRead, frontmatter, fields } = node!;
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
                  {/* I'm not exactly sure that it's always a file */}
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
                <BlogpostDetails date={date} timeToRead={timeToRead!} />
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
