/** @jsx jsx */
import { graphql } from "gatsby";
import { jsx, Themed as th } from "theme-ui";

import type { TweetDiscussEditLinksDataOnMdx } from "./__generated__/TweetDiscussEditLinksDataOnMdx";

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
      <th.a href={tweet}>tweet</th.a> &middot;{" "}
      <th.a href={edit}>edit on github</th.a>
    </footer>
  );
};
