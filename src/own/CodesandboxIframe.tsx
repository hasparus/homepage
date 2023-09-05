import { createSignal, type JSX, Match, Show, Switch } from "solid-js";

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
      <div class="relative h-[500px] w-[var(--wide-content-width)] flex-shrink-0 lg:my-4 lg:h-[700px] ">
        <Switch>
          <Match when={state() === "idle"}>
            <div class="absolute inset-0 flex items-center justify-center gap-3 rounded-sm bg-gray-100/50 dark:bg-gray-800/25">
              <button
                class="rounded-md bg-gray-200/50 p-2 px-3 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50"
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
            <div class="absolute inset-0 flex cursor-progress items-center justify-center bg-gray-800/25">
              <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-700" />
            </div>
          </Match>
        </Switch>
        <Show when={state() !== "idle"}>
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <iframe
            class="absolute inset-0 h-full w-full overflow-hidden border-none"
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
