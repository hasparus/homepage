/** @jsx jsx */
import { graphql, useStaticQuery } from "gatsby";
import { jsx, Styled as s } from "theme-ui";

import { PostDetails } from "../features/blog/PostDetails";
import { PostsListItem } from "../features/blog/PostsListItem";
import { Seo } from "../features/seo/Seo";
import { PageLayout } from "../layouts/PageLayout";
import { BlogPostsQuery } from "./__generated__/BlogPostsQuery";

const WritingPage = () => {
  const { allMdx } = useStaticQuery<BlogPostsQuery>(graphql`
    query BlogPostsQuery {
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
      <s.h1 sx={{ mb: [0, 2], mt: [0, 5] }}>Writing</s.h1>
      <main>
        {allMdx.nodes.map((node, i) => {
          const { frontmatter, fields } = node!;
          const { title, spoiler, date } = frontmatter || {};

          return (
            <PostsListItem key={i}>
              <PostsListItem.Header>
                <PostsListItem.Heading title={title!} fields={fields!} />
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
