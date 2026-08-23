import { useId } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, id, className = "", ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const classes = ["input", className].filter(Boolean).join(" ");

  return (
    <div className="input-field">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={classes}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <span id={errorId} role="alert">{error}</span>}
    </div>
  );
}
