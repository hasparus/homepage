// @ts-check

const {
  makeBasePreset,
} = require("@flick-tech/eslint-config/src/makeBasePreset");

const preset = makeBasePreset({
  ownPackageScope: "hasparus",
  useRulesRequiringTypechecking: true,
});

module.exports = {
  ...preset,
  parserOptions: {
    ecmaVersion: 2017,
    project: "./tsconfig.json",
  },
  env: {
    es6: true,
  },
  rules: {
    ...preset.rules,
    "react/jsx-pascal-case": "off", // todo: remove this from Flick's preset

    // it's just a blog
    "no-nested-ternary": "off",
    "react/no-unescaped-entities": "off",
    "react/no-array-index-key": "off",
    "spaced-comment": "off",
    "@typescript-eslint/array-type": "off",
    "react/jsx-filename-extension": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/prefer-regexp-exec": "off",
    "no-param-reassign": "off",
    "no-use-before-define": "off",
    "no-void": "off",
    "no-shadow": "off",
    "no-restricted-syntax": "off",
    // "Unused `@ts-expect-error` directive" pops up seamingly without reason :/
    "@typescript-eslint/ban-ts-comment": "off",
    "import/no-extraneous-dependencies": "off",
    // this actually makes emoji less accessible
    "jsx-a11y/accessible-emoji": "off",
    // TypeScript compilation performance suffers on large Object spreads
    "prefer-object-spread": "off",
    "no-cond-assign": "off",
    "prefer-destructuring": "off",
  },
  overrides: [
    ...preset.overrides,
    {
      files: ["**/*.d.ts", "src/pages/**/*.ts", "src/pages/**/*.tsx"],
      rules: {
        "import/no-default-export": "off",
      },
    },
    {
      files: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              "../features",
              "../../features",
              "../../../features",
              "../../../../features",
              "../gatsby-plugin-theme-ui",
              "../../gatsby-plugin-theme-ui",
              "../../../gatsby-plugin-theme-ui",
              "../../../../gatsby-plugin-theme-ui",
            ],
          },
        ],
      },
    },
  ],
};
