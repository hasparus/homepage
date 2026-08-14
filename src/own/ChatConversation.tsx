import type { ImageMetadata } from "astro";
import { type JSX, Show } from "solid-js";

export interface ChatConversationProps {
  children: JSX.Element;
  /** Screenshot of the real thing, stacked under the transcript. */
  original?: ImageMetadata;
}

export function ChatConversation(props: ChatConversationProps) {
  const transcript = (
    <div class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-[0.9375rem] shadow-md dark:border-gray-800 dark:bg-gray-950 [&>*:has([data-quoted])+*]:-mt-[calc(--spacing(3)+4px)]">
      {props.children}
    </div>
  );

  return (
    <Show
      when={props.original}
      keyed
      fallback={<div class="my-8 max-w-md">{transcript}</div>}
    >
      {(original) => {
        const inputId = `chat-${original.src.replaceAll(/[^a-z0-9]+/gi, "-")}`;

        return (
          <div class="group my-8 grid max-w-md pr-16">
            <input id={inputId} type="checkbox" class="peer sr-only" />
            <div class="z-10 col-start-1 row-start-1 transition-[transform,translate,scale,rotate,opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] peer-checked:z-0 peer-checked:-translate-x-5 peer-checked:scale-95 peer-checked:-rotate-3 peer-checked:opacity-50 peer-checked:blur-[2px] motion-reduce:transition-none peer-checked:pointer-fine:group-hover:-translate-x-8">
              {transcript}
            </div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              for={inputId}
              class="z-0 col-start-1 row-start-1 my-auto translate-x-8 rotate-6 cursor-pointer transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] peer-checked:z-20 peer-checked:translate-x-0 peer-checked:rotate-0 peer-focus-visible:outline peer-focus-visible:outline-offset-4 active:scale-[0.97] motion-reduce:transition-none pointer-fine:group-hover:translate-x-16 pointer-fine:group-hover:rotate-8 peer-checked:pointer-fine:group-hover:translate-x-0 peer-checked:pointer-fine:group-hover:rotate-0"
            >
              <span class="sr-only">show the original screenshot</span>
              <img
                src={original.src}
                width={original.width}
                height={original.height}
                alt=""
                loading="lazy"
                decoding="async"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 shadow-md dark:border-gray-800 dark:bg-gray-950 dark:opacity-80 dark:backdrop-blur-lg"
              />
            </label>
          </div>
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
        "mt-auto grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300": true,
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
    <div class="relative flex max-w-[85%] flex-col items-start gap-0.5 group-data-[align=end]:items-end">
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
    <span class="absolute right-0 bottom-0 translate-y-1/2 rounded-full bg-white p-0.5 text-center text-xs shadow-sm dark:bg-gray-900">
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
      class="rounded-2xl bg-gray-100 text-gray-900 group-data-[align=end]:bg-gray-900 group-data-[align=end]:text-gray-50 data-[quoted]:rounded-l-sm data-[quoted]:border-l-2 data-[quoted]:border-gray-300 data-[quoted]:bg-gray-50 data-[quoted]:text-sm data-[quoted]:text-gray-600 data-[quoted]:italic dark:bg-gray-800 dark:text-gray-100 dark:group-data-[align=end]:bg-gray-200 dark:group-data-[align=end]:text-gray-900 dark:data-[quoted]:border-gray-600 dark:data-[quoted]:bg-gray-900 dark:data-[quoted]:text-gray-300"
    >
      {props.children}
    </div>
  );
}

export function BubbleContent(props: { children: JSX.Element }) {
  return <div class="px-4 py-2">{props.children}</div>;
}
