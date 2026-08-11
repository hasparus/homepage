import type { JSX } from "solid-js";

export interface ChatConversationProps {
  children: JSX.Element;
  /** Flag emoji for the language the original is in, e.g. "🇵🇱". */
  flag?: string;
  /** Screenshot of the real thing, tucked under "show original". */
  original?: string;
}

export function ChatConversation(props: ChatConversationProps) {
  return (
    <div class="my-6 flex flex-col gap-3 text-[0.9375rem]">
      {props.original && (
        <details class="self-end text-sm text-gray-500 dark:text-gray-400">
          <summary>{props.flag} show original</summary>
          <img
            src={props.original}
            alt=""
            loading="lazy"
            class="mt-3 max-w-full -rotate-1 rounded-md shadow-lg dark:opacity-80"
          />
        </details>
      )}
    </div>
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
    <span class="-mt-2 rounded-full bg-white px-1.5 py-0.5 text-xs shadow-sm dark:bg-gray-900">
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
