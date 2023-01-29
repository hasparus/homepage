import type { JSX } from "solid-js";

import { Link } from "../lib/Link";

export const CodesandboxIframe = (
  props: JSX.IframeHTMLAttributes<HTMLIFrameElement>
) => {
  return (
    <div class="flex items-center">
      <noscript>
        <p class="text-sm">
          You could enable JavaScript to see a CodeSandbox embed here but you
          don't have to.
          <br />
          <Link href="https://codesandbox.io/embed/github/hasparus/componentprops-omit-tagged-union-button/tree/master/?fontsize=14&hidenavigation=1&runonclick=1">
            Here's the link.
          </Link>
        </p>
      </noscript>
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe
        class="flex-shrink-0 w-[var(--wide-content-width)] h-[500px] lg:h-[700px] lg:my-4 border-none overflow-hidden"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        {...props}
      />
    </div>
  );
};
