import { readdirSync } from "fs-extra";

import { gatsbyPluginMdxConfig } from "./src/features/blog/config";
import { makeBrainNotesGatsbyPluginConfig } from "./src/features/brain-notes/config";
import { gitHubContributionsPluginConfig } from "./src/features/github-contributions/config";
import { Mdx, Site } from "./graphql-types";

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
      // There is a warning that this is an "unknown option", but namespaces
      // don't work without it.
      allowNamespaces: true,
    },
  },
  ...(process.env.NODE_ENV !== "development"
    ? [
        {
          // @see https://www.gatsbyjs.com/plugins/gatsby-plugin-graphql-codegen/
          resolve: "gatsby-plugin-graphql-codegen",
          options: {
            documentPaths: [
              "./src/**/*.{ts,tsx,js,jsx}",
              "./node_modules/gatsby-*/**/*.js",
              // there are no defs in .cache right now, so I'm commenting this to get
              // rid of redundancy warning
              // "./.cache/fragments/*.js",
            ],
          },
        },
        // can I get rid of this?
        {
          resolve: "gatsby-plugin-codegen",
          options: {
            localSchemaFile: "gql-schema.json",
            output: "./__generated__",
            includes: [
              "./src/**/*.tsx",
              "./src/**/*.ts",
              "./src/**/*fragments.js",
              // "./node_modules/gatsby-source-contentful/src/fragments.js",
              // "./node_modules/gatsby-source-datocms/fragments/*.js",
              // "./node_modules/gatsby-source-sanity/fragments/*.js",
              // "./node_modules/gatsby-transformer-sharp/src/fragments.js",
            ],
          },
        },
      ]
    : []),
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
          serialize: ({
            query: { allMdx, site },
          }: {
            query: { allMdx: { nodes: Mdx[] }; site: Site };
          }) => {
            return allMdx.nodes.map((node: Mdx) => ({
              ...node.frontmatter,
              description: node.frontmatter!.spoiler,
              url: `${site.siteMetadata!.siteUrl}${node.fields!.route}`,
              guid: `${site.siteMetadata!.siteUrl}${node.fields!.route}`,
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
  gatsbyPluginMdxConfig,
  gitHubContributionsPluginConfig,
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
  makeBrainNotesGatsbyPluginConfig({
    pluginMdxOptions: gatsbyPluginMdxConfig.options,
  }),
];
export const plugins = [
  "gatsby-plugin-theme-ui",
  ...contentPlugins,
  ...utilityPlugins,
];

export const flags = {
  DEV_SSR: true,
};
