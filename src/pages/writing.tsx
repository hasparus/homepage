/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby";
import { jsx, Themed as th } from "theme-ui";

import { GetBlogPostDataQuery } from "../../graphql-types";
import { PostDetails } from "../features/blog/PostDetails";
import { PostsListItem } from "../features/blog/PostsListItem";
import { Seo } from "../features/seo/Seo";
import { PageLayout } from "../layouts/PageLayout";
import { ListPageHeading } from "../lib/reusable-ui/ListPageHeading";

const WritingPage = () => {
  const { allMdx } = useStaticQuery<GetBlogPostDataQuery>(graphql`
    query GetBlogPostData {
      allMdx(
        filter: {
          fields: { isHidden: { ne: true }, route: { glob: "/*" } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        nodes {
          frontmatter {
            title
            spoiler
            date
          }
          fields {
            route
            readingTime
          }
        }
      }
    }
  `);

  return (
    <PageLayout>
      <Seo title="writing" />
      <ListPageHeading>Writing</ListPageHeading>
      <main>
        {allMdx.nodes.map((node, i) => {
          const { frontmatter, fields } = node;
          const { title, spoiler, date } = frontmatter || {};

          return (
            <PostsListItem key={i}>
              <PostsListItem.Header linkTo={fields!.route}>
                <PostsListItem.Heading title={title!} />
                <PostDetails
                  date={date}
                  readingTime={fields!.readingTime}
                />
              </PostsListItem.Header>
              <PostsListItem.Spoiler>{spoiler}</PostsListItem.Spoiler>
            </PostsListItem>
          );
        })}
      </main>
    </PageLayout>
  );
};

export default WritingPage;
