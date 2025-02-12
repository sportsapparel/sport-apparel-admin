"use client";

import ImageSelector from "@/components/ImageSelector";
import Input, { FormField } from "@/components/Input";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../Button";

interface SubCategoryFormData {
  name: string;
  description: string;
  image: string;
  categoryId: number;
}

const CreateSubCategoryForm = ({
  setIsOpen,
  categoryId,
  refetch,
}: {
  setIsOpen: (isOpen: boolean) => void;
  categoryId: number;
  refetch: any;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SubCategoryFormData>({
    defaultValues: { name: "", description: "", image: "" },
  });

  const { handleSubmit, setValue, watch } = methods;
  const formData = watch();

  const selectImage = (imageUrl: string) => {
    setValue("image", imageUrl, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: SubCategoryFormData) => {
    setIsSubmitting(true);
    try {
      const subCategoryData = {
        // @ts-expect-error: unsused err
        categoryId,
        ...data,
      };
      console.log(subCategoryData, "subCategory");
      await axios.post("/api/subcategories", subCategoryData);
      await refetch();
      toast.success("Subcategory created successfully!");
      setIsOpen(false);
      methods.reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create subcategory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: FormField[] = [
    {
      type: "text",
      label: "Name",
      name: "name",
      required: true,
      placeholder: "Enter subcategory name",
    },
    {
      type: "textarea",
      label: "Description",
      name: "description",
      placeholder: "Enter subcategory description",
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field) => (
            <Input key={field.name} field={field} />
          ))}

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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <i className="fa-solid fa-spinner h-4 w-4 animate-spin" />
            )}
            {isSubmitting ? "Creating Subcategory..." : "Create Subcategory"}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

export default CreateSubCategoryForm;
