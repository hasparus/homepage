/* eslint-disable import/no-extraneous-dependencies */
const mdx = require("@mdx-js/mdx");
const { createMacro } = require("babel-plugin-macros");
const dedent = require("dedent");

/**
 * @typedef {Parameters<typeof createMacro>[0]} MacroHandler
 */

/** @type {MacroHandler} */
function inlineMdx({ references, babel }) {
  /** @type { typeof references.default } */
  const refs = references.inlineMdx || references.default || references;

  refs.forEach(referencePath => {
    if (!referencePath.parentPath.isTaggedTemplateExpression()) {
      throw new Error(
        "[Macro Error]: inlineMdx handles only tagged template literals"
      );
    }
    let code = mdx.sync(
      dedent(referencePath.parentPath.get("quasi").evaluate().value)
    );
    code = code.replace("/* @jsx mdx */\n", "");
    code = code.replace("export default function", "function");
    code = code.replace(
      'MDXLayout = "wrapper"',
      "MDXLayout = ({ children }) => children"
    );
    code += "\nMDXContent";

    const file = babel.transformSync(code, {
      ast: true,
      code: false,
      minified: true,
      presets: [
        [
          "@babel/preset-react",
          {
            pragma: "jsx",
            pragmaFrag: "React.Fragment",
            useSpread: true,
            // useBuiltIns: true,
          },
        ],
      ],
    });
    referencePath.parentPath.replaceWithMultiple(file.ast.program.body);
  });
}

/** @type {{ inlineMdx: (s: TemplateStringsArray) => React.ComponentType }} */
module.exports = createMacro(inlineMdx);
