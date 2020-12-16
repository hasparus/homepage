/** @jsx jsx */
import { jsx } from "theme-ui";

import { panic } from "../util";

import { BoxedText, BoxedTextProps } from "./BoxedText";

type EpistemicNoteProps = BoxedTextProps &
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
    <BoxedText sx={{ "> p": { display: "inline" } }} {...rest}>
      Epistemic {type}: {children}
    </BoxedText>
  );
};
