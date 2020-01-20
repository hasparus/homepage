/** @jsx jsx */
import { graphql, Link, useStaticQuery } from "gatsby";
import { Styled as s, jsx } from "theme-ui";

import { Header, Root, theme } from "../components";
import { PostDetails } from "../components/PostDetails";
import { Seo } from "../components/Seo";
import { Footer } from "../components/Footer";
import { IndexPageQuery } from "./__generated__/IndexPageQuery";

const IndexPage = () => {
  const { allMdx } = useStaticQuery<IndexPageQuery>(graphql`
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

  return (
    <Root>
      <Seo titleTemplate="%s" />
      <Header />
      <main sx={{ mt: 6 }}>
        <s.p>Hello there. I'm Piotr Monwid-Olechnowicz.</s.p>
        <s.p>
          I build software while listening to lo-fi and city pop. I like
          coffee, typed FP, tabletop RPG, and my fiancée, who didn't force
          me to write this. At all. I&nbsp;pride myself on my bad sense of
          humor.
        </s.p>
        <s.p>
          This is my personal space on the internet. I write blog posts,
          collect things that influenced me, and comment on them. I learn in
          public. Right here.
        </s.p>
        {/* TODO: My favorite posts */}
      </main>
      <Footer />
    </Root>
  );
};

// eslint-disable-next-line import/no-default-export
export default IndexPage;
