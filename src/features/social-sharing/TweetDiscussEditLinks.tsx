/** @jsx jsx */
import { graphql } from "gatsby";
import { jsx, Themed as th } from "theme-ui";

import type { TweetDiscussEditLinksDataOnMdxFragment } from "../../../graphql-types";

export type { TweetDiscussEditLinksDataOnMdxFragment };

export const TweetDiscussEditLinks = ({
  socialLinks,
}: TweetDiscussEditLinksDataOnMdxFragment) => {
  const { edit, tweet } = socialLinks;

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
