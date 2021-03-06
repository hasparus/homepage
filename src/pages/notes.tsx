/** @jsx jsx */

import { graphql, Link, useStaticQuery } from "gatsby";
import { jsx, Themed as th } from "theme-ui";

import { GetNotesIndexQuery } from "../../graphql-types";
import { GraphOverview } from "../features/brain-notes/gatsby-theme-notes-brain/components";
import { Seo } from "../features/seo/Seo";
import { theme } from "../gatsby-plugin-theme-ui";
import { PageLayout } from "../layouts/PageLayout";

const NotesIndexPage = () => {
  const { allFile } = useStaticQuery<GetNotesIndexQuery>(graphql`
    query GetNotesIndex {
      allFile(
        filter: {
          childMdx: { fields: { isHidden: { eq: false } } }
          sourceInstanceName: { eq: "notes" }
        }
        sort: { order: ASC, fields: childMdx___slug }
      ) {
        nodes {
          childMdx {
            fields {
              title
              route
              history {
                entries {
                  subject
                  authorDate
                  abbreviatedCommit
                }
                url
              }
              socialImage {
                childImageSharp {
                  original {
                    width
                    height
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  const nodes = [...allFile.nodes];
  type Node = typeof nodes[number];

  return (
    <PageLayout>
      <Seo title="notes" />
      <main sx={{ mt: 6 }}>
        <th.p>
          These are my notes — short pieces of markdown focused on one
          topic, connected together with bidirectional links. They're all
          work-in-progress and unfinished, and that's okay. You can get a
          sneak peek of my thoughts 😉
        </th.p>
        <th.p>Enjoy the adventure!</th.p>
        <GraphOverview />
        <th.p>All entries alphabetically:</th.p>
        <ul>
          {nodes
            // https://github.com/gatsbyjs/gatsby/issues/11368
            // todo: sort in graphql query after 11368 is fixed
            .sort((a: Node, b: Node) =>
              a.childMdx!.fields!.title! > b.childMdx!.fields!.title!
                ? 1
                : -1
            )
            .map((node: Node, i) => {
              const { title, route } = node.childMdx!.fields!;

              return (
                <li key={i}>
                  <Link sx={theme.styles.a} to={route}>
                    {title}
                  </Link>
                </li>
              );
            })}
        </ul>
      </main>
    </PageLayout>
  );
};

export default NotesIndexPage;
