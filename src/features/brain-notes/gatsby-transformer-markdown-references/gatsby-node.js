const { onCreateNode } = require("./src/onCreateNode.ts");
const {
  createSchemaCustomization,
} = require("./src/createSchemaCustomization.ts");
const {
  setFieldsOnGraphQLNodeType,
} = require("./src/createSchemaCustomization.ts");

module.exports = {
  onCreateNode,
  createSchemaCustomization,
  setFieldsOnGraphQLNodeType,
};
