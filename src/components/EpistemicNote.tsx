/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import { ComponentPropsWithoutRef } from "react";

import { panic } from "../utils";

type EpistemicNoteProps = ComponentPropsWithoutRef<typeof s.p> &
  ({ effort: true; status?: never } | { effort?: never; status: true });
export const EpistemicNote = ({
  children,
  effort: isEpistemicEffort,
  status: isEpistemicStatus,
  ...rest
}: EpistemicNoteProps) => {
  const type = isEpistemicEffort
    ? "Effort"
    : isEpistemicStatus
    ? "Status"
    : panic("impossible");

  return (
    <s.p
      sx={{
        bg: "muted",
        p: 2,
        fontSize: 0,
        width: "100%",
        fontStyle: "italic",
      }}
      {...rest}
    >
      Epistemic {type}: {children}
    </s.p>
  );
};
