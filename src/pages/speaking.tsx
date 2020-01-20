/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby";
import { Styled as s, jsx } from "theme-ui";

import { SpeakingRaportsQuery } from "./__generated__/SpeakingRaportsQuery";
import { Header, Root } from "../components";
import { PostDetails } from "../components/PostDetails";
import { Seo } from "../components/Seo";
import { Footer } from "../components/Footer";
import { PostsListItem } from "../components/PostsListItem";

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
      <Seo title="speaking" />
      <Header />
      <s.h1 sx={{ mb: [0, 2], mt: [0, 4] }}>Speaking</s.h1>
      {/* TODO: A paragraph of description? */}
      <main>
        {allMdx.nodes.map((node, i) => {
          const { frontmatter, fields } = node!;
          const { title, spoiler, date, venues } = frontmatter || {};

          return (
            <PostsListItem key={i}>
              <PostsListItem.Header>
                <PostsListItem.Heading title={title!} fields={fields!} />
                <PostDetails date={date} venues={venues} />
              </PostsListItem.Header>
              <PostsListItem.Spoiler>{spoiler}</PostsListItem.Spoiler>
            </PostsListItem>
          );
        })}
      </main>
      <Footer />
    </Root>
  );
};

// eslint-disable-next-line import/no-default-export
export default SpeakingPage;
