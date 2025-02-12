import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

interface ModalProps {
  /**
   * Controls the visibility of the modal
   */
  isOpen: boolean;

  /**
   * Callback function when modal is closed
   */
  onClose: () => void;

  /**
   * Content to be rendered inside the modal
   */
  children: ReactNode;

  /**
   * Optional title for the modal
   */
  title?: string;

  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Maximum width class for the modal
   * @default "max-w-3xl"
   */
  maxWidth?: string;

  /**
   * Additional CSS classes to apply to the modal
   */
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  maxWidth = "max-w-3xl",
  className = "",
}: ModalProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0">
              <div className="absolute inset-0 bg-black opacity-50" />
            </div>
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={`relative w-full ${maxWidth} transform bg-white 
                rounded-xl shadow-xl transition-all h-auto ${className}`}
            >
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white 
                    transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 
                    focus:ring-gray-400 focus:ring-offset-2"
                >
                  <i className="fa-solid fa-xmark"></i>
                  <span className="sr-only">Close</span>
                </button>
              )}

              {title && (
                <Dialog.Title className="text-lg font-medium px-8 pt-8">
                  {title}
                </Dialog.Title>
              )}

              <div className="max-h-[70vh] overflow-y-auto p-8">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
