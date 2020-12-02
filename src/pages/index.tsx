/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import { jsx, Themed as th } from "theme-ui";

import { Intro, Outro } from "../features/index-page";
import { Seo } from "../features/seo/Seo";
import { theme } from "../gatsby-plugin-theme-ui/index";
import { PageLayout } from "../layouts/PageLayout";
import { IndexPageQuery } from "./__generated__/IndexPageQuery";

const IndexPage = () => {
  const { recent, favorites } = useStaticQuery<IndexPageQuery>(graphql`
    fragment PostTitleAndRoute on FileConnection {
      nodes {
        childMdx {
          parent {
            ... on File {
              sourceInstanceName
            }
          }
          frontmatter {
            title
            date
          }
          fields {
            route
          }
        }
      }
    }

    query IndexPageQuery {
      recent: allFile(
        filter: {
          sourceInstanceName: { eq: "posts" }
          childMdx: { frontmatter: { date: { ne: null } } }
        }
        sort: { fields: childMdx___frontmatter___date, order: DESC }
        limit: 1
      ) {
        ...PostTitleAndRoute
      }

      favorites: allFile(
        filter: {
          childMdx: {
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
        }
      ) {
        ...PostTitleAndRoute
      }
    }
  `);

  const recentPost = recent.nodes[0]?.childMdx;

  return (
    <PageLayout>
      <Seo titleTemplate="%s" />
      <main sx={{ mt: 6 }}>
        <Intro />
        {recentPost && (
          <p>
            My most recent post is{" "}
            <Link to={recentPost.fields!.route} sx={theme.styles.a}>
              "{recentPost.frontmatter!.title}"
            </Link>
            .
          </p>
        )}
        <section>
          <th.h4>Personal Favorites</th.h4>
          <th.ul>
            {favorites.nodes.map((post) => {
              const { fields, frontmatter } = post.childMdx!;

              return (
                <th.li key={fields!.route}>
                  <Link to={fields!.route} sx={theme.styles.a}>
                    {frontmatter!.title}
                  </Link>
                </th.li>
              );
            })}
          </th.ul>
        </section>
        <Outro />
      </main>
    </PageLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default IndexPage;
