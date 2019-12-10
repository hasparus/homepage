/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import { ComponentProps } from "react";

import { fontSize } from "../gatsby-plugin-theme-ui";
import { EpistemicNote, CodesandboxIframe, ReadingList } from "../components";

// eslint-disable-next-line import/no-default-export
export default {
  Epistemic: EpistemicNote,
  CodesandboxIframe,
  ReadingList,

  figure: (props: ComponentProps<"figure">) => (
    <figure sx={{ margin: 0, "> pre": { mb: 2 } }} {...props} />
  ),
  figcaption: (props: ComponentProps<"figcaption">) => (
    <figcaption
      sx={{
        fontSize: fontSize.small,
        fontStyle: "italic",
        px: 3,
        "> p": { margin: 0 },
      }}
      {...props}
    />
  ),
};
