// File: app/signup/components/UploadField.tsx

import React from "react";
import { AttachIcon } from "./Icons";

interface UploadFieldProps {
  label: string;
  placeholder: string;
  helperText?: React.ReactNode;
  errorText?: string;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadField: React.FC<UploadFieldProps> = ({
  label,
  placeholder,
  helperText,
  errorText,
  selectedFile,
  onFileChange,
}) => (
  <div className="mb-4">
    <label
      htmlFor={`file-input-${label}`}
      className="cursor-pointer flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg dark:bg-gray-800"
    >
      <span className="text-sm text-gray-300 dark:text-gray-200">
        {selectedFile ? "File attached, ready to continue" : placeholder}
      </span>
      <AttachIcon />
    </label>
    <input
      type="file"
      id={`file-input-${label}`}
      className="hidden"
      onChange={onFileChange}
    />
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

export default UploadField;
