require("source-map-support").install();
require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "es2017",
  },
});

// eslint-disable-next-line import/no-unresolved
module.exports = require("./gatsby-node-ts");
