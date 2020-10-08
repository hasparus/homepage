/** @jsx jsx */
import { graphql } from "gatsby";
import { jsx, Styled as s } from "theme-ui";

import { TweetDiscussEditLinksData } from "../../lib/reusable-ui/__generated__/TweetDiscussEditLinksData";

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
