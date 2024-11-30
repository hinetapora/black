// File: components/FormField.tsx

import React from 'react';

interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  helperText: string;
  type?: 'text' | 'file';
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  helperText,
  type = 'text',
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-sm font-medium text-gray-300 dark:text-gray-200">
        {label}
      </label>
      {type === 'file' ? (
        <div>
          <label
            htmlFor={`file-input-${label}`}
            className="cursor-pointer flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg dark:bg-gray-800"
          >
            <span className="text-sm text-gray-300 dark:text-gray-200">
              {value ? "File attached, ready to continue" : placeholder}
            </span>
            <AttachIcon />
          </label>
          <input
            type="file"
            id={`file-input-${label}`}
            className="hidden"
            onChange={onChange}
          />
        </div>
      ) : (
        <textarea
          id={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          rows={2}
          className="w-full h-12 bg-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg resize-none dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-400"
        ></textarea>
      )}
      {/* Helper Text */}
      <p className="mt-1 text-sm text-gray-400 dark:text-gray-300">{helperText}</p>
    </div>
  );
};

// Custom SVG Icon Components (reuse or import as necessary)
const AttachIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-white dark:text-gray-200"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.44772 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"
    ></path>
  </svg>
);
