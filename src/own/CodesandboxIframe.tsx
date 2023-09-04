import { type JSX, createSignal, Match, Show, Switch } from "solid-js";

import { Link } from "../lib/Link";

export const CodesandboxIframe = (
  props: JSX.IframeHTMLAttributes<HTMLIFrameElement>,
) => {
  const [state, setState] = createSignal<"idle" | "loading" | "loaded">(
    props.src?.includes("runonclick=1") ? "loading" : "idle",
  );

  return (
    <div class="zaduma-image-box flex items-center">
      <noscript>
        <p class="text-sm">
          You could enable JavaScript to see a CodeSandbox embed here but you
          don't have to.
          <br />
          <Link href={props.src || ""}>Here's the link.</Link>
        </p>
      </noscript>
      <div class="relative flex-shrink-0 w-[var(--wide-content-width)] h-[500px] lg:h-[700px] lg:my-4 ">
        <Switch>
          <Match when={state() === "idle"}>
            <div class="bg-gray-800/25 absolute inset-0 flex gap-3 items-center justify-center cursor-pointer hover:[&>button]:bg-gray-700/50">
              <button
                class="bg-gray-800 p-2 px-3 rounded-md transition-colors text-gray-700 dark:text-gray-300"
                disabled={state() === "loading"}
                onClick={() => setState("loading")}
              >
                Load CodeSandbox
              </button>
              <Link
                href={props.src || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to CodeSandbox
              </Link>
            </div>
          </Match>
          <Match when={state() === "loading"}>
            <div class="bg-gray-800/25 absolute inset-0 flex items-center justify-center cursor-progress">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700" />
            </div>
          </Match>
        </Switch>
        <Show when={state() !== "idle"}>
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <iframe
            class="border-none overflow-hidden absolute inset-0 w-full h-full"
            allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
            style={{
              opacity: state() === "loaded" ? 1 : 0,
              transition: "opacity 1s 1s linear",
            }}
            onLoad={() => setState("loaded")}
            {...props}
          />
        </Show>
      </div>
    </div>
  );
};
