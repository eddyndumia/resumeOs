import React from 'react';

interface FormFieldProps {
  id?: string; // For associating label with input
  label: string;
  name?: string; // Input name attribute
  value: string | number | readonly string[] | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: 'text' | 'textarea' | 'email' | 'password' | 'number' | 'date' | 'month' | 'select' | 'array'; // Added 'array' for specific handling
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string; // For displaying error messages
  helperText?: string; // For additional guidance
  options?: Array<{ value: string; label: string }>; // For select type
  rows?: number; // For textarea
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  options,
  rows = 3,
}) => {
  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  const commonInputClasses = `
    block w-full text-sm shadow-sm
    border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-700
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    focus:border-indigo-500 dark:focus:border-indigo-400
    focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400
    focus:outline-none
    rounded-md
    disabled:bg-gray-50 dark:disabled:bg-gray-800
    disabled:text-gray-500 dark:disabled:text-gray-400
    disabled:cursor-not-allowed
    min-h-[40px] px-3 py-2
  `;

  const errorClasses = error ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : '';

  let inputElement;

  if (type === 'textarea') {
    inputElement = (
      <textarea
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`${commonInputClasses} ${errorClasses} resize-y`}
      />
    );
  } else if (type === 'select' && options) {
    inputElement = (
      <select
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${commonInputClasses} ${errorClasses}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  } else if (type === 'array') { // Special handling for comma-separated strings representing arrays
    inputElement = (
        <input
            type="text"
            id={fieldId}
            name={name}
            value={Array.isArray(value) ? value.join(', ') : (value || '')}
            onChange={(e) => {
                // Create a synthetic event or adapt onChange prop to handle string directly
                const stringValue = e.target.value;
                // If the parent expects an array, it should split it.
                // For now, pass the string value, assuming parent's `FormBuilder` handles it.
                // Or, if FormField is used standalone and needs to emit array:
                // onChange(stringValue.split(',').map(s => s.trim()).filter(Boolean));
                // For this case, we'll stick to the interface:
                const syntheticEvent = {
                    ...e,
                    target: { ...e.target, value: stringValue }
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
            }}
            placeholder={placeholder || "Enter items separated by commas"}
            required={required}
            disabled={disabled}
            className={`${commonInputClasses} ${errorClasses}`}
        />
    );
  } else {
    inputElement = (
      <input
        id={fieldId}
        name={name}
        type={type} // handles text, email, password, number, date, month
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${commonInputClasses} ${errorClasses}`}
      />
    );
  }

  return (
    <div className="mb-5"> {/* Increased bottom margin for better spacing */}
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
      {inputElement}
      {helperText && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};