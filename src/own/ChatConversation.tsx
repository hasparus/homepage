import type { JSX } from "solid-js";

export interface ChatConversationProps {
  children: JSX.Element;
  /** Screenshot of the real thing, tucked under "show original". */
  original?: string;
}

export function ChatConversation(props: ChatConversationProps) {
  return (
    <div class="my-6 flex flex-col gap-1.5 text-[0.9375rem]">
      {props.children}
      {props.original && (
        <details class="mt-2 self-start text-sm text-gray-500 dark:text-gray-400">
          <summary>show original</summary>
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

export interface MessageProps {
  children: JSX.Element;
  from?: "me" | "them";
  /** A screenshot of someone else's chat, forwarded into this one. */
  quoted?: boolean;
  reaction?: string;
}

export function Message(props: MessageProps) {
  const mine = () => props.from === "me";

  return (
    <div class={`flex ${mine() ? "justify-end" : "justify-start"}`}>
      <div
        class={
          "relative max-w-[85%] rounded-2xl px-4 py-2" +
          (props.reaction ? " mb-3" : "") +
          (props.quoted
            ? " rounded-l-sm border-l-2 border-gray-300 bg-gray-50 text-sm text-gray-600 italic dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
            : mine()
              ? " bg-gray-900 text-gray-50 dark:bg-gray-200 dark:text-gray-900"
              : " bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100")
        }
      >
        {props.children}
        {props.reaction && (
          <span
            class={
              "absolute -bottom-3 rounded-full bg-white px-1.5 py-0.5 text-xs shadow-sm dark:bg-gray-900" +
              (mine() ? " right-3" : " left-3")
            }
          >
            {props.reaction}
          </span>
        )}
      </div>
    </div>
  );
}
