import { graphql } from "gatsby";

export const fragments = graphql`
  fragment TweetDiscussEditLinksDataOnSitePage on SitePage {
    socialLinks {
      # discuss # I'm not popular enough for the search result to be interesting
      edit
      tweet
    }
  }
  fragment TweetDiscussEditLinksDataOnMdx on Mdx {
    socialLinks {
      edit
      tweet
    }
  }
`;
