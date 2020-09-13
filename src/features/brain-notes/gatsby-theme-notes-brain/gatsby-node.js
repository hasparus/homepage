require("source-map-support").install();

require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "es2017",
    // TS_NODE_FILES is set to false, so declarations.d.ts are not loaded
    noImplicitAny: false,
  },
});

// eslint-disable-next-line import/no-unresolved
const { onCreateNode } = require('./onCreateNode.ts');
const { onPreBootstrap } = require('./onPreBootstrap.ts');
const { createResolvers } = require('./createResolvers.ts')
const { createPages } = require('./createPages.ts')

module.exports = {
  onPreBootstrap,
  onCreateNode,
  createResolvers,
  createPages,
}
