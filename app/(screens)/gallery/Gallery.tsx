"use client";
import ImageUpload from "@/components/Forms/ImageUpload";
import { useFetchData } from "@/hooks/useFetchData";
import {
  deleteAllImages,
  deleteImages,
  fetchGallaryData,
} from "@/lib/apiFuntions";
import { GalleryData } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";

const Gallery = () => {
  const {
    data: images,
    loading,
    refetch,
  } = useFetchData<GalleryData[]>(fetchGallaryData);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const closeImageModal = () => {
    setIsAddImageModalOpen(false);
  };

  const toggleImageSelection = (imageUrl: string) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(selectedImages.filter((url) => url !== imageUrl));
    } else {
      setSelectedImages([...selectedImages, imageUrl]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please select images to delete.");
      return;
    }

    setIsDeleting(true);
    const toastId = toast.loading("Deleting selected images...");

    try {
      await deleteImages({ imageUrls: selectedImages });
      await refetch();
      setSelectedImages([]);

      toast.success("Selected images deleted successfully!");
    } catch (error) {
      console.error("Failed to delete selected images:", error);
      toast.error("Failed to delete selected images. Please try again.");
    } finally {
      setIsDeleting(false);
      toast.dismiss(toastId);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting all images...");

    try {
      await deleteAllImages();
      await refetch();

      toast.success("All images deleted successfully!");
    } catch (error) {
      console.error("Failed to delete all images:", error);
      toast.error("Failed to delete all images. Please try again.");
    } finally {
      setIsDeleting(false);
      toast.dismiss(toastId);
    }
  };
  return (
    <main className="p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedImages.length === 0 || isDeleting}
          className="px-4 py-2 flex  gap-2 bg-red-500 text-white rounded-lg disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          <TrashIcon className="h-6 w-6 text-white" />
          Delete Selected
        </button>
        <button
          onClick={handleDeleteAll}
          disabled={images?.length === 0 || isDeleting}
          className="px-4 py-2 flex  gap-2 bg-red-500 text-white rounded-lg disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          <TrashIcon className="h-6 w-6 text-white" />
          Delete All
        </button>
        <button
          onClick={() => setIsAddImageModalOpen(true)}
          className="px-4 py-2 bg-textColor text-white rounded-lg hover:bg-textColor/70 flex items-center "
        >
          <PlusIcon className="h-6 w-6" /> {/* Add the plus icon */}
          Add
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="w-full h-32 bg-gray-300 animate-pulse rounded-lg flex justify-center items-center"
            >
              <PhotoIcon className="h-10 text-gray-600" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map((data, i) => (
            <div
              key={i}
              className="w-full relative group"
              onClick={() => openModal(data.imageUrl)}
            >
              <Image
                src={data.imageUrl}
                alt={data.originalName}
                height={200}
                width={200}
                className="w-full h-auto object-cover rounded-lg cursor-pointer"
              />
              <div
                className={`absolute top-2 right-2 p-2 bg-white rounded-full cursor-pointer ${
                  selectedImages.includes(data.imageUrl)
                    ? "bg-red-500"
                    : "bg-white"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening the modal
                  toggleImageSelection(data.imageUrl);
                }}
              >
                <TrashIcon className="h-5 w-5 text-red-500" />
              </div>
              {selectedImages.includes(data.imageUrl) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">Selected </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* selected image display modal */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Transition.Child
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog
            onClose={closeModal}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
          >
            <div
              className="absolute inset-0 bg-black opacity-50 z-[-99]"
              onClick={closeModal}
            ></div>
            <Transition.Child
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="bg-white p-4 rounded-lg max-w-4xl">
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    height={1000}
                    width={1000}
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Child>
      </Transition.Root>
      {/* add image modal */}
      <Transition.Root show={isAddImageModalOpen} as={Fragment}>
        <Transition.Child
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog
            onClose={closeImageModal}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
          >
            <div
              className="absolute inset-0 bg-black opacity-50 z-[-99]"
              onClick={closeImageModal}
            ></div>
            <Transition.Child
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="bg-white p-4 rounded-lg min-w-72">
                <ImageUpload
                  setIsAddImageModalOpen={setIsAddImageModalOpen}
                  refetch={refetch}
                />
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Child>
      </Transition.Root>
    </main>
  );
};

export default Gallery;
