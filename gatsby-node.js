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
module.exports = require("./gatsby-node-ts");
