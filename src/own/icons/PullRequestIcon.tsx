import type { JSX } from "solid-js";

import pullRequestSvg from "./git-pull-request.svg";

export function PullRequestIcon(
  props: JSX.ImgHTMLAttributes<HTMLImageElement>,
) {
  return <img src={pullRequestSvg.src} alt="" {...props} />;
}
