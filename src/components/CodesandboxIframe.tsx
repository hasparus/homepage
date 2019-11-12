/** @jsx jsx */
import { jsx } from "theme-ui";
import { ComponentProps } from "react";

export const CodesandboxIframe = (props: ComponentProps<"iframe">) => (
  <div
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
    <iframe
      sx={{
        flexShrink: 0,
        width: ["100%", "100%", "120%"],
        my: [0, 0, "1em"],
        maxWidth: "100vw",
        height: ["500px", "500px", "600px"],
        border: 0,
        borderRadius: "4px",
        overflow: "hidden",
      }}
      allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      {...props}
    />
  </div>
);
