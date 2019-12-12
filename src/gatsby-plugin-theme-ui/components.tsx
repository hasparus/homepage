/** @jsx jsx */
import { jsx } from "theme-ui";
import { ComponentProps } from "react";

import { fontSize } from "../gatsby-plugin-theme-ui";
import { EpistemicNote, CodesandboxIframe } from "../components";

// eslint-disable-next-line import/no-default-export
export default {
  Epistemic: EpistemicNote,
  CodesandboxIframe,
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
