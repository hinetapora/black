// File: app/signup/components/InputField.tsx

import React from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  helperText?: React.ReactNode;
  errorText?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  helperText,
  errorText,
  value,
  onChange,
  onKeyDown,
}) => (
  <div className="mb-4">
    <label htmlFor={label} className="sr-only">
      {label}
    </label>
    <textarea
      id={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      rows={2}
      required
      className={`w-full h-12 bg-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg resize-none dark:bg-gray-500 dark:text-gray-100 dark:focus:ring-blue-400 ${
        errorText ? "focus:ring-red-500" : ""
      }`}
    ></textarea>
    {helperText && !errorText && (
      <p className="mt-1 text-sm text-gray-400 dark:text-gray-300">
        {helperText}
      </p>
    )}
    {errorText && (
      <p className="mt-1 text-sm text-red-500" aria-live="assertive">
        {errorText}
      </p>
    )}
  </div>
);

export default InputField;
