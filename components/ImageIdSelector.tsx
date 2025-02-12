"use client";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchGallaryData } from "@/lib/apiFuntions";
import { GalleryData } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useState } from "react";

interface ImageSelectorProps {
  onSelect: (ids: number[] | number) => void; // Function to handle image selection
  multiple?: boolean; // Prop to enable multiple selections
}

const ImageIdSelector: React.FC<ImageSelectorProps> = ({
  onSelect,
  multiple = false,
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const { data: images, loading } =
    useFetchData<GalleryData[]>(fetchGallaryData);

  const handleSelectImage = (id: number) => {
    if (multiple) {
      // If multiple selections are enabled, toggle the selection
      setSelectedImages(
        (prevSelected) =>
          prevSelected.includes(id)
            ? prevSelected.filter((selectedId) => selectedId !== id) // Deselect if already selected
            : [...prevSelected, id] // Select if not already selected
      );
    } else {
      // If single selection, pass the selected image ID directly
      onSelect(id);
      setIsGalleryOpen(false);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple) {
      onSelect(selectedImages); // Pass the array of selected image IDs
      setIsGalleryOpen(false);
      setSelectedImages([]); // Clear the selection after confirming
    }
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
              <div className="relative w-full max-w-3xl h-auto bg-white rounded-xl p-8 shadow-xl mx-auto">
                <div className="flex justify-between">
                  <Dialog.Title className="text-lg font-medium mb-6">
                    Select Image{multiple ? "s" : ""}
                  </Dialog.Title>
                  <i
                    className="fa fa-close text-2xl cursor-pointer"
                    onClick={() => setIsGalleryOpen(false)}
                  ></i>
                </div>

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
                          className={`relative aspect-square cursor-pointer hover:opacity-80 transition-opacity ${
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm button for multiple selections */}
                {multiple && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleConfirmSelection}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
