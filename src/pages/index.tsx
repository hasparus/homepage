/** @jsx jsx */
import { graphql, useStaticQuery, Link } from "gatsby";
import { Styled as s, jsx } from "theme-ui";

import { Header, Root, theme } from "../components";
import { Seo } from "../components/Seo";
import { Footer } from "../components/Footer";
import { IndexPageQuery } from "./__generated__/IndexPageQuery";
import Intro from "../components/Intro";

const IndexPage = () => {
  const { recent, favorites } = useStaticQuery<IndexPageQuery>(graphql`
    fragment PostTitleAndRoute on MdxConnection {
      nodes {
        frontmatter {
          title
        }
        fields {
          route
        }
      }
    }

    query IndexPageQuery {
      recent: allMdx(
        sort: { fields: frontmatter___date, order: DESC }
        limit: 1
      ) {
        ...PostTitleAndRoute
      }

      favorites: allMdx(
        filter: {
          fields: {
            route: {
              in: [
                "/refinement-types"
                "/deliver"
                "/you-deserve-more-than-proptypes"
              ]
            }
          }
        }
      ) {
        ...PostTitleAndRoute
      }
    }
  `);

  const recentPost = recent.nodes[0];

  return (
    <Root>
      <Seo titleTemplate="%s" />
      <Header />
      <main sx={{ mt: 6 }}>
        <Intro />
        <p>
          My most recent post is{" "}
          <Link to={recentPost.fields!.route} sx={theme.styles.a}>
            "{recentPost.frontmatter!.title}"
          </Link>
          .
        </p>
        <section>
          <s.h4>Personal Favorites</s.h4>
          <s.ul>
            {favorites.nodes.map(post => (
              <s.li key={post.fields!.route}>
                <Link to={post.fields!.route} sx={theme.styles.a}>
                  {post.frontmatter!.title}
                </Link>
              </s.li>
            ))}
          </s.ul>
        </section>
        <s.p>
          I gave a few talks.{" "}
          <Link sx={theme.styles.a} to="/speaking/matryoshka-code">
            Matryoshka Code rant
          </Link>{" "}
          is probably the best one.
        </s.p>
      </main>
      <Footer />
    </Root>
  );
};

// eslint-disable-next-line import/no-default-export
export default IndexPage;
