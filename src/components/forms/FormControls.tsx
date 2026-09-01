import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error ? <div className="form-text">{hint}</div> : null}
      {error ? (
        <div className="invalid-feedback d-block" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}

interface CalculatorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  hint?: string;
  onValueChange: (value: number) => void;
}

export function CalculatorInput({
  label,
  id,
  error,
  hint,
  value,
  onValueChange,
  ...rest
}: CalculatorInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <FormField label={label} htmlFor={inputId} error={error} hint={hint}>
      <input
        id={inputId}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        type="number"
        value={Number.isFinite(value as number) ? value : ''}
        onChange={(e) => onValueChange(Number(e.target.value))}
        {...rest}
      />
    </FormField>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, id, error, options, ...rest }: SelectFieldProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <FormField label={label} htmlFor={selectId} error={error}>
      <select id={selectId} className={`form-select ${error ? 'is-invalid' : ''}`} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
