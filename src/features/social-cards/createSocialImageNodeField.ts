import * as path from "path";

import * as fs from "fs-extra";
import { Actions, Node, ParentSpanPluginArgs } from "gatsby";
import { createFileNode as baseCreateFileNode } from "gatsby-source-filesystem/create-file-node";
import { Browser as PuppeteerBrowser } from "puppeteer-core";

import { buildTime } from "../../lib/build-time/gatsby-node-utils";

import { makeSocialCard } from "./makeSocialCard";

interface CreateMdxNodeArgs extends ParentSpanPluginArgs {
  node: buildTime.Mdx;
}

async function createFileNode(
  filePath: string,
  createNode: Actions["createNode"],
  createNodeId: (s: string) => string,
  parentNodeId: string | null | undefined
) {
  const fileNode = await baseCreateFileNode(filePath, createNodeId);
  fileNode.parent = parentNodeId;
  createNode(fileNode, {
    name: `gatsby-source-filesystem`,
  });
  return fileNode;
}

export async function createSocialImageNodeField(
  {
    node,
    store,
    createNodeId,
    actions: { createNodeField, createNode },
  }: CreateMdxNodeArgs,
  browser: PuppeteerBrowser
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { program } = store.getState();

  const cacheDir = path.resolve(`${program.directory}/.cache/social/`);
  await fs.ensureDir(cacheDir);

  // console.log(
  //   "createSocialImageNodeField",
  //   node.id,
  //   node.internal.type,
  //   node.fields?.route
  // );

  const ogImage = await makeSocialCard(cacheDir, browser, node);

  const ogImageNode = await createFileNode(
    ogImage,
    createNode,
    createNodeId,
    node.id
  );

  // console.log("createSocialImageNodeField", node.fields?.route);

  createNodeField({
    name: "socialImage___NODE",
    node: (node as unknown) as Node,
    value: ogImageNode.id,
  });
}
