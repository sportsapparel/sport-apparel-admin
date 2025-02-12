"use client";

import Button from "@/components/Button";
import ImageSelector from "@/components/ImageIdSelector";
import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchCatgoriesData,
  fetchSubCatgoriesDataByCategoryId,
} from "@/lib/apiFuntions";
import { CategoryData } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { revalidatePath } from "next/cache";
// Types
interface DetailField {
  key: string;
  value: string;
}

interface FormData {
  name: string;
  description: string;
  details: Record<string, string>;
  minOrder: string;
  price: string;
  deliveryInfo: string;
  whatsappNumber: string;
  thumbnailId: string;
  subcategoryId: string;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  details: {},
  minOrder: "",
  price: "",
  deliveryInfo: "",
  whatsappNumber: "",
  thumbnailId: "",
  subcategoryId: "",
};

const ProductForm = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [detailFields, setDetailFields] = useState<DetailField[]>([
    { key: "", value: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: categories, loading: categoryLoading } =
    useFetchData<CategoryData[]>(fetchCatgoriesData);

  const fetchSubCategories = useCallback(() => {
    return selectedCategory
      ? fetchSubCatgoriesDataByCategoryId(Number(selectedCategory))
      : null;
  }, [selectedCategory]);

  const { data: subcategories, loading: subCategoryLoading } = useFetchData(
    // @ts-expect-error: unsused err
    fetchSubCategories ?? (() => Promise.reject(new Error("Invalid category")))
  );

  const handleFormChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleDetailFieldChange = useCallback(
    (index: number, field: keyof DetailField, value: string) => {
      setDetailFields((prev) => {
        const newFields = [...prev];
        newFields[index][field] = value;
        return newFields;
      });

      setFormData((prev) => ({
        ...prev,
        details: detailFields.reduce((acc, field) => {
          if (field.key && field.value) {
            acc[field.key] = field.value;
          }
          return acc;
        }, {} as Record<string, string>),
      }));
    },
    [detailFields]
  );

  const addDetailField = useCallback(() => {
    setDetailFields((prev) => [...prev, { key: "", value: "" }]);
  }, []);

  const removeDetailField = useCallback((index: number) => {
    setDetailFields((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleImageSelect = useCallback((ids: number | number[]) => {
    const thumbnailId = Array.isArray(ids)
      ? ids[0]?.toString()
      : ids.toString();
    setFormData((prev) => ({ ...prev, thumbnailId }));
  }, []);

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(1, prev - 1));
    if (step === 2) {
      setSelectedCategory("");
    }
    if (step === 3) {
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
    }
  }, [step]);

  const handleNext = useCallback((nextStep: number) => {
    setStep(nextStep);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.description ||
      !formData.whatsappNumber ||
      !formData.subcategoryId
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/products", formData);
      // Reset form after successful submission
      setFormData(initialFormData);
      setDetailFields([{ key: "", value: "" }]);
      revalidatePath("/product");
      setSelectedCategory("");
      toast.success(res?.data?.message || "Product created successfully");
      // You might want to show a success message or redirect here
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderBackButton = useMemo(() => {
    if (step === 1) return null;

    return (
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-800"
      >
        <i className="fa fa-arrow-down"></i> Back
      </button>
    );
  }, [step, handleBack]);

  const renderStepContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                handleNext(2);
              }}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoryLoading && (
              <p className="text-sm text-gray-500">Loading categories...</p>
            )}
            {categories?.length === 0 && (
              <p>
                No categories available click to add new{" "}
                <Link href={"/category"} className="text-green-500">
                  Category
                </Link>
              </p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Subcategory
            </label>
            <select
              value={formData.subcategoryId}
              onChange={(e) => {
                handleFormChange("subcategoryId", e.target.value);
                handleNext(3);
              }}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a subcategory</option>
              {Array.isArray(subcategories) &&
                subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
            </select>
            {subCategoryLoading && (
              <p className="text-sm text-gray-500">Loading subcategories...</p>
            )}
            {subcategories?.length === 0 && (
              <p>
                No sub categories available click to add new{" "}
                <Link
                  href={`/sub-categories/${selectedCategory}`}
                  className="text-green-500"
                >
                  Sub Category
                </Link>
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full p-2 mt-1 border border-gray-300 rounded"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Details
              </label>
              <div className="space-y-3">
                {detailFields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={field.key}
                      onChange={(e) =>
                        handleDetailFieldChange(index, "key", e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) =>
                        handleDetailFieldChange(index, "value", e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeDetailField(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      {/* <Trash2 size={20} /> */}
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDetailField}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                >
                  <i className="fa fa-plus"></i> Add Detail
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Order
              </label>
              <input
                type="text"
                value={formData.minOrder}
                onChange={(e) => handleFormChange("minOrder", e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Delivery Information
              </label>
              <textarea
                value={formData.deliveryInfo}
                onChange={(e) =>
                  handleFormChange("deliveryInfo", e.target.value)
                }
                className="w-full p-2 mt-1 border border-gray-300 rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  handleFormChange("whatsappNumber", e.target.value)
                }
                className="w-full p-2 mt-1 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <div className="mt-1">
                <ImageSelector onSelect={handleImageSelect} />
                {formData.thumbnailId && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected image ID: {formData.thumbnailId}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  }, [
    step,
    selectedCategory,
    formData,
    categories,
    subcategories,
    categoryLoading,
    subCategoryLoading,
    loading,
    error,
    detailFields,
    handleFormChange,
    handleDetailFieldChange,
    removeDetailField,
    handleImageSelect,
  ]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
      {renderBackButton}
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent}
      </form>
    </div>
  );
};

export default ProductForm;
