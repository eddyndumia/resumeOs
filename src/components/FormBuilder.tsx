import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FormBuilderProps {
  schema: z.ZodSchema<any>;
  defaultValues: Record<string, any>;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  schema,
  defaultValues,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const renderField = (key: string, value: any) => {
    const isArray = Array.isArray(value);
    const isLongText = key.includes('description');
    const isDate = key.includes('date') || key.includes('Date');

    if (key === 'id') return null;

    return (
      <div key={key} className={`space-y-2 ${isLongText ? 'col-span-2' : ''}`}>
        <label className=\"text-sm font-medium text-gray-700 dark:text-gray-300 capitalize\">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        {isArray ? (
          <input
            {...form.register(key)}
            type=\"text\"
            placeholder=\"Enter items separated by commas\"
            className=\"w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]\"
          />
        ) : isLongText ? (
          <textarea
            {...form.register(key)}
            rows={4}
            className=\"w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y\"
          />
        ) : (
          <input
            {...form.register(key)}
            type={isDate ? 'month' : 'text'}
            className=\"w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]\"
          />
        )}
        {form.formState.errors[key] && (
          <p className=\"text-sm text-red-600 dark:text-red-400\">
            {form.formState.errors[key]?.message as string}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className=\"space-y-6\">
      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
        {Object.entries(defaultValues).map(([key, value]) => renderField(key, value))}
      </div>
      
      <div className=\"flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700\">
        <button
          type=\"submit\"
          disabled={form.formState.isSubmitting}
          className=\"px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors min-h-[44px]\"
        >
          {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        {onCancel && (
          <button
            type=\"button\"
            onClick={onCancel}
            className=\"px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors min-h-[44px]\"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};