import type { ImageMetadata } from "astro";
import { type JSX, Show } from "solid-js";

export interface ChatConversationProps {
  children: JSX.Element;
  /** Screenshot of the real thing, stacked under the transcript. */
  original?: ImageMetadata;
  classList?: Record<string, boolean>;
}

export function ChatConversation(props: ChatConversationProps) {
  const transcript = (
    <div class="flex flex-col gap-3 rounded-xl bg-white p-4 text-[0.9375rem] shadow-md ring ring-black/4 dark:bg-gray-950 dark:ring-white/5 [&>*:has([data-quoted])+*]:-mt-[calc(--spacing(3)+4px)]">
      {props.children}
    </div>
  );

  return (
    <Show
      when={props.original}
      keyed
      fallback={<div class="max-w-md">{transcript}</div>}
    >
      {(original) => {
        const inputId = `chat-${original.src.replaceAll(/[^a-z0-9]+/gi, "-")}`;

        return (
          <label
            class="group grid max-w-md cursor-pointer pr-16"
            classList={props.classList}
          >
            <input id={inputId} type="checkbox" class="peer sr-only" />
            <div class="z-10 col-start-1 row-start-1 transition-[transform,translate,scale,rotate,opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] select-none group-hover:-translate-x-4 peer-checked:z-0 peer-checked:-translate-x-5 peer-checked:scale-95 peer-checked:-rotate-3 peer-checked:opacity-65 motion-reduce:transition-none group-hover:pointer-fine:group-hover:-rotate-2 peer-checked:pointer-fine:group-hover:-translate-x-8 peer-checked:pointer-fine:group-hover:-rotate-4 [&_p]:leading-snug!">
              {transcript}
            </div>
            <div class="z-0 col-start-1 row-start-1 my-auto translate-x-8 rotate-6 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] peer-checked:z-20 peer-checked:translate-x-0 peer-checked:rotate-0 peer-focus-visible:outline peer-focus-visible:outline-offset-4 active:scale-[0.97] motion-reduce:transition-none dark:backdrop-blur-xs pointer-fine:group-hover:translate-x-16 pointer-fine:group-hover:rotate-8 peer-checked:pointer-fine:group-hover:translate-x-8 peer-checked:pointer-fine:group-hover:rotate-2">
              <span class="sr-only">show the original screenshot</span>
              <img
                src={original.src}
                width={original.width}
                height={original.height}
                alt=""
                loading="lazy"
                decoding="async"
                class="w-full rounded-xl bg-gray-50 shadow-md ring ring-black/4 dark:bg-gray-950 dark:opacity-80 dark:ring-white/5"
              />
            </div>
          </label>
        );
      }}
    </Show>
  );
}

/** Consecutive messages from the same sender. */
export function MessageGroup(props: { children: JSX.Element; class?: string }) {
  return (
    <div class={props.class} classList={{ "flex flex-col gap-1": true }}>
      {props.children}
    </div>
  );
}

export interface MessageProps {
  align?: "end" | "start";
  children: JSX.Element;
  class?: string;
}

export function Message(props: MessageProps) {
  return (
    <div
      data-align={props.align ?? "start"}
      class={props.class}
      classList={{ "group flex gap-2 data-[align=end]:flex-row-reverse": true }}
    >
      {props.children}
    </div>
  );
}

export interface MessageAvatarProps {
  alt?: string;
  children?: JSX.Element;
  class?: string;
  src?: string;
}

export function MessageAvatar(props: MessageAvatarProps) {
  return (
    <span
      class={props.class}
      classList={{
        "mt-auto grid size-8 shrink-0 place-items-center overflow-hidden rounded-full text-xs text-gray-600 dark:from-gray-700 dark:to-gray-800 bg-linear-to-b from-gray-200 to-gray-200/40 dark:text-gray-300": true,
      }}
    >
      {props.src ? (
        <img
          src={props.src}
          alt={props.alt ?? ""}
          loading="lazy"
          class="size-full object-cover"
        />
      ) : (
        props.children
      )}
    </span>
  );
}

export function MessageContent(props: { children: JSX.Element }) {
  return (
    <div class="relative flex max-w-[85%] flex-col items-start gap-1 group-data-[align=end]:items-end">
      {props.children}
    </div>
  );
}

export function MessageHeader(props: { children: JSX.Element }) {
  return (
    <span class="px-1 text-xs text-gray-500 dark:text-gray-400">
      {props.children}
    </span>
  );
}

export function MessageFooter(props: { children: JSX.Element }) {
  return (
    <span class="absolute right-0 bottom-0 translate-y-1/2 rounded-full bg-linear-to-br from-gray-50 to-gray-200/70 px-1 text-center text-sm ring-2 ring-white ring-offset-1 dark:from-gray-900 dark:to-gray-800/70 dark:ring-gray-950 dark:ring-offset-white/10">
      {props.children}
    </span>
  );
}

export interface BubbleProps {
  children: JSX.Element;
  /** A screenshot of someone else's chat, forwarded into this one. */
  quoted?: boolean;
}

export function Bubble(props: BubbleProps) {
  return (
    <div
      data-quoted={props.quoted ? "" : undefined}
      class="rounded-2xl bg-gray-50 text-gray-900 ring ring-black/4 group-data-[align=end]:bg-gray-900 group-data-[align=end]:text-gray-50 data-quoted:font-serif data-quoted:text-sm data-quoted:text-gray-600 data-quoted:italic dark:bg-gray-800 dark:text-gray-100 dark:group-data-[align=end]:bg-gray-200 dark:group-data-[align=end]:text-gray-900 dark:data-quoted:border-gray-600 dark:data-quoted:bg-gray-900 dark:data-quoted:text-gray-300"
    >
      {props.children}
    </div>
  );
}

export function BubbleContent(props: { children: JSX.Element }) {
  return <div class="px-4 py-2">{props.children}</div>;
}
