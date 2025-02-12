"use client";
import {
  ArrowUpTrayIcon,
  CloudArrowUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ImageUpload = ({
  setIsAddImageModalOpen,
  refetch,
}: {
  setIsAddImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}) => {
  const [previews, setPreviews] = useState<string[]>([]); // Stores preview URLs
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Stores File objects
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  // const toastId = React.useRef(null);

  // Handle File Selection (Input & Drag-Drop)
  const handleFileChange = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length > 0) {
      const imagePreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...imagePreviews]);
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    } else {
      alert("Please upload valid image files (PNG, JPG, GIF)");
    }
  };

  const onFileSelect = (event: any) => handleFileChange(event.target.files);

  // Handle Drag & Drop
  const onDragOver = (event: any) => {
    event.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const onDrop = (event: any) => {
    event.preventDefault();
    setDragging(false);
    handleFileChange(event.dataTransfer.files);
  };

  // Remove Selected Image
  const removeImage = (index: any) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Image Upload using Axios
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select images to upload");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    const toastId = toast.loading("Uploading images...");

    try {
      const response = await axios.post("/api/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsAddImageModalOpen(false);
      refetch();

      toast.success("Upload successful!");
      console.log("Uploaded URLs:", response.data.urls);
      setPreviews([]);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-900">
        Upload Image in Gallery
      </label>

      {/* Drag & Drop Zone */}
      <div
        className={`mt-2 flex flex-col items-center rounded-lg border border-dashed ${
          dragging ? "border-textColor bg-indigo-100" : "border-gray-900/25"
        } px-6 py-10 transition`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Image Previews */}
        <div className="grid grid-cols-3 gap-4 ">
          {previews.map((src, index) => (
            <div key={index} className="relative ">
              <Image
                src={src}
                alt="Preview"
                className="rounded-lg object-cover"
                height={100}
                width={100}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="mt-4 flex flex-col items-center text-sm text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-btnColor hover:text-btnColor/60"
          >
            <CloudArrowUpIcon className="h-6 w-6 inline-block mr-1" />
            <span>Upload files</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/bmp, image/tiff, image/x-icon, image/heif, image/heic"
              className="sr-only"
              multiple
              onChange={onFileSelect}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
          <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {/* Upload Button (Outside Uploader) */}
      <button
        onClick={handleUpload}
        className={`mt-4 flex items-center justify-center gap-2 rounded-md px-5 py-2 text-white transition ${
          loading
            ? "bg-textColor/60 cursor-not-allowed"
            : "bg-textColor hover:bg-textColor/80"
        }`}
        disabled={loading}
      >
        {loading ? (
          <>
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </>
        ) : (
          <ArrowUpTrayIcon className={`h-5 w-5  `} />
        )}
      </button>
    </div>
  );
};

export default ImageUpload;
