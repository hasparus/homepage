const { sourceNodes } = require("./sourceNodes.ts");
const { createResolvers } = require("./createResolvers.ts");
const {
  createSchemaCustomization,
} = require("./createSchemaCustomization.ts");

module.exports = {
  sourceNodes,
  createResolvers,
  createSchemaCustomization,
};
