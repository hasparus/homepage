import { type JSX, Show } from "solid-js";

export interface ChatConversationProps {
  children: JSX.Element;
  /** Screenshot of the real thing, stacked under the transcript. */
  original?: string;
}

const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

const CARD =
  "rounded-xl border border-gray-200 bg-gray-50 shadow-md dark:border-gray-800 dark:bg-gray-950";

export function ChatConversation(props: ChatConversationProps) {
  const id = () =>
    `chat-${(props.original ?? "").replaceAll(/[^a-z0-9]+/gi, "-")}`;

  const transcript = (
    <div class={`flex flex-col gap-3 p-4 text-[0.9375rem] ${CARD}`}>
      {props.children}
    </div>
  );

  return (
    <Show
      when={props.original}
      fallback={<div class="my-8 max-w-md">{transcript}</div>}
    >
      <div class="my-8 grid max-w-md pr-16">
        <input id={id()} type="checkbox" class="peer sr-only" />
        <div
          class={
            "col-start-1 row-start-1 z-10 transition-[transform,opacity,filter] duration-200 motion-reduce:transition-none " +
            EASE_OUT +
            " peer-checked:z-0 peer-checked:-translate-x-4 peer-checked:-rotate-3 peer-checked:scale-95 peer-checked:opacity-50 peer-checked:blur-[2px]"
          }
        >
          {transcript}
        </div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          for={id()}
          class={
            "col-start-1 row-start-1 z-0 my-auto translate-x-8 rotate-6 cursor-pointer transition-transform duration-200 motion-reduce:transition-none " +
            EASE_OUT +
            " pointer-fine:hover:translate-x-16 pointer-fine:hover:rotate-8 active:scale-[0.97]" +
            " peer-checked:z-20 peer-checked:translate-x-0 peer-checked:rotate-0" +
            " peer-focus-visible:outline peer-focus-visible:outline-offset-4"
          }
        >
          <span class="sr-only">show the original screenshot</span>
          <img
            src={props.original}
            alt=""
            loading="lazy"
            class={`w-full p-1.5 dark:opacity-80 ${CARD}`}
          />
        </label>
      </div>
    </Show>
  );
}

/** Consecutive messages from the same sender. */
export function MessageGroup(props: { children: JSX.Element; class?: string }) {
  return (
    <div class={`flex flex-col gap-1 ${props.class ?? ""}`}>
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
      class={
        "group flex gap-2 data-[align=end]:flex-row-reverse " +
        (props.class ?? "")
      }
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
      class={
        "mt-auto grid size-8 shrink-0 place-items-center overflow-hidden rounded-full" +
        " bg-gray-200 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300 " +
        (props.class ?? "")
      }
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
    <div class="flex max-w-[85%] flex-col items-start gap-0.5 group-data-[align=end]:items-end">
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
    <span class="-mt-3 self-end rounded-full bg-white px-1.5 py-0.5 text-xs shadow-sm dark:bg-gray-900">
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
      class={
        "rounded-2xl" +
        (props.quoted
          ? " rounded-l-sm border-l-2 border-gray-300 bg-gray-50 text-sm text-gray-600 italic dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
          : " bg-gray-100 text-gray-900 group-data-[align=end]:bg-gray-900 group-data-[align=end]:text-gray-50" +
            " dark:bg-gray-800 dark:text-gray-100 dark:group-data-[align=end]:bg-gray-200 dark:group-data-[align=end]:text-gray-900")
      }
    >
      {props.children}
    </div>
  );
}

export function BubbleContent(props: { children: JSX.Element }) {
  return <div class="px-4 py-2">{props.children}</div>;
}
