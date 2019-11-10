/** @jsx jsx */
import { jsx } from "theme-ui";
import { ComponentProps } from "react";

export const CodesandboxIframe = (props: ComponentProps<"iframe">) => (
  // eslint-disable-next-line jsx-a11y/iframe-has-title
  <iframe
    sx={{
      width: "100%",
      height: "500px",
      border: 0,
      borderRadius: "4px",
      overflow: "hidden",
    }}
    allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
    sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    {...props}
  />
);
