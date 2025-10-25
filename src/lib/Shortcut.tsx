import type { JSX } from "solid-js";
import { For, splitProps } from "solid-js";

import { isMac } from "./isMac";
import { Kbd } from "./Kbd";

export interface ShortcutProps extends JSX.HTMLAttributes<HTMLElement> {
  shortcut: string;
  isMac?: boolean;
}

export function Shortcut(props: ShortcutProps) {
  const [local, rest] = splitProps(props, [
    "shortcut",
    "class",
    "classList",
    "isMac",
  ]);
  // This component cannot be used on serverside;
  const IS_MAC = local.isMac || (typeof window !== "undefined" && isMac());

  return (
    <span
      {...rest}
      class={local.class}
      classList={{
        ...local.classList,
        "inline-flex gap-px": true,
      }}
    >
      <For each={local.shortcut.split("+")}>
        {(key) => {
          let style = "";

          if (!IS_MAC && key === "cmd") {
            key = "ctrl";
          } else if (key === "shift") {
            style = "font-family: Inter";
            key = "⇧";
          } else if (key === "slash") {
            key = "/";
          }

          return <Kbd style={style}>{key}</Kbd>;
        }}
      </For>
    </span>
  );
}
