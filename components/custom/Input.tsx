// CustomInput.tsx
import React, { useState, useRef, ChangeEvent } from "react";

interface FilePreview {
  url: string;
  name: string;
  type: string;
}

interface SelectOption {
  label: string;
  value: string | number;
}

type InputType =
  | "text"
  | "number"
  | "tel"
  | "email"
  | "password"
  | "file"
  | "date"
  | "range"
  | "search"
  | "url"
  | "select"
  | "textarea"
  | "checkbox";

interface CustomInputProps {
  type: InputType | string;
  label?: string;
  name: string;
  value?: string | number | FileList | boolean | any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  rows?: number;
  cols?: number;
  checked?: boolean;
  onChange: (value: any, name: string) => void;
  onBlur?: () => void;
}

const Input: React.FC<CustomInputProps> = ({
  type,
  label,
  name,
  value,
  placeholder,
  required = false,
  disabled = false,
  multiple = false,
  accept,
  min,
  max,
  step,
  className = "",
  inputClassName = "",
  labelClassName = "",
  error,
  helperText,
  options = [],
  rows = 4,
  cols = 50,
  checked,
  onChange,
  onBlur,
}) => {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const inputValue =
      e.target.type === "file"
        ? (e.target as HTMLInputElement).files
        : e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    onChange(inputValue, name);

    if (e.target.type === "file" && (e.target as HTMLInputElement).files) {
      const files = (e.target as HTMLInputElement).files!;
      const newPreviews: FilePreview[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          newPreviews.push({
            url,
            name: file.name,
            type: file.type,
          });
        }
      });
      setPreviews((prevPreviews) => {
        prevPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        return newPreviews;
      });
    }
  };

  const clearFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviews([]);
    onChange(null, name);
  };

  const renderInput = () => {
    const commonProps = {
      id: name,
      name,
      placeholder,
      required,
      disabled,
      onBlur,
      "aria-describedby": helperText ? `${name}-helper-text` : undefined,
    };

    const commonClasses = `
      focus:outline-none 
      focus:ring-2 
      focus:ring-blue-500 
      focus:border-blue-500
      disabled:cursor-not-allowed
      ${error ? "border-red-500" : ""}
      ${inputClassName}
    `;

    switch (type) {
      case "checkbox":
        return (
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                {...commonProps}
                type="checkbox"
                checked={checked}
                onChange={handleInputChange}
                className={`
                  h-4 w-4 
                  text-blue-600 
                  border-gray-300 
                  rounded
                  disabled:bg-gray-100
                  ${commonClasses}
                `}
              />
            </div>
            {(label || helperText) && (
              <div className="ml-3 text-sm">
                {label && (
                  <label
                    htmlFor={name}
                    className={`font-medium text-gray-700 ${labelClassName}`}
                  >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {helperText && (
                  <p id={`${name}-helper-text`} className="text-gray-500 mt-1">
                    {helperText}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case "select":
        return (
          <select
            {...commonProps}
            value={value as string}
            onChange={handleInputChange}
            className={`
              px-3 py-2 
              border border-gray-300 
              rounded-md
              disabled:bg-gray-100 
              ${commonClasses}
            `}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={value as string}
            onChange={handleInputChange}
            rows={rows}
            cols={cols}
            className={`
              px-3 py-2 
              border border-gray-300 
              rounded-md
              disabled:bg-gray-100 
              ${commonClasses}
            `}
          />
        );

      case "file":
        return (
          <input
            {...commonProps}
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleInputChange}
            className={`
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              ${commonClasses}
            `}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            value={value as string}
            min={type === "number" || type === "range" ? min : undefined}
            max={type === "number" || type === "range" ? max : undefined}
            step={type === "number" || type === "range" ? step : undefined}
            onChange={handleInputChange}
            className={`
              px-3 py-2 
              border border-gray-300 
              rounded-md
              disabled:bg-gray-100 
              ${commonClasses}
            `}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {type !== "checkbox" && label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderInput()}

      {type !== "checkbox" && helperText && (
        <p id={`${name}-helper-text`} className="text-sm text-gray-500 mt-1">
          {helperText}
        </p>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {type === "file" && previews.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Files
            </h4>
            <button
              type="button"
              onClick={clearFiles}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <p className="text-white text-xs text-center p-2">
                    {preview.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Input;

// Usage Example:
/*
import CustomInput from './CustomInput';

const FormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    country: '',
    description: '',
    newsletter: false,
    terms: false,
    photos: null as FileList | null,
  });

  const handleInputChange = (value: any, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <CustomInput
        type="text"
        label="Name"
        name="name"
        value={formData.name}
        required
        helperText="Enter your full name as it appears on your ID"
        onChange={handleInputChange}
      />
      
      <CustomInput
        type="checkbox"
        label="Subscribe to Newsletter"
        name="newsletter"
        checked={formData.newsletter}
        helperText="Receive weekly updates about our products and services"
        onChange={handleInputChange}
      />
      
      <CustomInput
        type="checkbox"
        label="Accept Terms"
        name="terms"
        checked={formData.terms}
        required
        helperText="By checking this box, you agree to our Terms of Service and Privacy Policy"
        onChange={handleInputChange}
      />
    </div>
  );
};
*/
