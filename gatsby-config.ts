import "./src/__generated__/gatsby-types";

import { readdirSync } from "fs-extra";

import { Mdx } from "./__generated__/global";
import { gatsbyPluginMdxConfig } from "./src/features/blog/config";
import { makeBrainNotesGatsbyPluginConfig } from "./src/features/brain-notes/config";

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
  // use this
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          resolve: "gatsby-plugin-typegen",
          options: {
            emitSchema: {
              "src/__generated__/gatsby-introspection.json": true,
              "src/__generated__/gatsby-schema.graphql": true,
            },
            emitPluginDocuments: {
              "src/__generated__/gatsby-plugin-documents.graphql": true,
            },
          },
        },
      ]
    : []),
  // todo: consider if I can slowly remove this
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
  gatsbyPluginMdxConfig,
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
