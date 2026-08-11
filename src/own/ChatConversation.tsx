import type { JSX } from "solid-js";

export interface ChatConversationProps {
  children: JSX.Element;
  /** Flag emoji for the language the original is in, e.g. "🇵🇱". */
  flag?: string;
  /** Screenshot of the real thing, tucked under "show original". */
  original?: string;
}

const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

export function ChatConversation(props: ChatConversationProps) {
  const id = `chat-${(props.original ?? "").replace(/[^a-z0-9]+/gi, "-")}`;

  const sheet = (
    <div class="flex flex-col gap-3 rounded-[2rem] border border-gray-200 bg-gray-50 px-4 pt-5 pb-6 text-[0.9375rem] shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <span class="mx-auto h-1 w-10 shrink-0 rounded-full bg-gray-300 dark:bg-gray-700" />
      {props.children}
    </div>
  );

  if (!props.original) return <div class="mx-auto my-8 max-w-96">{sheet}</div>;

  return (
    <div class="mx-auto my-8 grid max-w-96 pb-16">
      <input id={id} type="checkbox" class="peer sr-only" />
      <div
        class={
          "col-start-1 row-start-1 z-10 transition-[transform,opacity,filter] duration-200 motion-reduce:transition-none " +
          EASE_OUT +
          " peer-checked:z-0 peer-checked:-rotate-2 peer-checked:scale-95 peer-checked:opacity-50 peer-checked:blur-[2px]"
        }
      >
        {sheet}
      </div>
      <label
        for={id}
        class={
          "col-start-1 row-start-1 z-0 mt-auto translate-y-10 rotate-2 cursor-pointer transition-[transform,opacity] duration-200 motion-reduce:transition-none " +
          EASE_OUT +
          " pointer-fine:hover:translate-y-14 active:scale-[0.97]" +
          " peer-checked:z-20 peer-checked:translate-y-0 peer-checked:rotate-0" +
          " peer-focus-visible:outline peer-focus-visible:outline-offset-4"
        }
      >
        <span class="sr-only">show the original screenshot</span>
        <span class="relative block">
          <img
            src={props.original}
            alt=""
            loading="lazy"
            class="w-full rounded-xl shadow-lg dark:opacity-80"
          />
          {props.flag && (
            <span class="absolute right-2 bottom-2 rounded-full bg-white/90 px-1.5 py-0.5 text-xs shadow-sm dark:bg-gray-900/90">
              {props.flag}
            </span>
          )}
        </span>
      </label>
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
