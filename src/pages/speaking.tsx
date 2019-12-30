/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import { Styled as s, jsx } from "theme-ui";

import { SpeakingRaportsQuery } from "./__generated__/SpeakingRaportsQuery";
import { Header, Root, theme } from "../components";
import { BlogpostDetails } from "../components/BlogpostDetails";
import { Seo } from "../components/Seo";
import { Footer } from "../components/Footer";

const SpeakingPage = () => {
  const { allMdx } = useStaticQuery<SpeakingRaportsQuery>(graphql`
    query SpeakingRaportsQuery {
      allMdx(
        filter: {
          fields: { isHidden: { ne: true }, route: { glob: "/speaking/*" } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        nodes {
          frontmatter {
            title
            spoiler
            date
            venues {
              name
            }
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
      <Header showHome />
      <s.h1 sx={{ mb: [0, 2], mt: [0, 4] }}>Speaking</s.h1>
      <main>
        {allMdx.nodes.map((node, i) => {
          const { frontmatter, fields } = node!;
          const { title, spoiler, date, venues } = frontmatter || {};

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
                <BlogpostDetails date={date} venues={venues} />
              </header>
              <s.p sx={{ mt: 1 }}>{spoiler}</s.p>
            </article>
          );
        })}
      </main>
      <Footer />
    </Root>
  );
};

// eslint-disable-next-line import/no-default-export
export default SpeakingPage;
