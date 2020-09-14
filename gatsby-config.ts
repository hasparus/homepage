import { readdirSync } from "fs-extra";
import * as path from "path";
import slugRemarkPlugin from "remark-slug";

import { Mdx } from "./__generated__/global";
import { autolinkHeadingsRemarkPluginConfig } from "./src/features/autolink-headings/remark-plugin-config";
import {
  brainNotesGatsbyPluginConfig,
  brainNotesGatsbyRemarkPluginConfig,
} from "./src/features/brain-notes/config";

const deployUrl = process.env.DEPLOY_PRIME_URL || "";
const siteUrl =
  deployUrl && !deployUrl.includes("master--")
    ? deployUrl
    : // No trailing slash allowed!
      "https://haspar.us";

export const siteMetadata = {
  title: "haspar.us",
  titleTemplate: "%s — haspar.us",
  author: "Piotr Monwid-Olechnowicz",
  description: "A personal blog, mostly about software engineering",
  social: [
    {
      name: `Twitter`,
      url: `https://twitter.com/hasparus`,
    },
    {
      name: `GitHub`,
      url: `https://github.com/hasparus`,
    },
  ],
  siteUrl,
  htmlAttributes: { lang: "en" },
  twitterUsername: "@hasparus",
};

const utilityPlugins = [
  // gatsby-plugin-catch-links breaks menu # link
  "gatsby-plugin-netlify-cache",
  "gatsby-plugin-lodash",
  "gatsby-transformer-sharp",
  "gatsby-plugin-sharp",
  {
    resolve: "gatsby-plugin-typescript",
    options: {
      allowNamespaces: true,
    },
  },
  {
    resolve: "gatsby-plugin-codegen",
    options: {
      localSchemaFile: "gql-schema.json",
    },
  },
  "gatsby-plugin-react-helmet",
  "gatsby-plugin-robots-txt",
  {
    resolve: "gatsby-plugin-manifest",
    options: {
      name: "haspar.us",
      short_name: "haspar.us",
      start_url: "/",
      background_color: "#fff",
      theme_color: "#002FF4",
      icon: "src/favicon.png",
    },
  },
  {
    resolve: "gatsby-plugin-sitemap",
    options: {
      exclude: ["**/*.hidden", "**/_*"],
    },
  },
  {
    resolve: "gatsby-plugin-feed",
    options: {
      query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
      feeds: [
        {
          query: `
              query AllPostsQuery {
                allMdx(
                  filter: {fields: {isHidden: {ne: true}}},
                  sort: {fields: [frontmatter___date], order: DESC}
                ) {
                  nodes {
                    html
                    frontmatter {
                      title
                      spoiler
                      date
                    }
                    fields {
                      route
                      readingTime
                    }
                  }
                }
              }
            `,
          serialize: ({ query: { site, allMdx } }: any) => {
            return allMdx.nodes.map((node: Mdx) => ({
              ...node.frontmatter,
              description: node.frontmatter!.spoiler,
              url: site.siteMetadata.siteUrl + node.fields!.route,
              guid: site.siteMetadata.siteUrl + node.fields!.route,
              custom_elements: [{ "content:encoded": node.html }],
            }));
          },
          output: "/rss.xml",
          title: "haspar.us ◦ personal blog of Piotr Monwid-Olechnowicz",
        },
      ],
    },
  },
];

const contentPlugins = [
  {
    resolve: "gatsby-plugin-mdx",
    options: {
      extensions: [".mdx", ".md"],
      commonmark: true,
      gatsbyRemarkPlugins: [
        autolinkHeadingsRemarkPluginConfig,
        brainNotesGatsbyRemarkPluginConfig,
        {
          resolve: "gatsby-remark-images",
          options: {
            maxWidth: 1380,
            linkImagesToOriginal: false,
          },
        },
        { resolve: "gatsby-remark-copy-linked-files" },
        { resolve: "gatsby-remark-smartypants" },
        {
          resolve: "gatsby-remark-vscode",
          options: {
            extensionDataDirectory: path.resolve(
              __dirname,
              "./__deps__/vscode-extensions"
            ),
            injectStyles: false,
            colorTheme: ({ parsedOptions }: any) =>
              parsedOptions.theme || "Night Owl (No Italics)",
            extensions: [
              { identifier: "hackwaly.ocaml", version: "0.6.43" },
              { identifier: "sdras.night-owl", version: "1.1.3" },
              { identifier: "2gua.rainbow-brackets", version: "0.0.6" },
              { identifier: "fwcd.kotlin", version: "0.2.10" },
              { identifier: "prisma.vscode-graphql", version: "0.2.2" },
            ],
          },
        },
      ],
      remarkPlugins: [slugRemarkPlugin],
      defaultLayouts: {
        // default: require.resolve("../layouts/PageLayout.tsx"),
        posts: require.resolve("./src/layouts/PostLayout.tsx"),
        speaking: require.resolve("./src/layouts/TalkNoteLayout.tsx"),
        notes: require.resolve("./src/layouts/NoteLayout.tsx"),
      },
    },
  },
  // note. next time just put the posts in /pages dir
  // so gatsby-plugin-page-creator kicks in.
  // it would be easier to maintain

  ...readdirSync("./content").map((name) => ({
    resolve: "gatsby-source-filesystem",
    options: {
      path: `content/${name}`,
      name,
    },
  })),
  brainNotesGatsbyPluginConfig,
];
export const plugins = [
  "gatsby-plugin-theme-ui",
  ...contentPlugins,
  ...utilityPlugins,
];
