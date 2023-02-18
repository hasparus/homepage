import { createEffect, JSX } from "solid-js";

export function Lightbox(props: JSX.HTMLAttributes<HTMLElement>) {
  let ref!: HTMLElement;

  createEffect(() => {
    const images = ref.querySelectorAll(".zaduma-image-box");

    images.forEach((image) => {
      image.addEventListener("click", (event) => {
        const currentTarget = event.currentTarget as HTMLElement;
        const img = currentTarget.querySelector("img") as HTMLImageElement;
        const src = new URL(img.src);
        src.searchParams.delete("w");
        src.searchParams.delete("h");
        window.open(src.toString(), "_blank");
      });
    });
  });

  return <section ref={ref} {...props}></section>;
}
