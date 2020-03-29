/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import { graphql } from "gatsby";
import { TweetDiscussEditLinksData } from "./__generated__/TweetDiscussEditLinksData";

export const TweetDiscussEditLinks = ({
  socialLinks,
}: TweetDiscussEditLinksData) => {
  const { edit, tweet } = socialLinks!;

  return (
    <footer
      sx={{
        pt: 4,
        "@media print": {
          display: "none",
        },
      }}
    >
      <s.a href={tweet}>tweet</s.a> &middot;{" "}
      <s.a href={edit}>edit on github</s.a>
    </footer>
  );
};

export const query = graphql`
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
