import "typeface-fira-code";

import { pageCtx } from "./src/features/pageCtx";

// FragmentParser doesn't tolerate `import type`
import "./src/features/fragments";

export const { wrapPageElement } = pageCtx;
