/** @jsx jsx */
import { graphql, useStaticQuery, Link } from "gatsby";
import { Styled as s, jsx } from "theme-ui";

import { theme } from "../components";
import { Seo } from "../components/Seo";
import { IndexPageQuery } from "./__generated__/IndexPageQuery";
import { PageLayout } from "../layouts/PageLayout";
import Intro from "../components/Intro";
import IndexOutro from "../components/IndexOutro";

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
    <PageLayout>
      <Seo titleTemplate="%s" />
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
        <IndexOutro />
      </main>
    </PageLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default IndexPage;
