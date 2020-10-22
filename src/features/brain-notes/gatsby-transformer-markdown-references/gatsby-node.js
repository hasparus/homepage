const { onCreateNode } = require("./src/onCreateNode.ts");
const {
  createSchemaCustomization,
  createResolvers,
} = require("./src/createSchemaCustomization.ts");

module.exports = {
  onCreateNode,
  createSchemaCustomization,
  createResolvers,
};
