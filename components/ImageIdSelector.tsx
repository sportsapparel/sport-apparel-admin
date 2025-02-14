import { useFetchData } from "@/hooks/useFetchData";
import { fetchGallaryData } from "@/lib/apiFuntions";
import { GalleryData } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";

interface ImageSelectorProps {
  onSelect: (ids: number[] | number) => void;
  multiple?: boolean;
}

const ImageIdSelector: React.FC<ImageSelectorProps> = ({
  onSelect,
  multiple = false,
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [selectedImageData, setSelectedImageData] = useState<GalleryData[]>([]);
  const { data: images, loading } =
    useFetchData<GalleryData[]>(fetchGallaryData);

  useEffect(() => {
    if (images) {
      const imageData = selectedImages
        .map((id) => images.find((img) => Number(img.id) === id))
        .filter((img): img is GalleryData => img !== undefined);
      setSelectedImageData(imageData);
    }
  }, [selectedImages, images]);

  const handleSelectImage = (id: number) => {
    if (multiple) {
      setSelectedImages((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((selectedId) => selectedId !== id)
          : [...prevSelected, id]
      );
    } else {
      onSelect(id);
      setIsGalleryOpen(false);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple) {
      onSelect(selectedImages);
      setIsGalleryOpen(false);
    }
  };

  const handleRemoveImage = (id: number) => {
    setSelectedImages((prev) => prev.filter((imageId) => imageId !== id));
  };

  return (
    <div className="space-y-4">
      {/* Preview Section */}
      {selectedImageData.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {selectedImageData.map((image) => (
            <div key={image.id} className="relative aspect-square group">
              <Image
                src={image.imageUrl}
                alt={image.originalName}
                fill
                className="object-cover rounded-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(Number(image.id));
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fa-duotone fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Button */}
      <div
        onClick={() => setIsGalleryOpen(true)}
        className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-4 py-2"
      >
        <i className="fa-duotone fa-solid fa-image text-2xl"></i>
        <span>Select Images</span>
      </div>

      {/* Gallery Modal */}
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
              <div className="relative w-full max-w-3xl bg-white rounded-xl p-8 shadow-xl mx-auto">
                <div className="flex justify-between items-center">
                  <Dialog.Title className="text-lg font-medium">
                    Select Image{multiple ? "s" : ""}
                  </Dialog.Title>
                  <button
                    onClick={() => setIsGalleryOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fa-duotone fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="mt-6 max-h-[70vh] overflow-y-auto px-2">
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
                      {images?.map((image) => (
                        <div
                          key={image.id}
                          className={`relative aspect-square cursor-pointer group ${
                            selectedImages.includes(Number(image.id))
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => handleSelectImage(Number(image.id))}
                        >
                          <Image
                            src={image.imageUrl}
                            alt={image.originalName}
                            fill
                            className="object-cover rounded-md"
                          />
                          {selectedImages.includes(Number(image.id)) && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                              <div className="bg-white rounded-full p-2 px-3.5">
                                <i className="fa-solid fa-check text-black"></i>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {multiple && (
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {selectedImages.length} image
                      {selectedImages.length !== 1 ? "s" : ""} selected
                    </span>
                    <button
                      onClick={handleConfirmSelection}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Confirm Selection
                    </button>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ImageIdSelector;
// "use client";
// import { useFetchData } from "@/hooks/useFetchData";
// import { fetchGallaryData } from "@/lib/apiFuntions";
// import { GalleryData } from "@/types";
// import { Dialog, Transition } from "@headlessui/react";
// import Image from "next/image";
// import React, { Fragment, useState } from "react";

// interface ImageSelectorProps {
//   onSelect: (id: number) => void; // Function to handle image selection
// }

// const ImageIdSelector: React.FC<ImageSelectorProps> = ({ onSelect }) => {
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const { data: images, loading } =
//     useFetchData<GalleryData[]>(fetchGallaryData);

//   const handleSelectImage = (id: number) => {
//     onSelect(Number(id)); // Pass the selected image back
//     setIsGalleryOpen(false);
//   };

//   return (
//     <div>
//       {/* Button to open gallery */}
//       <div onClick={() => setIsGalleryOpen(true)}>
//         <i className="fa-duotone fa-solid fa-image text-4xl cursor-pointer"></i>
//       </div>

//       {/* Image Gallery Modal */}
//       <Transition.Root show={isGalleryOpen} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed inset-0 z-50 overflow-y-auto"
//           onClose={setIsGalleryOpen}
//         >
//           <div className="flex min-h-screen items-center justify-center px-4">
//             <Transition.Child
//               enter="transition-opacity duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="transition-opacity duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <div className="fixed inset-0">
//                 <div className="absolute inset-0 bg-black opacity-50"></div>
//               </div>
//             </Transition.Child>

//             <Transition.Child
//               enter="transition-opacity duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="transition-opacity duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <div className=" relative w-full max-w-3xl h-auto bg-white rounded-xl p-8 shadow-xl mx-auto">
//                 <Dialog.Title className="text-lg font-medium mb-6">
//                   Select Image
//                 </Dialog.Title>

//                 <div className="max-h-[70vh] overflow-y-auto px-2">
//                   {loading ? (
//                     <div className="grid grid-cols-3 gap-4">
//                       {[...Array(6)].map((_, i) => (
//                         <div
//                           key={i}
//                           className="aspect-square bg-gray-200 rounded-md animate-pulse"
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-3 gap-4">
//                       {images?.map((image, index) => (
//                         <div
//                           key={index}
//                           className="relative aspect-square cursor-pointer hover:opacity-80 transition-opacity"
//                           onClick={() => handleSelectImage(Number(image.id))}
//                         >
//                           <Image
//                             src={image.imageUrl}
//                             alt={image.originalName}
//                             fill
//                             className="object-cover rounded-md"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition.Root>
//     </div>
//   );
// };

// export default ImageIdSelector;
