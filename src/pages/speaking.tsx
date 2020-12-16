/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby";
import { jsx, Themed as th } from "theme-ui";

import { GetSpeakingRaportsQuery } from "../../graphql-types";
import { PostDetails } from "../features/blog/PostDetails";
import { PostsListItem } from "../features/blog/PostsListItem";
import { Seo } from "../features/seo/Seo";
import { PageLayout } from "../layouts/PageLayout";
import { ListPageHeading } from "../lib/reusable-ui/ListPageHeading";

const SpeakingPage = () => {
  const { allMdx } = useStaticQuery<GetSpeakingRaportsQuery>(graphql`
    query GetSpeakingRaports {
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
              link
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
    <PageLayout>
      <Seo title="speaking" />
      <ListPageHeading>Speaking</ListPageHeading>
      <main>
        {allMdx.nodes.map((node, i) => {
          const { frontmatter, fields } = node;
          const { title, spoiler, date, venues } = frontmatter || {};

          return (
            <PostsListItem key={i}>
              <PostsListItem.Header linkTo={fields!.route}>
                <PostsListItem.Heading title={title!} />
                <PostDetails date={date} venues={venues} />
              </PostsListItem.Header>
              <PostsListItem.Spoiler>{spoiler}</PostsListItem.Spoiler>
            </PostsListItem>
          );
        })}
      </main>
    </PageLayout>
  );
};

export default SpeakingPage;
