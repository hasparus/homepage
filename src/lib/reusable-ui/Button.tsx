/** @jsx jsx */
import {
  Button as ThButton,
  ButtonProps as ThButtonProps,
  jsx,
} from "theme-ui";

type ButtonVariant = "primary" | "clear";

export interface ButtonProps extends ThButtonProps {
  variant?: ButtonVariant;
}

export const Button = ({ className, ...rest }: ButtonProps) => (
  <ThButton type="button" className={`js-only ${className}`} {...rest} />
);
