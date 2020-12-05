/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import { jsx, Themed as th } from "theme-ui";

import { Intro, Outro } from "../features/index-page";
import { Seo } from "../features/seo/Seo";
import { theme } from "../gatsby-plugin-theme-ui/index";
import { PageLayout } from "../layouts/PageLayout";

const IndexPage = () => {
  const { favorites } = useStaticQuery<any>(graphql`
    fragment PostTitleAndRoute on FileConnection {
      nodes {
        childMdx {
          parent {
            ... on File {
              sourceInstanceName
            }
          }
          frontmatter {
            date
            title
          }
          fields {
            route
            title
          }
        }
      }
    }

    query IndexPageQuery {
      favorites: allFile(
        filter: {
          childMdx: {
            fields: {
              route: {
                in: [
                  "/refinement-types"
                  "/notes/advent-of-code-2020/day-1-report-repair"
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

  return (
    <PageLayout>
      <Seo titleTemplate="%s" />
      <main sx={{ mt: 6 }}>
        <Intro />
        <section>
          <th.h4>Personal Favorites</th.h4>
          <th.ul>
            {/* jesus gatsby codegen is terrible */}
            {favorites.nodes.map((post: any) => {
              const { fields, frontmatter } = post.childMdx!;

              return (
                <th.li key={fields!.route}>
                  <Link to={fields!.route} sx={theme.styles.a}>
                    {frontmatter!.title || fields!.title}
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
