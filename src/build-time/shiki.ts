import { transformerTwoslash } from "@shikijs/twoslash";
import { JsxEmit, ModuleKind, ModuleResolutionKind, ScriptTarget } from "typescript";

export const shikiConfig = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  } as const,
  transformers: [
    transformerTwoslash({
      explicitTrigger: true,
      twoslashOptions: {
        compilerOptions: {
          strict: true,
          module: ModuleKind.NodeNext,
          moduleResolution: ModuleResolutionKind.NodeNext,
          target: ScriptTarget.ESNext,
          jsx: JsxEmit.ReactJSX,
          jsxImportSource: "react",
          types: ["node"],
        },
      },
    }),
  ],
};
