// eslint-disable-next-line import/no-unresolved
const { onCreateNode } = require("./onCreateNode.ts");
const { onPreBootstrap } = require("./onPreBootstrap.ts");
const { createResolvers } = require("./createResolvers.ts");
const { createPages } = require("./createPages.ts");

module.exports = {
  onPreBootstrap,
  onCreateNode,
  createResolvers,
  createPages,
};
