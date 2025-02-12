"use client";

import ImageSelector from "@/components/ImageSelector";
import Input, { FormField } from "@/components/Input"; // Reusable Input Component
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../Button";

interface CategoryFormData {
  name: string;
  description: string;
  image: string;
}

const CreateCategoryForm = ({
  setIsOpen,
  refetch,
}: {
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => void;
}) => {
  const methods = useForm<CategoryFormData>({
    defaultValues: { name: "", description: "", image: "" },
  });
  const { handleSubmit, setValue, watch } = methods;
  const formData = watch();
  const [isCategoryFromLoading, setIsCategoryFromLoading] = useState(false);
  // Function to handle image selection
  const selectImage = (imageUrl: string) => {
    setValue("image", imageUrl, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsCategoryFromLoading(true);

      await axios.post("/api/category", data);
      toast.success("Category created successfully!");

      await refetch();
      setIsCategoryFromLoading(false);
      setIsOpen(false);
      methods.reset();
    } catch (error) {
      setIsCategoryFromLoading(false);
      console.error("Error:", error);
      toast.error("Failed to create category. Please try again.");
    }
  };

  // Define form fields dynamically
  const fields: FormField[] = [
    {
      type: "text",
      label: "Name",
      name: "name",
      required: true,
      placeholder: "Enter category name",
    },
    {
      type: "textarea",
      label: "Description",
      name: "description",
      placeholder: "Enter category description",
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field) => (
            <Input key={field.name} field={field} />
          ))}

          {/* Image Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Image
            </label>
            <div className="mt-1 flex items-center gap-4">
              <ImageSelector onSelect={selectImage} />

              {formData.image && (
                <div className="relative w-24 h-24">
                  <Image
                    src={formData.image}
                    alt="Selected"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <Button loading={isCategoryFromLoading} type="submit">
            Create Category
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

export default CreateCategoryForm;
