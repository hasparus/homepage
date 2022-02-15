import { alpha } from "@theme-ui/color";
import { ThemeUICSSObject } from "theme-ui";

export const headingLinksBodyStyles: ThemeUICSSObject = {
  ".remark-autolink-headers__anchor": {
    p: ["2px", "4px"],
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: ["-16px", "-28px"],
    svg: {
      width: ["12px", "20px"],
      height: ["12px", "20px"],
      strokeLinejoin: "round",
      strokeLinecap: "round",
    },
  },

  "h1, h2, h3, h4, h5, h6": {
    ".remark-autolink-headers__anchor": {
      opacity: 0,
      borderRadius: "50%",
      transition: "all 150ms linear",
      ":focus, :hover": {
        backgroundColor: "primary007",
      },
    },
    ":focus, :hover": {
      ".remark-autolink-headers__anchor": {
        opacity: 1,
      },
    },
  },
};
