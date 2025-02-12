"use client";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchGallaryData } from "@/lib/apiFuntions";
import { GalleryData } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useState } from "react";

interface ImageSelectorProps {
  onSelect: (imageUrl: string) => void; // Function to handle image selection
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onSelect }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { data: images, loading } =
    useFetchData<GalleryData[]>(fetchGallaryData);

  const handleSelectImage = (imageUrl: string) => {
    onSelect(imageUrl); // Pass the selected image back
    setIsGalleryOpen(false);
  };

  return (
    <div>
      {/* Button to open gallery */}
      <div onClick={() => setIsGalleryOpen(true)}>
        <i className="fa-duotone fa-solid fa-image text-4xl cursor-pointer"></i>
      </div>

      {/* Image Gallery Modal */}
      <Transition.Root show={isGalleryOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={setIsGalleryOpen}
        >
          <div className="flex min-h-screen items-center justify-center px-4">
            <Transition.Child
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0">
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
            </Transition.Child>

            <Transition.Child
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className=" relative w-full max-w-3xl h-auto bg-white rounded-xl p-8 shadow-xl mx-auto">
                <Dialog.Title className="text-lg font-medium mb-6">
                  Select Image
                </Dialog.Title>

                <div className="max-h-[70vh] overflow-y-auto px-2">
                  {loading ? (
                    <div className="grid grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-gray-200 rounded-md animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {images?.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleSelectImage(image.imageUrl)}
                        >
                          <Image
                            src={image.imageUrl}
                            alt={image.originalName}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ImageSelector;
