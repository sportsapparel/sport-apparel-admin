import React, { ReactNode, useState } from "react";
import Button from "./Button";

// Define the props for the reusable button component
interface IconModalButtonProps {
  buttonText?: string;
  buttonIcon?: React.ReactNode; // Customizable button icon
  modalTitle?: string;
  modalMessage?: string;

  modalContent?: ReactNode;
  onSave: () => void; // Action to be triggered on save
  loading?: boolean;
  bypassModal?: boolean; // New prop to bypass the modal
}

const IconModalButton: React.FC<IconModalButtonProps> = ({
  buttonText,
  buttonIcon,
  modalTitle,
  modalMessage,
  modalContent,
  onSave,
  loading,
  bypassModal = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    onSave();
    closeModal();
  };

  const handleButtonClick = () => {
    if (bypassModal) {
      onSave();
    } else {
      openModal();
    }
  };

  return (
    <>
      <button onClick={handleButtonClick}>
        {buttonIcon && <span>{buttonIcon}</span>}
        {buttonText && buttonText}
      </button>

      {!bypassModal && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
          message={modalMessage}
          modalContent={modalContent}
          onSave={handleSave}
          loading={loading}
        />
      )}
    </>
  );
};
export default IconModalButton;

// Define the props for the custom modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onSave: () => void;
  loading?: boolean;
  modalContent?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onSave,
  loading,
  modalContent,
}) => {
  if (!isOpen) return null; // Ensure the modal is not rendered if isOpen is false

  // Function to handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click is on the overlay itself (not the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={handleOverlayClick} // Add click handler for the overlay
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          width: "400px",
          maxWidth: "90%",
          textAlign: "left",
        }}
      >
        {title && (
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: "20px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            {title}
          </h2>
        )}

        {message && (
          <div
            className="text-wrap"
            style={{
              marginBottom: "24px",
              fontSize: "14px",
              color: "#555",
              lineHeight: "1.5",
            }}
          >
            {message}
          </div>
        )}

        {modalContent && modalContent}

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSave} loading={loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Usage example
{
  /* <IconModalButton
  buttonText="Save"
  buttonIcon={<FaSave />} // Custom icon
  modalTitle="Confirm Save"
  modalMessage="Are you sure you want to save?"
  onSave={handleSave}
  bypassModal={true} // Bypass the modal and directly trigger onSave
/>; */
}
