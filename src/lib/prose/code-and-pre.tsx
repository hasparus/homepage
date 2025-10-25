import { type JSX, splitProps } from "solid-js";

import { GitHubIcon } from "../../own/icons/GitHubIcon";
import { Link } from "../Link";

import styles from "./code-and-pre.module.css";

export function Code(props: JSX.HTMLAttributes<HTMLElement>) {
  return (
    <code {...props} classList={{ ...props.classList, [styles.Code!]: true }} />
  );
}

interface PreProps extends JSX.HTMLAttributes<HTMLPreElement> {
  github?: string;
}

export function Pre(props: PreProps) {
  const [local, rest] = splitProps(props, ["github"]);

  const content = (
    <pre
      {...rest}
      classList={{
        ...rest.classList,
        [styles.Pre!]: true,
        [styles.inFigure!]: !!local.github,
      }}
    />
  );

  if (local.github) {
    const urlWithoutDomain = local.github.replace(
      /^https?:\/\/github\.com\//,
      "",
    );
    const parts = urlWithoutDomain.split("/");
    const repoName = `${parts[0]}/${parts[1]}`;
    const filepath = `/${parts.slice(4).join("/")}`;

    return (
      <figure>
        <figcaption class="space flex items-center justify-between !px-0 !font-sans !text-sm !not-italic [&:has(~_.github-dark)]:hidden dark:[&:has(~_.github-dark)]:flex dark:[&:has(~_.github-light)]:hidden">
          <span class="flex items-center gap-1">
            <GitHubIcon class="size-3.5" />
            {repoName}
          </span>

          <Link
            href={local.github}
            target="_blank"
            rel="noreferrer"
            noUnderline
            noHoverBackground
            class="z-10 p-0 py-1 decoration-gray-200 underline-offset-4 hover:underline dark:decoration-gray-700"
          >
            {filepath}
          </Link>
        </figcaption>
        {content}
      </figure>
    );
  }

  return content;
}
