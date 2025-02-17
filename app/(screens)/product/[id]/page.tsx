"use client";

import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import ImageSelector from "@/components/ImageIdSelector";
import Input from "@/components/custom/Input";
// import Input from "@/components/Input";

// Type definitions
interface ProductImage {
  id: number;
  displayOrder: number;
  url: string;
}

interface FormField {
  type: "text" | "textarea" | "tel";
  label: string;
  name: keyof FormData;
  required?: boolean;
  placeholder: string;
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
  images: ProductImage[];
}

interface ProductData extends Omit<FormData, "thumbnailId"> {
  thumbnail: {
    id: number;
    url: string;
  };
  images: ProductImage[];
}

const ProductUpdateForm = () => {
  const params = useParams();
  const productId = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const methods = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      details: {},
      minOrder: "",
      price: "",
      deliveryInfo: "",
      whatsappNumber: "",
      thumbnailId: "",
      subcategoryId: "",
      images: [],
    },
  });
  // Form fields configuration
  const formFields = [
    {
      type: "text",
      label: "Product Name",
      name: "name",
      required: true,
      placeholder: "Enter product name",
    },
    {
      type: "text",
      label: "Minimum Order",
      name: "minOrder",
      placeholder: "Enter minimum order quantity",
    },
    {
      type: "textarea",
      label: "Delivery Information",
      name: "deliveryInfo",
      placeholder: "Enter delivery information",
    },
    {
      type: "textarea",
      label: "Description",
      name: "description",
      required: true,
      placeholder: "Enter product description",
      className: "hidden",
    },
    {
      type: "tel",
      label: "WhatsApp Number",
      name: "whatsappNumber",
      required: true,
      placeholder: "Enter WhatsApp number",
    },
  ];

  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const handleAddImages = useCallback(
    (newImageIds: number | number[]) => {
      const idsArray = Array.isArray(newImageIds) ? newImageIds : [newImageIds];
      const newImages = idsArray.map((id) => ({
        id: Number(id),
        displayOrder: productImages.length,
        url: "",
      }));

      const updatedImages = [...productImages, ...newImages];
      // setProductImages(updatedImages);
      methods.setValue("images", updatedImages);
    },
    [productImages, methods]
  );

  const handleRemoveImage = useCallback(
    (imageId: number) => {
      const updatedImages = productImages
        .filter((img) => img.id !== imageId)
        .map((img, index) => ({
          ...img,
          displayOrder: index,
        }));
      setProductImages(updatedImages);
      methods.setValue("images", updatedImages);
    },
    [productImages, methods]
  );

  const moveImage = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newImages = [...productImages];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);

      const updatedImages = newImages.map((img, index) => ({
        ...img,
        displayOrder: index,
      }));

      setProductImages(updatedImages);
      methods.setValue("images", updatedImages);
    },
    [productImages, methods]
  );

  const handleThumbnailSelect = useCallback(
    (ids: number | number[]) => {
      const thumbnailId = Array.isArray(ids)
        ? ids[0]?.toString()
        : ids.toString();
      methods.setValue("thumbnailId", thumbnailId);
    },
    [methods]
  );

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;

      try {
        const response = await axios.get<{ data: ProductData }>(
          `/api/products/${productId}`,
          {
            headers: {
              cache: "no-store",
            },
          }
        );
        const productData = response.data.data;
        // Set form values
        methods.reset({
          name: productData.name,
          description: productData.description,
          details: productData.details,
          minOrder: productData.minOrder,
          price: productData.price,
          deliveryInfo: productData.deliveryInfo,
          whatsappNumber: productData.whatsappNumber,
          thumbnailId: productData.thumbnail.id.toString(),
          subcategoryId: productData.subcategoryId,
          images: productData.images,
        });

        setDetails(productData.details || {});

        // Set form values
        Object.entries(productData).forEach(([key, value]) => {
          if (key !== "thumbnail" && key !== "images") {
            methods.setValue(key as keyof FormData, value);
          }
        });

        // Set thumbnail
        methods.setValue("thumbnailId", productData.thumbnail.id.toString());
        setDetails(productData.details || {});

        // Set images
        const transformedImages = productData.images.map((img) => ({
          id: img.id,
          displayOrder: img.displayOrder,
          url: img.url,
        }));
        setProductImages(transformedImages);
        methods.setValue("images", transformedImages);
      } catch (error) {
        toast.error("Failed to fetch product data");
        console.error(error);
      }
    };

    fetchProductData();
  }, [productId, methods]);

  const handleAddDetail = useCallback(() => {
    if (newKey.trim() && newValue.trim()) {
      const updatedDetails = {
        ...details,
        [newKey.trim()]: newValue.trim(),
      };
      setDetails(updatedDetails);
      methods.setValue("details", updatedDetails);
      setNewKey("");
      setNewValue("");
    }
  }, [newKey, newValue, details, methods]);

  const handleRemoveDetail = useCallback(
    (key: string) => {
      const { [key]: _, ...updatedDetails } = details;
      setDetails(updatedDetails);
      methods.setValue("details", updatedDetails);
    },
    [details, methods]
  );

  const handleUpdateDetail = useCallback(
    (key: string, value: string) => {
      const updatedDetails = {
        ...details,
        [key]: value,
      };
      setDetails(updatedDetails);
      methods.setValue("details", updatedDetails);
    },
    [details, methods]
  );

  const onSubmit = async (data: FormData) => {
    console.log(data);
    setLoading(true);
    try {
      await axios.put(`/api/products/${productId}`, data);
      toast.success("Product updated successfully");
      // router.push("/products");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {formFields.map((field, index) => (
              <Input
                key={index}
                name={field.name}
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={methods.watch(field.name as keyof FormData)}
                onChange={(value) => {
                  methods.setValue(field?.name as keyof FormData, value);
                }}
                className={`col-span-1`}
              />
            ))}
          </div>

          {/* <div className="space-y-2">
            <img
              src={methods.watch("thumbnailId")}
              className="h-32 w-32"
              alt="selected thumbnail"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail
              <span className="text-red-500">*</span>
            </label>
            <ImageSelector onSelect={handleThumbnailSelect} />
          </div> */}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Product Images</h3>
              <ImageSelector onSelect={handleAddImages} multiple />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {productImages.map((image, index) => (
                <div key={image.id} className="relative group aspect-square">
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="p-1 px-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>

                    {/* {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white p-1 rounded-full shadow-md"
                      >
                        ←
                      </button>
                    )}

                    {index < productImages.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white p-1 rounded-full shadow-md"
                      >
                        →
                      </button>
                    )} */}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Details</h3>

              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex gap-4 items-start">
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleUpdateDetail(key, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(key)}
                    className="mt-6 p-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Enter detail key"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter detail value"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>

            {productImages.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No images added yet</p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default ProductUpdateForm;
