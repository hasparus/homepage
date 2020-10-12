/** @jsx jsx */
import { graphql } from "gatsby";
import { jsx, Styled as s } from "theme-ui";

import { TweetDiscussEditLinksDataOnMdx } from "./__generated__/TweetDiscussEditLinksDataOnMdx";

export type { TweetDiscussEditLinksDataOnMdx };

export const TweetDiscussEditLinks = ({
  socialLinks,
}: TweetDiscussEditLinksDataOnMdx) => {
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
