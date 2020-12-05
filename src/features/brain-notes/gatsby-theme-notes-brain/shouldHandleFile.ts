import { buildTime } from "../../../lib/build-time/gatsby-node-utils";
import { NotesBrainThemeOptions } from "./parseOptions";
import { MdxFile } from "./types";

interface Node extends Pick<buildTime.File, "ext" | "sourceInstanceName"> {
  internal: {
    mediaType?: buildTime.File["internal"]["mediaType"];
  };
}

export function shouldHandleFile(
  node: Node,
  { extensions, mediaTypes, contentPath }: NotesBrainThemeOptions.Parsed
): node is MdxFile {
  return (
    (extensions.includes(node.ext!) ||
      mediaTypes.includes(node.internal.mediaType!)) &&
    node.sourceInstanceName === contentPath
  );
}
