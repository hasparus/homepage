const sourceMapSupport = require("source-map-support");
const tsNode = require("ts-node");

let registered = false;

module.exports = function registerTsNode() {
  if (registered) {
    return;
  }

  registered = true;

  sourceMapSupport.install();
  tsNode.register({
    compilerOptions: {
      module: "commonjs",
      target: "es2017",
      // TS_NODE_FILES is set to false, so declarations.d.ts are not loaded
      noImplicitAny: false,
      project: "../../../tsconfig.json",
    },
  });
};
