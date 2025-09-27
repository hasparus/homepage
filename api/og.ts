// Note: `vercel dev` doesn't run `.tsx` endpoints
//        and it can't run @vercel/og because of
//        > Invalid URL: ../vendor/noto-sans-v27-latin-regular.ttf
//        The only way to work with this file is repeatedly pushing and checking
//        the result on Vercel Preview Deployments.

import { ImageResponse } from "@vercel/og";
import type * as React from "react";

const author = {
  name: "Piotr Monwid-Olechnowicz",
  avatarSrc: "https://avatars.githubusercontent.com/u/15332326?v=4",
};

type Author = typeof author;

export const config = { runtime: "edge" };

async function loadGoogleFont(font: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const resource = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

const width = 1200;
const height = 630;

export default async function og(req: Request) {
  try {
    const url = new URL(req.url);
    const { post, stringifiedPost, token } = parseSearchParams(
      url.searchParams,
    );

    await assertTokenIsValid(stringifiedPost, token);

    console.log("returning ImageResponse for", stringifiedPost);

    let postImage = post.img;
    if (
      postImage &&
      postImage.startsWith("/") &&
      !postImage.startsWith("/content/")
    ) {
      // we copy in deploy.mjs
      // the files from `src` are imported in Astro for processing,
      // but for OG images we just use them as they are
      postImage = "/src/images" + postImage;
    }

    return new ImageResponse(
      h(
        "div",
        {
          tw: `
            w-full h-full
            flex flex-col
          `,
        },
        h(
          Illustration,
          { imageHref: postImage },
          postImage ? null : h(Title, { title: post.title }),
        ),
        h(Footer, { author, post }),
      ),
      {
        width,
        height,
        fonts: [
          {
            name: "Inter",
            data: await loadGoogleFont("Inter"),
            weight: 400,
            style: "normal",
          },
        ],
      },
    );
  } catch (err: unknown) {
    console.error(err);

    if (err instanceof HttpError) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: err.status,
      });
    }

    const error = err instanceof Error ? err : new Error(String(err));

    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

function Illustration({
  children,
  imageHref,
}: {
  children?: React.ReactNode[];
  imageHref: string | null | undefined;
}) {
  imageHref = "http://localhost:3001" + imageHref;

  console.log({ imageHref });
  const searchParams = imageHref ? new URL(imageHref).searchParams : null;

  return h(
    "div",
    {
      tw: `
          absolute inset-0
          flex flex-1 justify-start items-end w-full pt-4 px-4 relative
          bg-[#171717]
        `,
    },
    !!imageHref &&
      h("img", {
        src: imageHref.slice(0, imageHref.indexOf("?")),
        width,
        height,
        style: {
          position: "absolute",
          inset: 0,
          objectFit: "cover",
          ...Object.fromEntries(searchParams || []),
        },
      }),
    ...(children || []),
  );
}

function Title({ title }: { title: string }) {
  return h(
    "h1",
    {
      tw: `
        text-white text-9xl font-black z-10
      `,
    },
    title,
  );
}

function Footer({ author, post }: { author: Author; post: Post }) {
  return h(
    "footer",
    {
      tw: `
      absolute bottom-0 left-0 right-0
      h-28 w-full px-4 py-2.5
      bg-[rgb(10,10,10)]
      border-t-2 border-t-[#262626]
      text-4xl
      flex flex-row justify-center items-center
    `,
    },
    h("img", {
      width: 80,
      height: 80,
      src: author.avatarSrc,
      tw: `rounded-full`,
    }),
    h("span", { tw: `ml-4 text-white` }, author.name),
    h("div", { tw: `flex-1` }),
    h(
      "span",
      { tw: `text-white` },
      [
        post.date.toLocaleDateString("sv-SE"),
        post.readingTimeMinutes > 2 && `${post.readingTimeMinutes} min read`,
      ]
        .filter(Boolean)
        .join(" · "),
    ),
  );
}

function h<T extends React.ElementType>(
  type: T,
  props: React.ComponentPropsWithRef<T>,
  ...children: React.ReactNode[]
) {
  return {
    type,
    key: "key" in props ? props.key : null,
    props: {
      ...props,
      children: children && children.length ? children : props.children,
    },
  };
}

function fetchFont(url: URL) {
  return fetch(url).then((res) => res.arrayBuffer());
}

type Post = {
  date: Date;
  title: string;
  readingTimeMinutes: number;
  img: string | null | undefined;
};

const SEPARATOR = "\t";
type SEPARATOR = typeof SEPARATOR;

// prettier-ignore
export type StringifiedPost = `${
  number /* timestamp */
}${SEPARATOR}${
  number /* reading time */
}${SEPARATOR}${
  string /* title */
}${SEPARATOR}${
  string /* picture */
}`;

export type OgFunctionSearchParams = {
  post: StringifiedPost;
  token?: string;
};

function parseSearchParams(searchParams: URLSearchParams) {
  const stringifiedPost = decodeURIComponent(
    searchParams.get("post") || "",
  ) as StringifiedPost;

  const postArray = stringifiedPost.split(SEPARATOR);

  if (postArray.length !== 4) {
    throw new HttpError("Missing required search params.", 400);
  }

  const post: Post = {
    date: new Date(Number(postArray[0])),
    readingTimeMinutes: Math.round(Number(postArray[1])),
    title: postArray[2]!,
    img: postArray[3],
  };

  return {
    post,
    stringifiedPost,
    token: searchParams.get("token") || "",
  };
}

class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

/**
 * @see https://vercel.com/docs/concepts/functions/edge-functions/og-image-examples#encrypting-parameters
 */
async function assertTokenIsValid(
  post: StringifiedPost,
  receivedToken: string,
): Promise<void> {
  const secret = process.env.OG_IMAGE_SECRET;

  if (!secret) {
    throw new Error("process.env.OG_IMAGE_SECRET is missing");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"],
  );

  const arrayBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(post),
  );

  const token = Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n: number) =>
      n.toString(16).padStart(2, "0"),
    )
    .join("");

  if (receivedToken !== token) {
    throw new HttpError("Invalid token.", 401);
  }
}
