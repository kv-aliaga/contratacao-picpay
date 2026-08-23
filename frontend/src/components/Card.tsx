import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children, className = "", ...props }: CardProps) {
  const classes = ["card", className].filter(Boolean).join(" ");

  return (
    <section className={classes} {...props}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}
