import React from 'react';

interface FormFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
}

export const FormField: React.FC<FormFieldProps> = ({ label, value, onChange }) => {
  const isArray = Array.isArray(value);
  const isLongText = label.includes('description') || label.includes('Description');

  if (isArray) {
    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {label}
        </label>
        <input
          type="text"
          value={value.join(', ')}
          onChange={(e) => onChange(e.target.value.split(', ').filter(Boolean))}
          className="w-full px-3 py-2 rounded-md border shadow-sm text-sm transition-all focus:ring focus:outline-none focus:border-blue-500 min-h-[44px]"
          placeholder="Enter items separated by commas"
        />
      </div>
    );
  }

  if (isLongText) {
    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {label}
        </label>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-md border shadow-sm text-sm min-h-[100px] resize-y transition-all focus:ring focus:outline-none focus:border-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
        {label}
      </label>
      <input
        type={label.includes('date') || label.includes('Date') ? 'month' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border shadow-sm text-sm transition-all focus:ring focus:outline-none focus:border-blue-500 min-h-[44px]"
      />
    </div>
  );
}