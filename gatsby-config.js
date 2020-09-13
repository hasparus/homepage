require("source-map-support").install();

require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "es2017",
    // TS_NODE_FILES is set to false, so declarations.d.ts are not loaded
    noImplicitAny: false,
  },
});


module.exports = require("./gatsby-config.ts");
