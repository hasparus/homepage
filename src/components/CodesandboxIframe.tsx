/** @jsx jsx */
import { jsx } from "theme-ui";
import { ComponentProps } from "react";

export const CodesandboxIframe = ({
  className,
  ...rest
}: ComponentProps<"iframe">) => (
  <div
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <noscript>
      <p sx={{ fontSize: [0, 1], bg: "muted", p: 2 }}>
        You could enable JavaScript to see a CodeSandbox embed here but you
        don't have to.
        <br />
        <a
          sx={{ fontWeight: "bold" }}
          href="https://codesandbox.io/embed/github/hasparus/componentprops-omit-tagged-union-button/tree/master/?fontsize=14&hidenavigation=1&runonclick=1"
        >
          Here's the link.
        </a>
      </p>
    </noscript>
    {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
    <iframe
      sx={{
        flexShrink: 0,
        width: ["100%", "100%", "180%"],
        my: [0, 0, "1em"],
        maxWidth: "100vw",
        height: ["500px", "500px", "700px"],
        border: 0,
        borderRadius: "4px",
        overflow: "hidden",
      }}
      className={`js-only ${className}`}
      allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      {...rest}
    />
  </div>
);
