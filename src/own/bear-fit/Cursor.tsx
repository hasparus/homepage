export type CursorState = "gone" | "idle" | "pressed";

export function Cursor(props: {
  name: string;
  ref: HTMLDivElement | ((el: HTMLDivElement) => void);
  state: CursorState;
}) {
  return (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-0 left-0 z-20 transition-transform ease-[cubic-bezier(0.77,0,0.175,1)]"
      ref={props.ref}
    >
      <div
        class="flex origin-top-left items-start drop-shadow-[0_2px_4px_rgb(0_0_0/0.28)] transition-[opacity,scale] duration-150 ease-out"
        style={{
          opacity: props.state === "gone" ? 0 : 1,
          scale: props.state === "pressed" ? "0.88" : "1",
        }}
      >
        <svg fill="none" height="26" viewBox="-3 -3 18 24" width="18">
          <path
            d="M5.65 12.37h-.19l-.14.13L.5 16.88V1.2l11.28 11.17H5.65Z"
            fill="var(--cursor)"
            paint-order="stroke"
            stroke="white"
            stroke-linejoin="round"
            stroke-width="4.5"
          />
          <path
            d="M5.65 12.37h-.19l-.14.13L.5 16.88V1.2l11.28 11.17H5.65Z"
            fill="var(--cursor)"
            stroke="var(--cursor)"
            stroke-linejoin="round"
            stroke-width="3"
          />
        </svg>
        <span
          class="-mt-0.5 ml-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-white"
          style={{ "background-color": "var(--cursor)" }}
        >
          {props.name}
        </span>
      </div>
    </div>
  );
}
