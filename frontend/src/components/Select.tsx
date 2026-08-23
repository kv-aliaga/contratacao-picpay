import { useId } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export default function Select({ label, error, id, options, className = "", children, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const classes = ["select", className].filter(Boolean).join(" ");

  return (
    <div className="select-field">
      {label && <label htmlFor={selectId}>{label}</label>}
      <select
        id={selectId}
        className={classes}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {children}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <span id={errorId} role="alert">{error}</span>}
    </div>
  );
}
