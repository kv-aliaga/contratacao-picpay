import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const classes = ["button", `button-${variant}`, className].filter(Boolean).join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
