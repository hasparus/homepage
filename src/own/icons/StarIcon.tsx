import type { JSX } from "solid-js";

import starSvg from "./star-fill.svg";

export function StarIcon(props: JSX.ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={starSvg.src} alt="" {...props} />;
}
