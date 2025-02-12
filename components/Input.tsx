import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

export interface FormField {
  type: string;
  label?: string;
  name: string;
  accept?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean | (() => boolean);
  defaultValue?: string | number | string[];
  checked?: boolean;
  helperText?: string;
  autoFocus?: boolean;
  className?: string;
  multiple?: boolean;
  onChange?: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onBlur?: (
    event: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export interface InputProps {
  field: FormField;
  filePreviews?: { [key: string]: string | null }; // Allow null values
  setFilePreview?: (fieldName: string, value: string | null) => void;
  filePath?: string | File;
}

const Input: React.FC<InputProps> = ({
  field,
  filePreviews,
  setFilePreview,
  filePath,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
  } = useFormContext();

  const isDisabled = useMemo(
    () =>
      typeof field.disabled === "function" ? field.disabled() : field.disabled,
    [field]
  );

  const { ref, ...rest } = register(field.name, {
    required: field.required ? `${field.label} is required` : false,
  });

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Please upload a JPG, PNG, GIF, PDF, or DOC file";
    }
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        event.target.value = "";
        setFilePreview?.(field.name, null);
        setValue(field.name, null, { shouldValidate: true, shouldDirty: true });
        return;
      }

      setValue(field.name, file, { shouldValidate: true, shouldDirty: true });

      if (setFilePreview) {
        const reader = new FileReader();
        reader.onload = () =>
          setFilePreview(field.name, reader.result as string);
        reader.readAsDataURL(file);
      }

      await trigger(field.name);
    }
  };

  const handleRemoveFile = () => {
    setFilePreview?.(field.name, null);
    const fileInput = document.querySelector(
      `input[name="${field.name}"]`
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    setValue(field.name, null, { shouldValidate: true, shouldDirty: true });
  };

  useEffect(() => {
    if (filePath instanceof File) {
      const url = URL.createObjectURL(filePath);
      return () => URL.revokeObjectURL(url);
    }
  }, [filePath]);

  const fileSrc =
    filePath instanceof File
      ? URL.createObjectURL(filePath)
      : filePath || filePreviews?.[field.name];

  const getFilePreview = (fileSrc: string) => {
    if (fileSrc.startsWith("data:image")) {
      return (
        <Image
          src={fileSrc}
          alt="Preview"
          className="object-cover w-full h-full"
        />
      );
    } else if (fileSrc.startsWith("data:application/pdf")) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
          <span className="text-sm text-gray-500">PDF Preview</span>
        </div>
      );
    } else if (
      fileSrc.startsWith("data:application/msword") ||
      fileSrc.startsWith(
        "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
          <span className="text-sm text-gray-500">DOC Preview</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
          <span className="text-sm text-gray-500">File Preview</span>
        </div>
      );
    }
  };

  const commonProps = useMemo(
    () => ({
      ...rest,
      id: field.name,
      disabled: isDisabled,
      autoFocus: field.autoFocus,
      className: `block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-grayText focus:ring-1 focus:outline-none focus:border-none sm:text-sm sm:leading-6 ${
        field.className || ""
      } ${isDisabled ? "cursor-not-allowed bg-gray-100" : ""} ${
        errors[field.name] ? "border-red-500" : ""
      }`,
    }),
    [rest, field, isDisabled, errors]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label
          htmlFor={field.name}
          className="block text-sm text-nowrap font-medium text-grayText mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </label>
        {isDisabled && (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
            Disabled
          </span>
        )}
      </div>

      {field.type === "file" && (
        <div className="space-y-4 border border-gray-400 rounded-lg p-3 bg-gray-50">
          {fileSrc ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden">
              {getFilePreview(fileSrc)}
              {!isDisabled && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            !isDisabled && (
              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm text-gray-500 hover:text-gray-500">
                  Upload File
                </span>
                <input
                  type="file"
                  accept={field.accept || "*"}
                  {...commonProps}
                  onChange={handleFileChange}
                  ref={ref}
                  className="hidden"
                />
              </label>
            )
          )}

          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[field.name]?.message?.toString()}
            </p>
          )}
        </div>
      )}

      {field.type === "select" && (
        <select {...commonProps} ref={ref} defaultValue={field.defaultValue}>
          <option value="" disabled>
            {field.placeholder || "Select an option"}
          </option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {["text", "email", "tel", "date", "password", "number", "url"].includes(
        field.type
      ) && (
        <input
          type={field.type}
          placeholder={field.placeholder}
          {...commonProps}
          ref={ref}
        />
      )}

      {field.type === "checkbox" && (
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            {...commonProps}
            ref={ref}
            defaultChecked={field.checked}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          {field.helperText && (
            <p className="text-sm text-gray-500">{field.helperText}</p>
          )}
        </div>
      )}

      {field.type === "radio" && (
        <div className="flex  gap-2">
          {field.options?.map((option) => (
            <label key={option.value} className="flex items-center gap-2">
              <input
                type="radio"
                value={option.value}
                {...commonProps}
                ref={ref}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === "textarea" && (
        <textarea
          placeholder={field.placeholder}
          {...commonProps}
          ref={ref}
          rows={4}
        />
      )}

      {field.type !== "file" && errors[field.name] && (
        <p className="text-red-500 text-sm">
          {errors[field.name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Input;
