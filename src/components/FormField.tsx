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
        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
          {label}
        </label>
        <input
          type="text"
          value={value.join(', ')}
          onChange={(e) => onChange(e.target.value.split(', ').filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter items separated by commas"
        />
      </div>
    );
  }

  if (isLongText) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
          {label}
        </label>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
        {label}
      </label>
      <input
        type={label.includes('date') || label.includes('Date') ? 'month' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};