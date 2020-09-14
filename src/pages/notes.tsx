/** @jsx jsx */

import { graphql, Link, useStaticQuery } from "gatsby";
import { jsx, Styled as s } from "theme-ui";

import { Seo } from "../features/seo/Seo";
import { theme } from "../gatsby-plugin-theme-ui";
import { PageLayout } from "../layouts/PageLayout";
import { NotesIndexQuery } from "./__generated__/NotesIndexQuery";

const NotesIndexPage = () => {
  const { allFile } = useStaticQuery<NotesIndexQuery>(graphql`
    query NotesIndexQuery {
      allFile(
        filter: {
          childMdx: { fields: { isHidden: { eq: false } } }
          sourceInstanceName: { eq: "notes" }
        }
      ) {
        nodes {
          fields {
            slug
            title
          }
          childMdx {
            fields {
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

  return (
    <PageLayout>
      <Seo title="notes" />
      <main sx={{ mt: 6 }}>
        <s.p>
          These are my notes — my{" "}
          <s.a href="https://foambubble.github.io/foam">Foam</s.a> workspace
          — which contains small markdown documents focused on one topic.
        </s.p>
        <s.p>I'll probably write a better intro one day.</s.p>
        <ul>
          {allFile.nodes.map((node, i) => {
            const { title } = node.fields!;
            const { route } = node.childMdx!.fields!;

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
