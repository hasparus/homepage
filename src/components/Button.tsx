/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { SystemStyleObject, ResponsiveStyleValue } from "@styled-system/css";

type ButtonVariant = "default" | "clear";

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
}

const buttonVariants: Record<
  ButtonVariant,
  Record<
    string,
    | SystemStyleObject
    | ResponsiveStyleValue<number | string>
    | Record<string, SystemStyleObject | ResponsiveStyleValue<number | string>>
  >
> = {
  clear: {},
  default: {
    outline: "none",
    border: "1px solid transparent",
    "&:focus, &:hover": {
      borderColor: "currentColor",
    },
  },
};

export const Button = ({ variant = "default", ...rest }: ButtonProps) => (
  <button
    type="button"
    sx={{
      display: "inline",
      padding: 0,
      font: "inherit",
      color: "inherit",
      background: "none",
      cursor: "pointer",
      border: "none",
      ...buttonVariants[variant],
    }}
    {...rest}
  />
);
